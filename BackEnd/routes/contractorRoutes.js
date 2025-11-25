const express = require('express');
const router = express.Router();

// Importamos el middleware "guardián" y el controlador
const { authenticateToken } = require('../middleware/auth');
const contractorController = require('../controllers/contractorProfileController');

/**
 * @route   GET /api/contractor/profile
 * @desc    Obtener el perfil del contratista que ha iniciado sesión
 * @access  Private (requiere token JWT)
 */
router.get('/profile', authenticateToken, contractorController.getProfile);

/**
 * @route   PUT /api/contractor/profile
 * @desc    Crear o actualizar el perfil del contratista que ha iniciado sesión
 * @access  Private (requiere token JWT)
 */
router.put('/profile', authenticateToken, contractorController.updateProfile);


module.exports = router;