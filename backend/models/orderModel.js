const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  orderItems: [
    {
      productId: String,
      title: String,
      image: String,
      quantity: Number,
      price: Number
    }
  ],

  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String
  },

  totalPrice: Number,

  paymentMethod: {
    type: String,
    default: "COD"
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("orders", orderSchema);