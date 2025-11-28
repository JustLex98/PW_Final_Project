const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * @route   GET /api/public/contractors
 * @desc    Obtener una lista pública de contratistas (con filtros)
 * @access  Public
 */
router.get('/contractors', publicController.getAllContractors);

module.exports = router;