
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus
} = require("../controllers/complaintController");

// ADMIN ROUTES
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllComplaints
);

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateComplaintStatus
);

// CITIZEN ROUTES
router.post(
  "/",
  protect,
  upload.single("image"),
  createComplaint
);

router.get("/my", protect, getMyComplaints);

router.get("/:id", protect, getComplaintById);

module.exports = router;
