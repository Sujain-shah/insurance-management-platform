const express = require("express");

const router = express.Router();

const {
  addClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  verifyClaim,
  updateClaim,
  deleteClaim,
} = require("../controllers/claimController");

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create Claim (Customer)
router.post(
  "/",
  auth,
  authorizeRoles("CUSTOMER"),
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

// Verify Claim (Admin & Agent)
router.put(
  "/:id/verify",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  verifyClaim
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