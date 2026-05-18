require('dotenv').config();
const express = require("express");
const app = express();

const cors = require('cors');
require('./config/db')

app.use(cors());
app.use(express.json());

// user route
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// products route
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;