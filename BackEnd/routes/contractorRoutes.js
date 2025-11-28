const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const contractorController = require("../controllers/contractorProfileController");

// obtener MI perfil (para rellenar WorkerForm)
router.get(
  "/profile",
  authenticateToken,
  contractorController.getMyContractorProfile
);

// actualizar perfil
router.put(
  "/profile",
  authenticateToken,
  contractorController.updateProfile
);

module.exports = router;
