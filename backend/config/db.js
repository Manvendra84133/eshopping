const mongoose = require("mongoose");
const axios = require("axios");

const productDB = require("../models/productModel");

const DBURL = process.env.DATABASE;

mongoose
  .connect(DBURL)
  .then(async () => {
    console.log("mongodb connected successfully...");

    // Check if products already exist
    const existingProducts = await productDB.countDocuments();

    if (existingProducts === 0) {
      console.log("Importing products from FakeStore API...");

      const response = await axios.get(
        "https://fakestoreapi.com/products"
      );

      await productDB.insertMany(response.data);

      console.log("Products imported successfully");
    } else {
      console.log("Products already exist in database");
    }
  })
  .catch((error) =>
    console.log("error in database connection", error)
  );