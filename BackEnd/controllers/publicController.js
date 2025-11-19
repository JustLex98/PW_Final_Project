const { executeQuery, sql } = require('../db/db');

/**
 * Obtiene una lista pública de contratistas, con opción de filtrado.
 */
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
            FROM Users u
            JOIN ContractorProfiles cp ON u.UserID = cp.UserID
            WHERE u.UserRole = 'Contratista'
        `;

        // --- CORRECCIÓN: Usar el nuevo formato de parámetros ---
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

/**
 * Obtiene el perfil detallado y público de un solo contratista, incluyendo sus reseñas.
 */
async function getContractorById(req, res) {
    const { id } = req.params;

    try {
        const profileQuery = `
            SELECT 
                u.UserID, u.FirstName, u.LastName, u.Email,
                cp.BusinessName, cp.PhoneNumber, cp.Bio, cp.YearsOfExperience
            FROM Users u
            LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
            WHERE u.UserID = @contractorId AND u.UserRole = 'Contratista';
        `;
        
        const reviewsQuery = `
            SELECT 
                r.Rating, r.Comment, r.CreatedAt,
                c.FirstName AS ClientFirstName
            FROM Reviews r
            JOIN Users c ON r.ClientID = c.UserID
            WHERE r.ContractorID = @contractorId
            ORDER BY r.CreatedAt DESC;
        `;

        // --- CORRECCIÓN: Usar el nuevo formato de parámetros ---
        const params = [{ name: 'contractorId', type: sql.Int, value: id }];

        const profileResult = await executeQuery(profileQuery, params);
        const reviewsResult = await executeQuery(reviewsQuery, params);

        if (profileResult.recordset.length === 0) {
            return res.status(404).send({ message: 'Contratista no encontrado.' });
        }
        
        const contractorProfile = profileResult.recordset[0];
        contractorProfile.reviews = reviewsResult.recordset;

        res.status(200).json(contractorProfile);

    } catch (error) {
        console.error("Error al obtener el perfil detallado del contratista:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = {
    getAllContractors,
    getContractorById,
};