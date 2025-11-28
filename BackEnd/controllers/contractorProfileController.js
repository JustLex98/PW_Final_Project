
const { executeQuery, sql } = require("../db/db");


// 1) OBTENER PERFIL DEL CONTRATISTA

async function getProfile(req, res) {
  const userId = req.user.userId;

  try {
    const profileQuery = `
      SELECT 
        u.UserID,
        u.FirstName,
        u.LastName,
        u.Email,
        cp.BusinessName,
        cp.PhoneNumber,
        cp.Bio,
        cp.YearsOfExperience
      FROM Users u
      LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
      WHERE u.UserID = @userId;
    `;

    const categoriesQuery = `
      SELECT 
        c.CategoryID,
        c.CategoryName,
        cc.PriceMin,
        cc.PriceMax
      FROM ContractorCategories cc
      JOIN Categories c ON cc.CategoryID = c.CategoryID
      WHERE cc.UserID = @userId;
    `;

    const params = [{ name: "userId", type: sql.Int, value: userId }];

    const profileResult = await executeQuery(profileQuery, params);
    const categoriesResult = await executeQuery(categoriesQuery, params);

    const profile = profileResult.recordset[0];
    if (!profile) {
      return res
        .status(404)
        .send({ message: "Perfil de contratista no encontrado." });
    }

    profile.categories = categoriesResult.recordset;
    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error al obtener el perfil del contratista:", error);
    return res
      .status(500)
      .send({ message: "Error interno del servidor al obtener el perfil." });
  }
}

// =======================================
// 2) ACTUALIZAR PERFIL DEL CONTRATISTA
// =======================================
async function updateProfile(req, res) {
  const userId = req.user.userId;

  const {
    businessName,
    phoneNumber,
    bio,
    yearsOfExperience,
    categoryIds,
    priceMin,
    priceMax,
  } = req.body;

  try {
    // 2.1) Actualizar/crear perfil básico
    const profileParams = [
      { name: "userId", type: sql.Int, value: userId },
      { name: "businessName", type: sql.NVarChar, value: businessName },
      { name: "phoneNumber", type: sql.NVarChar, value: phoneNumber },
      { name: "bio", type: sql.NVarChar, value: bio },
      { name: "yearsOfExperience", type: sql.Int, value: yearsOfExperience },
    ];

    const profileQuery = `
      MERGE ContractorProfiles AS target
      USING (SELECT @userId AS UserID) AS source
        ON (target.UserID = source.UserID)
      WHEN MATCHED THEN
        UPDATE SET
          BusinessName      = @businessName,
          PhoneNumber       = @phoneNumber,
          Bio               = @bio,
          YearsOfExperience = @yearsOfExperience
      WHEN NOT MATCHED THEN
        INSERT (UserID, BusinessName, PhoneNumber, Bio, YearsOfExperience)
        VALUES (@userId, @businessName, @phoneNumber, @bio, @yearsOfExperience);
    `;

    await executeQuery(profileQuery, profileParams);

    // 2.2) Limpiar categorías anteriores
    const deleteParams = [{ name: "userId", type: sql.Int, value: userId }];
    const deleteCategoriesQuery =
      "DELETE FROM ContractorCategories WHERE UserID = @userId;";
    await executeQuery(deleteCategoriesQuery, deleteParams);

    // 2.3) Insertar categorías + rango de precios
    if (categoryIds && categoryIds.length > 0) {
      let insertQuery = `
        INSERT INTO ContractorCategories (UserID, CategoryID, PriceMin, PriceMax)
        VALUES
      `;

      const insertParams = [
        { name: "userId", type: sql.Int, value: userId },
        {
          name: "priceMin",
          type: sql.Decimal(10, 2),
          value: priceMin ?? null,
        },
        {
          name: "priceMax",
          type: sql.Decimal(10, 2),
          value: priceMax ?? null,
        },
      ];

      categoryIds.forEach((id, index) => {
        const paramName = `catId${index}`;
        insertQuery += `(@userId, @${paramName}, @priceMin, @priceMax),`;
        insertParams.push({
          name: paramName,
          type: sql.Int,
          value: id,
        });
      });

  
      insertQuery = insertQuery.slice(0, -1);

      await executeQuery(insertQuery, insertParams);
    }

    return res
      .status(200)
      .send({ message: "Perfil actualizado exitosamente." });
  } catch (error) {
    console.error("Error al actualizar el perfil del contratista:", error);
    return res
      .status(500)
      .send({ message: "Error interno del servidor al actualizar el perfil." });
  }
}

async function getMyContractorProfile(req, res) {
  try {
    const userId = req.user.userId; 
    const query = `
      SELECT 
        u.UserID,
        u.FirstName,
        u.LastName,
        u.Email,
        cp.BusinessName,
        cp.PhoneNumber,
        cp.Bio,
        cp.YearsOfExperience,
        cc.CategoryID,
        cc.PriceMin,
        cc.PriceMax
      FROM Users u
      LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
      LEFT JOIN ContractorCategories cc ON u.UserID = cc.UserID
      WHERE u.UserID = @userId
        AND u.UserRole = 'Contratista';
    `;

    const result = await executeQuery(query, [
      { name: "userId", type: sql.Int, value: userId },
    ]);

    if (result.recordset.length === 0) {
      return res.status(200).json(null);
    }

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener mi perfil de contratista:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor." });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getMyContractorProfile,
};
