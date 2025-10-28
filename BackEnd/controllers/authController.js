const { executeQuery, sql } = require("../db/db"); // Módulo de conexión que acabas de crear
const bcrypt = require("bcryptjs"); // Para el hashing de contraseñas
const jwt = require("jsonwebtoken"); // Para la generación de tokens

// Clave secreta obtenida del archivo .env
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Maneja el registro de un nuevo usuario (Cliente o Contratista).
 */
async function register(req, res) {
  // 1. Desestructuración de datos esperados del Frontend
  const { firstName, lastName, email, password, userRole } = req.body;

  // 2. Validación de Entrada Básica
  if (!email || !password || !firstName || !lastName || !userRole) {
    return res.status(400).send({ message: "Faltan campos obligatorios." });
  }
  if (userRole !== "Cliente" && userRole !== "Contratista") {
    return res
      .status(400)
      .send({ message: 'Rol inválido. Debe ser "Cliente" o "Contratista".' });
  }

  try {
    // 3. Verificar si el correo ya está registrado (Consulta SQL protegida con parámetros)
    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.NVarChar, email);

    const existingUser = await executeQuery(
      "SELECT Email FROM Users WHERE Email = @email",
      checkRequest
    );

    if (existingUser.recordset.length > 0) {
      return res.status(409).send({ message: "El correo ya está registrado." });
    }

    // 4. Hashing de la Contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Inserción en la Base de Datos
    const insertRequest = new sql.Request();
    insertRequest.input("firstName", sql.NVarChar, firstName);
    insertRequest.input("lastName", sql.NVarChar, lastName);
    insertRequest.input("email", sql.NVarChar, email);
    insertRequest.input("passwordHash", sql.NVarChar, hashedPassword);
    insertRequest.input("userRole", sql.NVarChar, userRole);

    const query = `
            INSERT INTO Users (Email, PasswordHash, FirstName, LastName, UserRole)
            VALUES (@email, @passwordHash, @firstName, @lastName, @userRole);
        `;

    await executeQuery(query, insertRequest);

    res.status(201).send({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send({ message: "Error interno del servidor." });
  }
}

/**
 * Maneja el inicio de sesión de un usuario.
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Debe proporcionar correo y contraseña." });
  }

  try {
    // 1. Buscar el usuario por correo
    const findRequest = new sql.Request();
    findRequest.input("email", sql.NVarChar, email);

    const result = await executeQuery(
      // Solo seleccionar la información necesaria, incluyendo el hash de la contraseña
      "SELECT UserID, PasswordHash, UserRole, FirstName FROM Users WHERE Email = @email",
      findRequest
    );

    const user = result.recordset[0];

    if (!user) {
      // Error de credenciales genérico por seguridad
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    // 2. Comparar la contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    // 3. Generar JWT (JSON Web Token)
    const token = jwt.sign(
      {
        userId: user.UserID,
        role: user.UserRole,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expira en 1 día
    );

    // 4. Respuesta exitosa: incluye el token y el rol
    res.status(200).send({
      message: "Inicio de sesión exitoso.",
      token: token,
      userId: user.UserID,
      role: user.UserRole,
      name: user.FirstName,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send({ message: "Error interno del servidor." });
  }
}

module.exports = {
  register,
  login,
};
