import "./ProductDetails.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
// import Navbar from "../../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  // const user = JSON.parse(localStorage.getItem("user"));

  console.log("product is", product)

  useEffect(() => {
    // ✅ Step 1: Get products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products"));

    if (storedProducts && storedProducts.length > 0) {
      console.log("Loaded product from localStorage");

      // find product by id
      const selectedProduct = storedProducts.find((item) => item.id === Number(id));

      if (selectedProduct) {
        setProduct(selectedProduct);
        return; // stop API call
      }
    }

    // ✅ Step 2: fallback → call API
    console.log("Calling API...");
    axios
      .get(`http://localhost:4009/api/products/getsingleproduct/${id}`)
      .then((res) => {
        setProduct(res.data);
      });
  }, [id]);


  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };




  return (
    <>
      {/* <Navbar user={user} /> */}

      <div className="container mt-5">
        <button className="btn btn-secondary mb-4" onClick={() => navigate("/dashboard")} > Back </button>

        <div className="row align-items-center">
          <div className="col-md-5">
            <div className="product-image">
              <img src={product.image} />
            </div>
          </div>


          <div className="col-md-7">
            <div className="product-details">
              <h2>{product.title}</h2>
              <div className="product-price">${product.price}</div>
              <p>{product.description}</p>
              <div className="product-info">Category: {product.category}</div>
              <div className="product-info product-rating">⭐ Rating: {product?.rating?.rate}</div>
              <button className="btn btn-primary mt-2" onClick={handleAddToCart}>Add to Cart</button>
            </div>

          </div>

        </div>

      </div>

    </>
  );

}

export default ProductDetails;