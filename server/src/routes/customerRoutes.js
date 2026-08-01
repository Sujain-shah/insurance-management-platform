const express = require("express");
const router = express.Router();

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  addCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Public Customer Registration
router.post("/", addCustomer);

// Get All Customers (Admin & Agent)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getAllCustomers
);

// Get Customer By ID (Admin & Agent)
router.get(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getCustomerById
);

// Update Customer (Admin & Agent)
router.put(
  "/:id",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  updateCustomer
);

// Delete Customer (Admin Only)
router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  deleteCustomer
);

module.exports = router;