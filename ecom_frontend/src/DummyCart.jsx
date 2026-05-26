import React from "react";
import "./pages/cart/cartstyle.css";

const DummyCart = () => {

  // 🔥 Dummy Data
  const carts = [
    {
      id: 1,
      title: "Mens Cotton Jacket",
      price: 559.99,
      qty: 1,
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
    },
    {
      id: 2,
      title: "Casual T-Shirt",
      price: 299.99,
      qty: 2,
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"
    }
  ];

  // Static totals
  const totalQty = carts.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.price * item.qty, 0);


  return (
    <div className="cart-container">
      <div className="cart-card">

        {/* HEADER */}
        <div className="cart-header">
          <h5>Cart ({carts.length} {carts.length > 1 ? 'items' : 'item'})</h5>
          <button className="btn-clear">🗑 Clear Cart</button>
        </div>

        {/* BODY */}
        <div className="cart-body">
          {
            carts.length === 0
              ?
              (<div className="empty-cart"><p>🛒 Your cart is empty</p></div>)
              :
              (
                <>
                  {/* ITEMS */}
                  <div className="cart-items">
                    {
                      carts.map((item) => (
                        <div className="cart-item" key={item.id}>
                          {/* IMAGE */}
                          <img src={item.image} alt="" className="cart-img" />

                          {/* DETAILS */}
                          <div className="item-details">
                            <h6>{item.title}</h6>
                            <p>₹{item.price}</p>

                            {/* QTY */}
                            <div className="qty-box">
                              <button>-</button>
                              <span>{item.qty}</span>
                              <button>+</button>
                            </div>
                          </div>

                          {/* RIGHT SIDE */}
                          <div className="item-right">
                            <p className="item-total">₹{(item.price * item.qty).toFixed(2)}</p>
                            <button className="btn-delete">✖</button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* SUMMARY */}
                  <div className="cart-summary">
                    <p><strong>Total Items:</strong> {totalQty}</p>
                    <p><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
                  </div>

                  {/* CHECKOUT */}
                  <div className="checkout-box">
                    <button className="btn-checkout">Proceed to Checkout</button>
                  </div>
                </>
              )}

        </div>
      </div>
    </div>
  );
};

export default DummyCart;