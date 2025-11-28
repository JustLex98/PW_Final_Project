const { executeQuery, sql } = require('../db/db');

async function getProfile(req, res) {
    const userId = req.user.userId;
    try {
        const profileQuery = `
            SELECT 
                u.UserID, u.FirstName, u.LastName, u.Email,
                cp.BusinessName, cp.PhoneNumber, cp.Bio, cp.YearsOfExperience
            FROM Users u LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
            WHERE u.UserID = @userId;
        `;
        const categoriesQuery = `
            SELECT c.CategoryID, c.CategoryName, cc.PriceMin, cc.PriceMax
            FROM ContractorCategories cc
            JOIN Categories c ON cc.CategoryID = c.CategoryID
            WHERE cc.UserID = @userId;
        `;
        const params = [{ name: 'userId', type: sql.Int, value: userId }];
        const [profileResult, categoriesResult] = await Promise.all([
            executeQuery(profileQuery, params),
            executeQuery(categoriesQuery, params)
        ]);
        const profile = profileResult.recordset[0];
        if (!profile) {
            return res.status(404).send({ message: 'Perfil de contratista no encontrado.' });
        }
        profile.categories = categoriesResult.recordset;
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

async function updateProfile(req, res) {
    const userId = req.user.userId;
    const { businessName, phoneNumber, bio, yearsOfExperience, categories } = req.body;
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
        await executeQuery('DELETE FROM ContractorCategories WHERE UserID = @userId;', deleteParams);
        
        if (categories && categories.length > 0) {
            let insertQuery = 'INSERT INTO ContractorCategories (UserID, CategoryID, PriceMin, PriceMax) VALUES ';
            const insertParams = [{ name: 'userId', type: sql.Int, value: userId }];
            categories.forEach((cat, index) => {
                const catIdParam = `catId${index}`;
                const priceMinParam = `priceMin${index}`;
                const priceMaxParam = `priceMax${index}`;
                insertQuery += `(@userId, @${catIdParam}, @${priceMinParam}, @${priceMaxParam}),`;
                insertParams.push({ name: catIdParam, type: sql.Int, value: cat.categoryId });
                insertParams.push({ name: priceMinParam, type: sql.Decimal, value: cat.priceMin || null });
                insertParams.push({ name: priceMaxParam, type: sql.Decimal, value: cat.priceMax || null });
            });
            insertQuery = insertQuery.slice(0, -1);
            await executeQuery(insertQuery, insertParams);
        }
        res.status(200).send({ message: 'Perfil actualizado exitosamente.' });
    } catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
}

module.exports = { getProfile, updateProfile };