const { executeQuery, sql } = require("../db/db"); 
const bcrypt = require("bcryptjs"); // 🔒 Hashing de contraseñas (Seguridad crítica).
const jwt = require("jsonwebtoken"); // 🔑 Generación de tokens de sesión (JWT).

// Clave secreta obtenida del archivo .env
const JWT_SECRET = process.env.JWT_SECRET;

/*
 * NOTA DE IMPLEMENTACIÓN:
 * Este código fue implementado con asistencia de Inteligencia Artificial.
 * * ¿Por qué es necesario el hashing (bcrypt)? 
 * Para NUNCA guardar las contraseñas reales. Si la base de datos se filtra, 
 * solo se exponen los hashes (irreversibles).
 * * ¿Por qué es necesario el JWT (jsonwebtoken)?
 * Para crear un token de sesión seguro que el usuario puede usar para probar su identidad
 * en peticiones futuras (estar "logeado") sin enviar la contraseña cada vez.
 */

/**
 * Maneja el registro de un nuevo usuario (Cliente o Contratista).
 */
async function register(req, res) {
  // 1. Desestructuración de datos esperados del Frontend
  const { firstName, lastName, email, password, userRole } = req.body;

  // 2. Validación: Revisa que todos los datos y el rol sean válidos.
  if (!email || !password || !firstName || !lastName || !userRole) {
    return res.status(400).send({ message: "Faltan campos obligatorios." });
  }
  if (userRole !== "Cliente" && userRole !== "Contratista") {
    return res
      .status(400)
      .send({ message: 'Rol inválido. Debe ser "Cliente" o "Contratista".' });
  }

  try {
    // 3. Comprueba si el correo ya existe. (Usando consulta parametrizada por seguridad)
    const checkRequest = new sql.Request().input("email", sql.NVarChar, email);

    const existingUser = await executeQuery(
      "SELECT Email FROM Users WHERE Email = @email",
      checkRequest
    );

    if (existingUser.recordset.length > 0) {
      return res.status(409).send({ message: "El correo ya está registrado." });
    }

    // 4. Hashing: Encripta la contraseña para NO guardarla en texto plano.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Inserción: Guarda el nuevo usuario (con el hash) en la DB.
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
    // 1. Busca el usuario y su hash de contraseña en la DB.
    const findRequest = new sql.Request().input("email", sql.NVarChar, email);

    const result = await executeQuery(
      // Selecciona solo la información necesaria, incluyendo el hash de la contraseña
      "SELECT UserID, PasswordHash, UserRole, FirstName FROM Users WHERE Email = @email",
      findRequest
    );

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    // 2. Compara la contraseña ingresada con el hash almacenado (bcrypt).
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    // 3. Genera un Token de Sesión (JWT) para mantener al usuario logeado.
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