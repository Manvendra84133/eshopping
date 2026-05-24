const express = require("express");
const router = express.Router();
const { registerAdminController, loginAdminController, logoutController, adminverifyController } = require("../controllers/adminControllers");
const adminUpload = require("../multerconfig/admin/adminStorageConfig");
const adminMiddleware = require("../middleware/adminMiddleware");

// REGISTER ADMIN
router.post("/register", adminUpload.single("adminprofile"), registerAdminController);

// LOGIN ADMIN
router.post("/login", loginAdminController);

// VERIFY ADMIN
router.get("/adminverify", adminMiddleware, adminverifyController);

// LOGOUT ADMIN
router.post("/logout", adminMiddleware, logoutController);

module.exports = router;