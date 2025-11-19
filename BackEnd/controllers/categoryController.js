const { executeQuery, sql } = require('../db/db');

/**
 * Obtiene una lista de todas las categorías de servicios disponibles.
 */
async function getAllCategories(req, res) {
    try {
        const query = 'SELECT CategoryID, CategoryName, Description FROM Categories ORDER BY CategoryName ASC;';
        
        // No se necesitan parámetros, por lo que no creamos un objeto 'request'
        const result = await executeQuery(query);
        
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener las categorías:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    getAllCategories,
};