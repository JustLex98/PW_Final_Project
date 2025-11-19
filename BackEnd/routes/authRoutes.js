const express = require("express");
const router = express.Router(); // Módulo de Express para manejar rutas.
const authController = require("../controllers/authController"); // Lógica de las funciones de registro y login.

// Ruta POST: /api/auth/register
// Para crear nuevos usuarios.
router.post("/register", authController.register);

// Ruta POST: /api/auth/login
// Para iniciar sesión.
router.post("/login", authController.login);

module.exports = router; // Exporta las rutas de autenticación.