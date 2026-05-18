const userDB = require("../models/userModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.USER_SECRET_KEY || "USER SECRET KEY"


const userMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const verifyToken = jwt.verify(token, SECRET_KEY);

    // ✅ check token exists in DB
    const rootUser = await userDB.findOne({
      _id: verifyToken._id,
      "tokens.token": token
    });

    if (!rootUser) {
      throw new Error("User not found or token invalid");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    console.log("Middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = userMiddleware;
