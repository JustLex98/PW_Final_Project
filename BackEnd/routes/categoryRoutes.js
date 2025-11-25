const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /api/categories
 * @desc    Obtener una lista de todas las categorías de servicios
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

module.exports = router;