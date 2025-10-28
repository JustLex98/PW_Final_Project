require('dotenv').config(); 
const sql = require('mssql');

// Objeto de configuración para la conexión
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000 
    },
    options: {
        encrypt: false, 
        trustedConnection: false, 
        enableArithAbort: true
    }
};

// Crea un Pool de Conexiones global
const pool = new sql.ConnectionPool(config);
let poolConnect; 

// Función para conectar el pool (llamada una sola vez al inicio)
async function connectPool() {
    try {
        if (!poolConnect) {
            poolConnect = pool.connect();
        }
        await poolConnect;
        console.log('✅ Conexión al Pool SQL establecida.');
    } catch (err) {
        console.error('❌ ERROR AL CONECTAR EL POOL SQL:', err.message);
        throw err; // Detiene la aplicación si la conexión inicial falla
    }
}
connectPool(); // Intenta conectar el pool al iniciar la aplicación

/**
 * Función central para ejecutar cualquier consulta SQL usando el Pool.
 */
async function executeQuery(query, request) {
    // 1. Espera a que la conexión del pool esté lista
    await poolConnect; 
    
    try {
        // 2. Ejecuta la consulta en el pool
        const req = pool.request(); // Usa el pool para obtener un Request
        
        // Si hay un objeto request de entrada, copiamos sus parámetros
        if (request && request.parameters) {
             // mssql no expone request.parameters directamente, así que lo haríamos con un bucle
             for (const name in request.parameters) {
                 const param = request.parameters[name];
                 req.input(name, param.type, param.value);
             }
        }
        
        const result = await req.query(query);
        return result;
    } catch (err) {
        // Aquí manejamos errores de consulta (ej. tabla no existe, llave duplicada, etc.)
        console.error("Error en la consulta SQL:", err);
        throw err; 
    } 
}

// Exportamos la función y el objeto sql
module.exports = {
    executeQuery,
    sql
};