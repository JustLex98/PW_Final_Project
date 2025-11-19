require('dotenv').config(); // Carga variables de entorno (.env).
const sql = require('mssql'); // Módulo de SQL Server.

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

const pool = new sql.ConnectionPool(config);
let poolConnect; 

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
 * Función central para ejecutar consultas SQL usando el Pool.
 * @param {string} query La consulta SQL con parámetros (@nombre).
 * @param {Array} params Un array de objetos para los parámetros. Ej: [{ name: 'userId', type: sql.Int, value: 1 }]
 */
async function executeQuery(query, params = []) {
    await poolConnect; 
    
    try {
        const request = pool.request();
        // Añadir cada parámetro a la solicitud
        params.forEach(param => {
            request.input(param.name, param.type, param.value);
        });
        
        const result = await request.query(query);
        return result;
    } catch (err) {
        console.error("Error en la consulta SQL:", err);
        throw err;
    }
}

module.exports = {
    executeQuery,
    sql
};