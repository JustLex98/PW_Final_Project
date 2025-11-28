const { executeQuery, sql } = require('../db/db');

async function getAllContractors(req, res) {
    const { search, category } = req.query;

    try {
        let query = `
            SELECT 
                u.UserID, u.FirstName, u.LastName,
                cp.BusinessName, cp.Bio, cp.YearsOfExperience,
                (
                    SELECT STRING_AGG(c.CategoryName, ', ')
                    FROM ContractorCategories cc
                    JOIN Categories c ON cc.CategoryID = c.CategoryID
                    WHERE cc.UserID = u.UserID
                ) AS Categories
            FROM 
                Users u
            JOIN 
                ContractorProfiles cp ON u.UserID = cp.UserID
            WHERE 
                u.UserRole = 'Contratista'
        `;

        const params = [];
        let conditions = [];

        if (search) {
            conditions.push(`(cp.BusinessName LIKE @searchTerm OR cp.Bio LIKE @searchTerm OR u.FirstName LIKE @searchTerm OR u.LastName LIKE @searchTerm)`);
            params.push({ name: 'searchTerm', type: sql.NVarChar, value: `%${search}%` });
        }

        if (category) {
            conditions.push(`u.UserID IN (SELECT cc.UserID FROM ContractorCategories cc JOIN Categories c ON cc.CategoryID = c.CategoryID WHERE c.CategoryName = @categoryName)`);
            params.push({ name: 'categoryName', type: sql.NVarChar, value: category });
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        const result = await executeQuery(query, params);
        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener la lista de contratistas:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    getAllContractors, // Solo exportamos la función que queda.
};