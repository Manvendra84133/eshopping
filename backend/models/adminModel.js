const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    profile: {
      type: String, // Cloudinary URL
      required: true
    }
  },
  { timestamps: true }
);

const adminDB = mongoose.model("admin", adminSchema);

module.exports = adminDB;