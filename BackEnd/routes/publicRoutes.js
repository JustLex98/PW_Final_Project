// BackEnd/routes/publicRoutes.js
const express = require("express");
const router = express.Router();

const publicController = require("../controllers/publicController");
const { getPublicCategories } = require("../controllers/publicCategoryController");

// lista de contratistas
router.get("/contractors", publicController.getAllContractors);

// perfil detallado de un contratista
router.get("/contractors/:id", publicController.getContractorById);

// 🔹 categorías públicas (para Home y WorkerForm)
router.get("/categories", getPublicCategories);

module.exports = router;
