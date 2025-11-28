// BackEnd/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();

// middleware de auth (ahora exporta { authenticateToken })
const { authenticateToken } = require("../middleware/auth");

// controller (exporta { createReview })
const { createReview } = require("../controllers/reviewController");

// Opcional: debug
console.log("typeof authenticateToken:", typeof authenticateToken);
console.log("typeof createReview:", typeof createReview);

/**
 * @route   POST /api/reviews/contractor/:contractorId
 * @desc    Crear una nueva reseña para un contratista
 * @access  Private (requiere token de un Cliente)
 */
router.post(
  "/contractor/:contractorId",
  authenticateToken, // middleware
  createReview       // handler
);

module.exports = router;
