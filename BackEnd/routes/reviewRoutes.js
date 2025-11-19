// Archivo: routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/reviews
 * @desc    Crear una nueva reseña para un contratista
 * @access  Private (requiere token de un Cliente)
 */
router.post('/', authenticateToken, reviewController.createReview);

module.exports = router;