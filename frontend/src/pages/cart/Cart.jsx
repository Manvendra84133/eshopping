import React, { useEffect, useState } from 'react';
import './cartstyle.css';

import { useDispatch, useSelector } from 'react-redux';

import {
  addToCart,
  clearCart,
  decrementQty,
  removeFromCart
} from '../../redux/slices/cartSlice';

import toast, { Toaster } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { carts } = useSelector((state) => state.cart);

  const [totalPrice, setTotalPrice] = useState(0);

  const [totalQty, setTotalQty] = useState(0);

  // ➕ Increment
  const handleIncrement = (item) => {
    dispatch(addToCart(item));
    toast.success('Item added');
  };

  // ➖ Decrement
  const handleDecrement = (item) => {
    dispatch(decrementQty(item));
    toast.error('Item removed');
  };

  // ❌ Remove Item
  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
    toast.error('Item deleted');
  };

  // 🗑️ Clear Cart
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.error('Cart cleared');
  };

  // 🧮 Total Calculation
  useEffect(() => {

    let price = 0;

    let qty = 0;

    carts.forEach((item) => {
      price += item.price * item.qty;
      qty += item.qty;
    });

    setTotalPrice(price);

    setTotalQty(qty);

  }, [carts]);

  return (
    <>
      <Toaster position="top-center" />

      <div className="container my-5">

        <div className="card">

          {/* HEADER */}
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

            <h5 className="m-0">
              Cart ({carts.length})
            </h5>

            {carts.length > 0 && (
              <button
                className="btn btn-danger btn-sm"
                onClick={handleClearCart}
              >
                <i className="fa fa-trash me-2"></i>
                Clear Cart
              </button>
            )}

          </div>

          {/* BODY */}
          <div className="card-body p-0">

            {carts.length === 0 ? (

              <div className="text-center p-5">

                <i className="fa fa-shopping-cart fa-2x text-muted mb-3"></i>

                <p>Your cart is empty</p>

              </div>

            ) : (

              <table className="table table-bordered mb-0 text-center align-middle">

                <thead className="table-light">

                  <tr>
                    <th>Action</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>

                </thead>

                <tbody>

                  {carts.map((item) => (

                    <tr key={item.id}>

                      {/* DELETE */}
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemove(item)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>

                      {/* IMAGE */}
                      <td>

                        <img
                          src={item.image}
                          alt=""
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain"
                          }}
                        />

                      </td>

                      {/* TITLE */}
                      <td>{item.title}</td>

                      {/* PRICE */}
                      <td>${item.price}</td>

                      {/* QTY */}
                      <td>

                        <div className="d-flex justify-content-center align-items-center">

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleDecrement(item)}
                          >
                            -
                          </button>

                          <input
                            type="text"
                            value={item.qty}
                            readOnly
                            className="form-control mx-2 text-center"
                            style={{ width: "50px" }}
                          />

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleIncrement(item)}
                          >
                            +
                          </button>

                        </div>

                      </td>

                      {/* TOTAL */}
                      <td>
                        ${(item.price * item.qty).toFixed(2)}
                      </td>

                    </tr>

                  ))}

                </tbody>

                {/* FOOTER */}
                <tfoot>

                  <tr>

                    <td colSpan="3"></td>

                    <td colSpan="1">
                      <strong>Total Items:</strong> {totalQty}
                    </td>

                    <td colSpan="2">
                      <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                    </td>

                  </tr>

                  {/* CHECKOUT BUTTON */}
                  <tr>

                    <td colSpan="6" className="text-end p-3">

                      <button
                        className="btn btn-success"
                        onClick={() => navigate("/checkout")}
                      >
                        Proceed To Checkout
                      </button>

                    </td>

                  </tr>

                </tfoot>

              </table>

            )}

          </div>

        </div>

      </div>
    </>
  );
};

export default Cart;