const express = require("express");

const router = express.Router();

const {
  addPremiumPayment,
  getAllPremiumPayments,
  getPremiumPaymentById,
  updatePremiumPayment,
  deletePremiumPayment,
} = require("../controllers/premiumPaymentController");

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Create Premium Payment (Admin & Agent)
router.post(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  addPremiumPayment
);

// Get All Premium Payments (Admin & Agent)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getAllPremiumPayments
);

// Get Premium Payment By ID (Admin & Agent)
router.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getPremiumPaymentById
);

// Update Premium Payment (Admin & Agent)
router.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  updatePremiumPayment
);

// Delete Premium Payment (Admin Only)
router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  deletePremiumPayment
);

module.exports = router;