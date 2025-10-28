const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @route POST /api/auth/register
 * @desc  Ruta para el registro de nuevos usuarios (Clientes o Contratistas)
 * @access Public
 */
router.post("/register", authController.register);

/**
 * @route POST /api/auth/login
 * @desc  Ruta para el inicio de sesión de usuarios
 * @access Public
 */
router.post("/login", authController.login);

module.exports = router;
