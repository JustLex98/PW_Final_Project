const { executeQuery, sql } = require('../db/db');

async function getProfile(req, res) {
    const userId = req.user.userId;

    try {
        const profileQuery = `
            SELECT 
                u.UserID, u.FirstName, u.LastName, u.Email,
                cp.BusinessName, cp.PhoneNumber, cp.Bio, cp.YearsOfExperience
            FROM Users u
            LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
            WHERE u.UserID = @userId;
        `;
        
        const categoriesQuery = `
            SELECT c.CategoryID, c.CategoryName
            FROM ContractorCategories cc
            JOIN Categories c ON cc.CategoryID = c.CategoryID
            WHERE cc.UserID = @userId;
        `;

        // --- INICIO DE LA CORRECCIÓN ---
        // Creamos el array de parámetros que espera executeQuery
        const params = [{ name: 'userId', type: sql.Int, value: userId }];
        // --- FIN DE LA CORRECCIÓN ---
        
        const profileResult = await executeQuery(profileQuery, params);
        const categoriesResult = await executeQuery(categoriesQuery, params);

        const profile = profileResult.recordset[0];
        if (!profile) {
            return res.status(404).send({ message: 'Perfil de contratista no encontrado.' });
        }
        
        profile.categories = categoriesResult.recordset;
        res.status(200).json(profile);

    } catch (error) {
        console.error("Error al obtener el perfil del contratista:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

async function updateProfile(req, res) {
    const userId = req.user.userId;
    const { businessName, phoneNumber, bio, yearsOfExperience, categoryIds } = req.body;

    try {
        const profileParams = [
            { name: 'userId', type: sql.Int, value: userId },
            { name: 'businessName', type: sql.NVarChar, value: businessName },
            { name: 'phoneNumber', type: sql.NVarChar, value: phoneNumber },
            { name: 'bio', type: sql.NVarChar, value: bio },
            { name: 'yearsOfExperience', type: sql.Int, value: yearsOfExperience },
        ];
        const profileQuery = `
            MERGE ContractorProfiles AS target USING (SELECT @userId AS UserID) AS source ON (target.UserID = source.UserID)
            WHEN MATCHED THEN UPDATE SET BusinessName = @businessName, PhoneNumber = @phoneNumber, Bio = @bio, YearsOfExperience = @yearsOfExperience
            WHEN NOT MATCHED THEN INSERT (UserID, BusinessName, PhoneNumber, Bio, YearsOfExperience) VALUES (@userId, @businessName, @phoneNumber, @bio, @yearsOfExperience);
        `;
        await executeQuery(profileQuery, profileParams);

        const deleteParams = [{ name: 'userId', type: sql.Int, value: userId }];
        const deleteCategoriesQuery = 'DELETE FROM ContractorCategories WHERE UserID = @userId;';
        await executeQuery(deleteCategoriesQuery, deleteParams);
        
        if (categoryIds && categoryIds.length > 0) {
            let insertQuery = 'INSERT INTO ContractorCategories (UserID, CategoryID) VALUES ';
            const insertParams = [{ name: 'userId', type: sql.Int, value: userId }];

            categoryIds.forEach((id, index) => {
                const paramName = `catId${index}`;
                insertQuery += `(@userId, @${paramName}),`;
                insertParams.push({ name: paramName, type: sql.Int, value: id });
            });
            
            insertQuery = insertQuery.slice(0, -1);
            await executeQuery(insertQuery, insertParams);
        }

        res.status(200).send({ message: 'Perfil actualizado exitosamente.' });

    } catch (error) {
        console.error("Error al actualizar el perfil del contratista:", error);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = { getProfile, updateProfile };