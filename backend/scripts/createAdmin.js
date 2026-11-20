
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();

    let admin = await User.findOne({ email });

    if (admin) {
      admin.role = "admin";
      await admin.save();

      console.log("Existing account has been assigned Admin role.");
    } else {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      admin = await User.create({
        name: process.env.ADMIN_NAME || "System Administrator",
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully.");
    }

    console.log("Admin email:", admin.email);
    console.log("Admin role:", admin.role);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
