const Order = require("../models/orderModel");

const createOrderController = async (req, res) => {

  try {

    const {
      userId,
      orderItems,
      shippingAddress,
      totalPrice
    } = req.body;

    const newOrder = new Order({
      userId,
      orderItems,
      shippingAddress,
      totalPrice
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      newOrder
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Order failed"
    });

  }

};

module.exports = {
  createOrderController
};