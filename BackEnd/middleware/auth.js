const jwt = require('jsonwebtoken');

// Clave secreta obtenida del archivo .env
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para autenticar un token JWT.
 * Valida el token del header 'Authorization' y, si es válido,
 * adjunta la información del usuario (payload) al objeto `req`.
 */
function authenticateToken(req, res, next) {
    // 1. Obtener el token del header. Formato esperado: "Bearer <TOKEN>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae solo el token

    if (token == null) {
        // 401 Unauthorized: No se proporcionó token
        return res.status(401).send({ message: 'Acceso denegado. Se requiere un token.' });
    }

    // 2. Verificar el token usando la clave secreta
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: El token es inválido, ha expirado o ha sido manipulado
            return res.status(403).send({ message: 'Token inválido o expirado.' });
        }

        // 3. Si el token es válido, adjuntamos el payload (ej: { userId: 5, role: 'Contratista' })
        // a la solicitud para que las siguientes funciones puedan usarlo.
        req.user = user;

        // 4. Continuar con la siguiente función en la cadena (el controlador)
        next();
    });
}

module.exports = {
    authenticateToken,
};