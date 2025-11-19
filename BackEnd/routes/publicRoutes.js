const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

/**
 * @route   GET /api/public/contractors
 * @desc    Obtener lista pública de contratistas (con filtros)
 * @access  Public
 */
router.get('/contractors', publicController.getAllContractors);

/**
 * @route   GET /api/public/contractors/:id
 * @desc    Obtener el perfil detallado de un solo contratista por su ID
 * @access  Public
 */
router.get('/contractors/:id', publicController.getContractorById);


module.exports = router;