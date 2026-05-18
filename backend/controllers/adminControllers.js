const adminDB = require("./../models/adminModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("./../Cloudinary/cloudinary");

const registerAdminController = async (req, res) => {
  try {
    console.log("Admin Register API called");

    const { name, email, password, mobile, confirmpassword } = req.body;

    if (!name || !email || !password || !mobile || !confirmpassword || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const preAdmin = await adminDB.findOne({ email });
    const mobileVerify = await adminDB.findOne({ mobile });

    if (preAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    if (mobileVerify) {
      return res.status(400).json({ error: "Mobile already exists" });
    }

    const file = req.file.path;
    const upload = await cloudinary.uploader.upload(file);

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = new adminDB({
      name,
      email,
      password: hashedPassword,
      mobile,
      profile: upload.secure_url
    });

    const savedAdmin = await adminData.save();

    res.status(201).json({
      message: "Admin registered successfully",
      admin: savedAdmin
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {registerAdminController}