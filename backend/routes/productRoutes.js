const express = require("express");
const { getAllProductsController, getSingleProductController } = require("../controllers/productControllers");
const router = new express.Router();

router.get("/getallproducts", getAllProductsController);
router.get("/getsingleproduct/:id", getSingleProductController);



module.exports = router