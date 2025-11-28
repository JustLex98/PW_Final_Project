// BackEnd/controllers/publicCategoryController.js
const { executeQuery } = require("../db/db");

async function getPublicCategories(req, res) {
  try {
    const query = `
      SELECT CategoryID, CategoryName, Description
      FROM Categories
      ORDER BY CategoryID;
    `;

    const result = await executeQuery(query, []);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener categorías públicas:", error);
    return res
      .status(500)
      .send({ message: "Error interno del servidor." });
  }
}

module.exports = { getPublicCategories };
