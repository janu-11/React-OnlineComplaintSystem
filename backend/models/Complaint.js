
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Road Damage",
        "Water Supply",
        "Garbage",
        "Streetlight",
        "Drainage",
        "Electricity",
        "Public Safety",
        "Other"
      ]
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved",
        "Rejected"
      ],
      default: "Pending"
    },

    adminRemarks: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
