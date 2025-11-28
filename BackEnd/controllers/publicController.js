// BackEnd/controllers/publicController.js
const { executeQuery, sql } = require("../db/db");

/**
 * Obtiene una lista pública de contratistas, con opción de filtrado.
 */
async function getAllContractors(req, res) {
  const { search, category } = req.query;

  try {
    let query = `
      SELECT 
        u.UserID,
        u.FirstName,
        u.LastName,
        cp.BusinessName,
        cp.Bio,
        cp.YearsOfExperience,
        (
          SELECT STRING_AGG(c.CategoryName, ', ')
          FROM ContractorCategories cc
          JOIN Categories c ON cc.CategoryID = c.CategoryID
          WHERE cc.UserID = u.UserID
        ) AS Categories,
        -- ⭐ promedio de rating
        (
          SELECT AVG(CAST(r.Rating AS FLOAT))
          FROM Reviews r
          WHERE r.ContractorID = u.UserID
        ) AS AvgRating,
        -- ⭐ cantidad de reseñas
        (
          SELECT COUNT(*)
          FROM Reviews r
          WHERE r.ContractorID = u.UserID
        ) AS ReviewsCount
      FROM Users u
      JOIN ContractorProfiles cp ON u.UserID = cp.UserID
      WHERE u.UserRole = 'Contratista'
    `;

    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(
        `(cp.BusinessName LIKE @searchTerm 
          OR cp.Bio LIKE @searchTerm 
          OR u.FirstName LIKE @searchTerm 
          OR u.LastName LIKE @searchTerm)`
      );
      params.push({
        name: "searchTerm",
        type: sql.NVarChar,
        value: `%${search}%`,
      });
    }

    if (category) {
      conditions.push(`
        u.UserID IN (
          SELECT cc.UserID
          FROM ContractorCategories cc
          JOIN Categories c ON cc.CategoryID = c.CategoryID
          WHERE c.CategoryName = @categoryName
        )
      `);
      params.push({
        name: "categoryName",
        type: sql.NVarChar,
        value: category,
      });
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    const result = await executeQuery(query, params);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener la lista de contratistas:", error);
    return res
      .status(500)
      .send({ message: "Error interno del servidor." });
  }
}

/**
 * Obtiene el perfil detallado y público de un solo contratista,
 * incluyendo sus reseñas y el rango de precios.
 */
async function getContractorById(req, res) {
  const { id } = req.params;

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
        cp.YearsOfExperience,
        STRING_AGG(c.CategoryName, ', ') AS Categories,
        MIN(cc.PriceMin) AS PriceMin,
        MAX(cc.PriceMax) AS PriceMax
      FROM Users u
      LEFT JOIN ContractorProfiles cp ON u.UserID = cp.UserID
      LEFT JOIN ContractorCategories cc ON u.UserID = cc.UserID
      LEFT JOIN Categories c ON cc.CategoryID = c.CategoryID
      WHERE u.UserID = @contractorId
        AND u.UserRole = 'Contratista'
      GROUP BY
        u.UserID,
        u.FirstName,
        u.LastName,
        u.Email,
        cp.BusinessName,
        cp.PhoneNumber,
        cp.Bio,
        cp.YearsOfExperience;
    `;

    const reviewsQuery = `
      SELECT 
        r.Rating,
        r.Comment,
        r.CreatedAt,
        c.FirstName AS ClientFirstName
      FROM Reviews r
      JOIN Users c ON r.ClientID = c.UserID
      WHERE r.ContractorID = @contractorId
      ORDER BY r.CreatedAt DESC;
    `;

    const params = [
      { name: "contractorId", type: sql.Int, value: parseInt(id, 10) },
    ];

    const profileResult = await executeQuery(profileQuery, params);
    const reviewsResult = await executeQuery(reviewsQuery, params);

    if (profileResult.recordset.length === 0) {
      return res.status(404).send({ message: "Contratista no encontrado." });
    }

    const contractorProfile = profileResult.recordset[0];
    const reviews = reviewsResult.recordset;

    // 🔹 calcular promedio y cantidad de reseñas
    let avgRating = null;
    if (reviews.length > 0) {
      const sum = reviews.reduce(
        (acc, r) => acc + (r.Rating || 0),
        0
      );
      avgRating = sum / reviews.length;
    }

    contractorProfile.avgRating = avgRating;
    contractorProfile.reviewsCount = reviews.length;
    contractorProfile.reviews = reviews;

    return res.status(200).json(contractorProfile);
  } catch (error) {
    console.error(
      "Error al obtener el perfil detallado del contratista:",
      error
    );
    return res
      .status(500)
      .send({ message: "Error interno del servidor." });
  }
}

module.exports = {
  getAllContractors,
  getContractorById,
};
