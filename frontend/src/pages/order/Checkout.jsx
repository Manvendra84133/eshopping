import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  addToCart,
  decrementQty,
  removeFromCart,
  clearCart
} from "../../redux/slices/cartSlice";

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

  const total = carts.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const totalQty = carts.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    try {

      await axios.post(
        "https://eshopping-8qww.onrender.com/api/orders/createorder",
        {
          orderItems: carts,
          shippingAddress: formData,
          totalPrice: total
        }
      );

      alert("Order placed successfully!");

      dispatch(clearCart());
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Order failed");
    }
  };

  if (carts.length === 0) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >

        <div className="text-center">

          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: "90px",
              height: "90px",
              fontSize: "35px"
            }}
          >
            🛒
          </div>

          <h3 className="fw-bold">
            Your cart is empty
          </h3>

          <p className="text-muted mb-4">
            Add products to continue shopping
          </p>

          <button
            className="btn btn-dark px-4 rounded-pill"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  return (
    <div
      className="container-fluid py-2 px-lg-4"
      style={{ background: "#f5f7fb" }}
    >

      {/* TOP */}
      <div className="mb-3">

        <h2
          className="fw-bold mb-1"
          style={{ color: "#1e293b" }}
        >
          Checkout
        </h2>

        <p className="text-muted mb-0">
          Complete your purchase
        </p>

      </div>

      <div className="row g-3">

        {/* LEFT SIDE */}
        <div className="col-lg-8">

          {carts.map((item) => (
            <div
              key={item.id}
              className="card border-0 mb-3"
              style={{
                borderRadius: "16px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.05)"
              }}
            >

              <div className="card-body p-3">

                <div className="row align-items-center">

                  {/* IMAGE */}
                  <div className="col-md-2 text-center mb-3 mb-md-0">

                    <div
                      className="bg-light d-flex align-items-center justify-content-center mx-auto"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "14px"
                      }}
                    >

                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "65px",
                          height: "65px",
                          objectFit: "contain"
                        }}
                      />

                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="col-md-6">

                    <h6
                      className="fw-bold mb-1"
                      style={{
                        color: "#1e293b"
                      }}
                    >
                      {item.title}
                    </h6>

                    <p
                      className="mb-2 fw-semibold"
                      style={{
                        color: "#64748b"
                      }}
                    >
                      ${item.price}
                    </p>

                    {/* QTY */}
                    <div
                      className="d-inline-flex align-items-center px-2 py-1"
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                      }}
                    >

                      <button
                        className="btn btn-sm"
                        style={{
                          width: "30px",
                          height: "30px",
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          fontWeight: "bold"
                        }}
                        onClick={() => dispatch(decrementQty(item))}
                      >
                        -
                      </button>

                      <span className="fw-bold mx-3">
                        {item.qty}
                      </span>

                      <button
                        className="btn btn-sm"
                        style={{
                          width: "30px",
                          height: "30px",
                          background: "#0f172a",
                          color: "#fff",
                          borderRadius: "8px"
                        }}
                        onClick={() => dispatch(addToCart(item))}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">

                    <h5
                      className="fw-bold mb-2"
                      style={{ color: "#0f172a" }}
                    >
                      ${(item.price * item.qty).toFixed(2)}
                    </h5>

                    <button
                      className="btn btn-outline-danger btn-sm px-3 rounded-pill"
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

        {/* RIGHT SIDE */}
        <div className="col-lg-4">

          <div
            className="card border-0"
            style={{
              borderRadius: "18px",
              boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
              position: "sticky",
              top: "15px"
            }}
          >

            <div className="card-body p-3">

              <h5
                className="fw-bold mb-3"
                style={{ color: "#1e293b" }}
              >
                Order Summary
              </h5>

              <div className="d-flex justify-content-between mb-2">

                <span className="text-muted">
                  Total Items
                </span>

                <span className="fw-semibold">
                  {totalQty}
                </span>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <span className="text-muted">
                  Total Amount
                </span>

                <span
                  className="fw-bold"
                  style={{
                    color: "#16a34a",
                    fontSize: "20px"
                  }}
                >
                  ${total.toFixed(2)}
                </span>

              </div>

              <hr />

              {/* FORM */}
              <input
                className="form-control mb-2"
                name="fullName"
                placeholder="Full Name"
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea"
                }}
              />

              <input
                className="form-control mb-2"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea"
                }}
              />

              <div className="row">

                <div className="col-6">

                  <input
                    className="form-control mb-2"
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #dbe2ea"
                    }}
                  />

                </div>

                <div className="col-6">

                  <input
                    className="form-control mb-2"
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleChange}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #dbe2ea"
                    }}
                  />

                </div>

              </div>

              <input
                className="form-control mb-3"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea"
                }}
              />

              <button
                className="btn w-100 fw-bold py-2"
                onClick={handlePlaceOrder}
                style={{
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: "12px"
                }}
              >
                Place Order
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;