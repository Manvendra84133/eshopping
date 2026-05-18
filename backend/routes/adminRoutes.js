const express = require("express");
const router = new express.Router();

const { registerAdminController } = require("../controllers/adminControllers");
const adminUpload = require("../multerconfig/admin/adminStorageConfig");

// Admin Auth Routes
router.post("/register", adminUpload.single("adminprofile"), registerAdminController);

module.exports = router;