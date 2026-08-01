const express = require("express");
const router = express.Router();

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/userController");

// Get All Users (Admin Only)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN"),
  getAllUsers
);

// Update User Role (Admin Only)
router.put(
  "/:id/role",
  auth,
  authorizeRoles("ADMIN"),
  updateUserRole
);

module.exports = router;