const express = require("express");
const router = express.Router();

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  addPolicy,
  getAllPolicies,
  getMyPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");
// Create Policy (Admin & Agent)
router.post(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  addPolicy
);

// Get All Policies (Admin & Agent)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getAllPolicies
);
// My Policies (Customer)
router.get(
  "/my",
  auth,
  authorizeRoles("CUSTOMER"),
  getMyPolicies
);

// Get Policy By ID (Admin & Agent)
router.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getPolicyById
);

// Update Policy (Admin & Agent)
router.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  updatePolicy
);

// Delete Policy (Admin Only)
router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  deletePolicy
);

module.exports = router;