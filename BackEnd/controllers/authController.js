const { executeQuery, sql } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Maneja el registro de un nuevo usuario.
 */
async function register(req, res) {
    const { firstName, lastName, email, password, userRole } = req.body;

    if (!email || !password || !firstName || !lastName || !userRole) {
        return res.status(400).send({ message: 'Faltan campos obligatorios.' });
    }
    if (userRole !== 'Cliente' && userRole !== 'Contratista') {
        return res.status(400).send({ message: 'Rol inválido.' });
    }

    try {
        // --- CORRECCIÓN: Usar el nuevo formato de parámetros ---
        const checkParams = [{ name: 'email', type: sql.NVarChar, value: email }];
        const existingUser = await executeQuery('SELECT Email FROM Users WHERE Email = @email', checkParams);

        if (existingUser.recordset.length > 0) {
            return res.status(409).send({ message: 'El correo ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = `
            INSERT INTO Users (Email, PasswordHash, FirstName, LastName, UserRole)
            VALUES (@email, @passwordHash, @firstName, @lastName, @userRole);
        `;
        // --- CORRECCIÓN: Usar el nuevo formato de parámetros ---
        const insertParams = [
            { name: 'firstName', type: sql.NVarChar, value: firstName },
            { name: 'lastName', type: sql.NVarChar, value: lastName },
            { name: 'email', type: sql.NVarChar, value: email },
            { name: 'passwordHash', type: sql.NVarChar, value: hashedPassword },
            { name: 'userRole', type: sql.NVarChar, value: userRole }
        ];
        await executeQuery(insertQuery, insertParams);

        res.status(201).send({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

/**
 * Maneja el inicio de sesión de un usuario.
 */
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Debe proporcionar correo y contraseña.' });
    }

    try {
        const query = 'SELECT UserID, PasswordHash, UserRole, FirstName FROM Users WHERE Email = @email';
        // --- CORRECCIÓN: Usar el nuevo formato de parámetros ---
        const params = [{ name: 'email', type: sql.NVarChar, value: email }];
        const result = await executeQuery(query, params);

        const user = result.recordset[0];
        if (!user) {
            return res.status(401).send({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).send({ message: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ userId: user.UserID, role: user.UserRole }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({
            message: 'Inicio de sesión exitoso.',
            token: token,
            userId: user.UserID,
            role: user.UserRole,
            name: user.FirstName
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    register,
    login,
};
