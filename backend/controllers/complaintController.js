
const Complaint = require("../models/Complaint");

// Citizen: Create a complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        message: "Please fill in all required fields."
      });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      category,
      location,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    res.status(201).json({
      message: "Complaint submitted successfully.",
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint.",
      error: error.message
    });
  }
};

// Citizen: Get their own complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints.",
      error: error.message
    });
  }
};

// Citizen: Get one of their own complaints
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    res.status(200).json({ complaint });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaint.",
      error: error.message
    });
  }
};

// Admin: Get all citizens' complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all complaints.",
      error: error.message
    });
  }
};

// Admin: Update complaint status and remarks
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status."
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found."
      });
    }

    complaint.status = status;

    if (typeof adminRemarks === "string") {
      complaint.adminRemarks = adminRemarks.trim();
    }

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully.",
      complaint
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update complaint.",
      error: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  updateComplaintStatus
};
