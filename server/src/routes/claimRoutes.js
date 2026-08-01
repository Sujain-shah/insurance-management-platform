const express = require("express");

const router = express.Router();

const {
  addClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
} = require("../controllers/claimController");

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create Claim (Admin & Agent)
router.post(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  addClaim
);

// Get All Claims (Admin & Agent)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getAllClaims
);

// My Claims (Customer)
router.get(
  "/my",
  auth,
  authorizeRoles("CUSTOMER"),
  getMyClaims
);

// Get Claim By ID (Admin & Agent)
router.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getClaimById
);

// Update Claim (Admin & Agent)
router.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  updateClaim
);

// Delete Claim (Admin Only)
router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  deleteClaim
);

module.exports = router;