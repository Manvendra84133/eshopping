const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// ================= RAZORPAY INSTANCE =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ================= NODEMAILER =================
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("TRANSPORT ERROR =>", error);
  } else {
    console.log("Mail server ready");
  }
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    // convert safely
    amount = Number(amount);

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json(order);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {

      return res.status(200).json({
        success: true,
        message: "Payment Verified Successfully",
      });

    } else {

      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });

    }

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ================= SEND ORDER MAIL =================
exports.sendOrderMail = async (req, res) => {

  try {

    const {
      user,
      carts,
      totalQty,
      totalPrice,
    } = req.body;

    const templatePath = path.join(
      __dirname,
      "../views/ordertemplate.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      user,
      carts,
      totalQty,
      totalPrice,
    });

    console.log(user);
    console.log(user.email);
    const sentMail = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Order Confirmed 🎉",
      html: html,
    });

    console.log("MAIL SENT SUCCESSFULLY");
    // console.log(JSON.stringify(sentMail, null, 2));

    return res.status(200).json({
      success: true,
      message: "Order Mail Sent Successfully",
    });

  } catch (error) {

    console.log("MAIL ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Mail Sending Failed",
    });

  }
};