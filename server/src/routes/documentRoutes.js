const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  auth,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getAllDocuments,
  deleteDocument,
} = require("../controllers/documentController");

// Upload Document (Admin & Agent)
router.post(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  upload.single("file"),
  uploadDocument
);

// Get All Documents (Admin & Agent)
router.get(
  "/",
  auth,
  authorizeRoles("ADMIN", "AGENT"),
  getAllDocuments
);

// Delete Document (Admin Only)
router.delete(
  "/:id",
  auth,
  authorizeRoles("ADMIN"),
  deleteDocument
);

module.exports = router;