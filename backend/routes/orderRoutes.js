const express = require("express");

const router = express.Router();

const {
  createOrderController
} = require("../controllers/orderControllers");

router.post("/createorder", createOrderController);

module.exports = router;