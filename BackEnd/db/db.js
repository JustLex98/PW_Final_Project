require('dotenv').config(); // Carga variables de entorno (.env).
const sql = require('mssql'); // Módulo de SQL Server.

// Configuración de la conexión usando variables de entorno.
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    // Configuración del Pool: crucial para el rendimiento.
    pool: {
        max: 10, // Máximo de 10 conexiones disponibles simultáneamente.
        min: 0,
        idleTimeoutMillis: 30000 // Cierra conexiones inactivas después de 30 segundos.
    },
    options: {
        encrypt: false,
        trustedConnection: false,
        enableArithAbort: true
    }
};

// Crea un Pool de Conexiones global.
const pool = new sql.ConnectionPool(config);
let poolConnect; 

/**
 * Por sugerencia de la IA: El Pool de Conexiones es necesario para el rendimiento.
 * Mantiene las conexiones listas, evitando la sobrecarga de abrirlas y cerrarlas 
 * en cada solicitud, haciendo el servidor más eficiente y escalable.
 */
async function connectPool() {
    try {
        if (!poolConnect) {
            poolConnect = pool.connect(); 
        }
        await poolConnect; 
        console.log('✅ Conexión al Pool SQL establecida.');
    } catch (err) {
        console.error('❌ ERROR AL CONECTAR EL POOL SQL:', err.message);
        throw err;
    }
}
connectPool();

/**
 * Función central para ejecutar consultas.
 * Por sugerencia de la IA: Se implementaron consultas parametrizadas (usando req.input) 
 * para prevenir la Inyección SQL, tratando los datos del usuario de forma segura.
 */
async function executeQuery(query, request) {
    await poolConnect;

    try {
        const req = pool.request(); 

        // Se añaden los parámetros de forma segura (prevención SQL Injection).
        if (request && request.parameters) {
            for (const name in request.parameters) {
                const param = request.parameters[name];
                req.input(name, param.type, param.value);
            }
        }

        const result = await req.query(query);
        return result;
    } catch (err) {
        console.error("Error en la consulta SQL:", err);
        throw err;
    }
}

// Exporta la función y el objeto sql.
module.exports = {
    executeQuery,
    sql
};