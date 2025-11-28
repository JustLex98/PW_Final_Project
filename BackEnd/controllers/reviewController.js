// BackEnd/controllers/reviewController.js
const { executeQuery, sql } = require("../db/db");

/**
 * POST /api/reviews/contractor/:contractorId
 * Crea una reseña nueva.
 */
async function createReview(req, res) {
  const clientId = req.user.userId;
  const userRole = req.user.role;

  if (userRole !== "Cliente") {
    return res
      .status(403)
      .send({ message: "Acción no permitida. Solo los clientes pueden dejar reseñas." });
  }

  const contractorId = parseInt(req.params.contractorId, 10);
  const { rating, comment } = req.body;

  if (!contractorId || !rating) {
    return res
      .status(400)
      .send({ message: "Se requiere el ID del contratista y una calificación." });
  }

  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .send({ message: "La calificación debe estar entre 1 y 5." });
  }

  if (clientId === contractorId) {
    return res
      .status(400)
      .send({ message: "No puedes dejarte una reseña a ti mismo." });
  }

  try {
    const query = `
      INSERT INTO Reviews (ClientID, ContractorID, Rating, Comment)
      VALUES (@clientId, @contractorId, @rating, @comment);
    `;

    const params = [
      { name: "clientId", type: sql.Int, value: clientId },
      { name: "contractorId", type: sql.Int, value: contractorId },
      { name: "rating", type: sql.Int, value: rating },
      { name: "comment", type: sql.NVarChar, value: comment || null },
    ];

    await executeQuery(query, params);

    res.status(201).send({ message: "Reseña creada exitosamente." });
  } catch (error) {
    if (error.number === 547) {
      return res
        .status(404)
        .send({ message: "El contratista especificado no existe." });
    }
    console.error("Error al crear la reseña:", error);
    res.status(500).send({ message: "Error interno del servidor." });
  }
}

module.exports = {
  createReview,
};
