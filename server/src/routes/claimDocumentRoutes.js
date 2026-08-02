const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    auth,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const {
    uploadClaimDocument,
    getClaimDocuments,
} = require("../controllers/claimDocumentController");

// Upload Claim Document (Customer)
router.post(
    "/",
    auth,
    authorizeRoles("CUSTOMER"),
    upload.single("document"),
    uploadClaimDocument
);

// View Claim Documents
router.get(
    "/:claimId",
    auth,
    authorizeRoles("ADMIN", "AGENT", "CUSTOMER"),
    getClaimDocuments
);

module.exports = router;