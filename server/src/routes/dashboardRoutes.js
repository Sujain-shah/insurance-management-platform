const express = require("express");
const router = express.Router();

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getDashboardData,
} = require("../controllers/dashboardController");

// Dashboard (Admin Only)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  getDashboardData
);

module.exports = router;