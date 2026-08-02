const express = require("express");
const router = express.Router();

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  addCustomer,
  getAllCustomers,
  searchCustomers,
  getMyProfile,
  updateMyProfile,
  getCustomerHistory,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

// Public Customer Registration
router.post("/", addCustomer);

// Customer Profile
router.get(
  "/profile",
  auth,
  authorizeRoles("CUSTOMER"),
  getMyProfile
);

// Update Own Profile
router.put(
  "/profile",
  auth,
  authorizeRoles("CUSTOMER"),
  updateMyProfile
);

// Customer History
router.get(
  "/history",
  auth,
  authorizeRoles("CUSTOMER"),
  getCustomerHistory
);

// Search Customers
router.get(
  "/search",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  searchCustomers
);

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