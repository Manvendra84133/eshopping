import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { addToCart, decrementQty, removeFromCart, clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { carts } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const total = carts.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = carts.reduce((sum, item) => sum + item.qty, 0);

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        alert("User not found. Please login again.");
        return;
      }

      // ✅ FIXED MAPPING (MOST IMPORTANT PART)
      const orderItems = carts.map((item) => ({
        productId: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.qty
      }));

      const payload = {
        userId: user._id,
        orderItems,
        shippingAddress: formData,
        totalPrice: total
      };

      console.log("ORDER PAYLOAD:", payload);

      await axios.post(
        "https://eshopping-8qww.onrender.com/api/orders/createorder",
        payload
      );

      alert("Order placed successfully!");

      dispatch(clearCart());
      navigate("/");
    } catch (error) {
      console.log("ORDER ERROR:", error.response?.data || error.message);
      alert("Order failed");
    }
  };

  if (carts.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h3>Your cart is empty 🛒</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 px-lg-4" style={{ background: "#f5f7fb" }}>
      <h2 className="fw-bold mb-3">Checkout</h2>

      <div className="row g-3">

        {/* LEFT SIDE - CART ITEMS */}
        <div className="col-lg-8">

          {carts.map((item) => (
            <div
              key={item.id}
              className="card border-0 mb-2 shadow-sm"
              style={{ borderRadius: "14px" }}
            >
              <div className="card-body p-2">

                <div className="row align-items-center g-2">

                  {/* IMAGE */}
                  <div className="col-2 text-center">
                    <img
                      src={item.image}
                      alt=""
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="col-6">
                    <h6 className="mb-1">{item.title}</h6>
                    <small className="text-muted">${item.price}</small>

                    <div className="d-flex align-items-center gap-2 mt-2">

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => dispatch(decrementQty(item))}
                      >
                        -
                      </button>

                      <span>{item.qty}</span>

                      <button
                        className="btn btn-sm btn-dark"
                        onClick={() => dispatch(addToCart(item))}
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* PRICE + REMOVE */}
                  <div className="col-4 text-end">
                    <h6>
                      ${(item.price * item.qty).toFixed(2)}
                    </h6>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="col-lg-4">

          <div className="card shadow-sm border-0 p-3" style={{ position: "sticky", top: "15px" }}>

            <h5>Order Summary</h5>

            <div className="d-flex justify-content-between">
              <span>Total Items</span>
              <strong>{totalQty}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Total Price</span>
              <strong className="text-success">${total.toFixed(2)}</strong>
            </div>

            <hr />

            <input className="form-control mb-2" name="fullName" placeholder="Full Name" onChange={handleChange} />
            <input className="form-control mb-2" name="address" placeholder="Address" onChange={handleChange} />
            <input className="form-control mb-2" name="city" placeholder="City" onChange={handleChange} />
            <input className="form-control mb-2" name="pincode" placeholder="Pincode" onChange={handleChange} />
            <input className="form-control mb-3" name="phone" placeholder="Phone" onChange={handleChange} />

            <button className="btn btn-success w-100" onClick={handlePlaceOrder}>
              Place Order
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;