// Archivo: routes/serviceRequestRoutes.js

const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');
const { authenticateToken } = require('../middleware/auth');

// Ruta para CLIENTES
router.post('/', authenticateToken, serviceRequestController.createRequest);

// Rutas para CONTRATISTAS
router.get('/contractor', authenticateToken, serviceRequestController.getContractorRequests);
router.put('/:id/status', authenticateToken, serviceRequestController.updateRequestStatus);

module.exports = router;