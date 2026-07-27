const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");

router.post("/", auth, addPolicy);
router.get("/", auth, getAllPolicies);
router.get("/:id", auth, getPolicyById);
router.put("/:id", auth, updatePolicy);
router.delete("/:id", auth, deletePolicy);

module.exports = router;