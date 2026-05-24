import React, { useEffect, useState } from 'react';
import './cartstyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, decrementQty, removeFromCart } from '../../redux/slices/cartSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carts } = useSelector((state) => state.cart);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  // Increment
  const handleIncrement = (item) => {
    dispatch(addToCart(item));
    toast.success('Item added');
  };

  // Decrement
  const handleDecrement = (item) => {
    dispatch(decrementQty(item));
    toast.error('Item removed');
  };

  //  Remove Item
  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
    toast.error('Item deleted');
  };

  //  Clear Cart
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.error('Cart cleared');
  };

  const handleCheckout = () => {
    navigate('/order'); // your order page route
    // navigate('/order', { state: carts });
  };

  //  Total Calculation
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

      <div className="cart-container">
        <div className="cart-card">

          {/* HEADER */}
          <div className="cart-header">
            <h5>Cart ({carts.length})</h5>
            {carts.length > 0 && (
              <button className="btn-clear" onClick={handleClearCart}>🗑 Clear Cart</button>
            )}
          </div>

          {/* BODY */}
          <div className="cart-body">

            {carts.length === 0 ? (
              <div className="empty-cart"><p>🛒 Your cart is empty</p></div>
            ) : (
              <>
                {/* ITEMS */}
                <div className="cart-items">
                  {carts.map((item) => (
                    <div className="cart-item" key={item.id}>

                      {/* IMAGE */}
                      <img src={item.image} alt="" className="cart-img" />

                      {/* DETAILS */}
                      <div className="item-details">
                        <h6>{item.title}</h6>
                        <p>₹{item.price}</p>

                        {/* QTY */}
                        <div className="qty-box">
                          <button onClick={() => handleDecrement(item)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleIncrement(item)}>+</button>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="item-right">
                        <p className="item-total">₹{(item.price * item.qty).toFixed(2)}</p>

                        <button className="btn-delete" onClick={() => handleRemove(item)}>✖</button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* FOOTER SUMMARY */}
                <div className="cart-summary">
                  <p><strong>Total Items:</strong> {totalQty}</p>
                  <p><strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}</p>
                </div>

                {/* CHECKOUT */}
                <div className="checkout-box">
                  <button className="btn-checkout" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>

    </>
  );
};

export default Cart;














// // import React from 'react';
// // import './cartstyle.css';

// // const Cart = () => {

// //   // Dummy Data
// //   const carts = [
// //     {
// //       id: 1,
// //       title: "Burger",
// //       price: 120,
// //       qty: 2,
// //       image: "https://via.placeholder.com/50"
// //     },
// //     {
// //       id: 2,
// //       title: "Pizza",
// //       price: 250,
// //       qty: 1,
// //       image: "https://via.placeholder.com/50"
// //     }
// //   ];

// //   // Static Totals
// //   const totalQty = carts.reduce((acc, item) => acc + item.qty, 0);
// //   const totalPrice = carts.reduce((acc, item) => acc + item.price * item.qty, 0);

// //   return (
// //     <div className="container my-5">
// //       <div className="card">

// //         {/* HEADER */}
// //         <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
// //           <h5 className="m-0">Cart ({carts.length})</h5>

// //           <button className="btn btn-danger btn-sm">
// //             <i className="fa fa-trash me-2"></i>Clear Cart
// //           </button>
// //         </div>

// //         {/* BODY */}
// //         <div className="card-body p-0">

// //           {carts.length === 0 ? (
// //             <div className="text-center p-5">
// //               <i className="fa fa-shopping-cart fa-2x text-muted mb-3"></i>
// //               <p>Your cart is empty</p>
// //             </div>
// //           ) : (
// //             <table className="table table-bordered mb-0 text-center align-middle">

// //               <thead className="table-light">
// //                 <tr>
// //                   <th>Action</th>
// //                   <th>Image</th>
// //                   <th>Product</th>
// //                   <th>Price</th>
// //                   <th>Qty</th>
// //                   <th>Total</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {carts.map((item) => (
// //                   <tr key={item.id}>

// //                     {/* DELETE */}
// //                     <td>
// //                       <button className="btn btn-sm btn-danger">
// //                         <i className="fa fa-trash"></i>
// //                       </button>
// //                     </td>

// //                     {/* IMAGE */}
// //                     <td>
// //                       <img
// //                         src={item.image}
// //                         alt=""
// //                         style={{ width: "50px", height: "50px", objectFit: "contain" }}
// //                       />
// //                     </td>

// //                     {/* TITLE */}
// //                     <td>{item.title}</td>

// //                     {/* PRICE */}
// //                     <td>₹{item.price}</td>

// //                     {/* QTY */}
// //                     <td>
// //                       <div className="d-flex justify-content-center align-items-center">
// //                         <button className="btn btn-sm btn-outline-primary">-</button>

// //                         <input
// //                           type="text"
// //                           value={item.qty}
// //                           readOnly
// //                           className="form-control mx-2 text-center"
// //                           style={{ width: "50px" }}
// //                         />

// //                         <button className="btn btn-sm btn-outline-primary">+</button>
// //                       </div>
// //                     </td>

// //                     {/* TOTAL */}
// //                     <td>₹{item.price * item.qty}</td>

// //                   </tr>
// //                 ))}
// //               </tbody>

// //               {/* FOOTER */}
// //               <tfoot>
// //                 <tr>
// //                   <td colSpan="3"></td>
// //                   <td>
// //                     <strong>Total Items:</strong> {totalQty}
// //                   </td>
// //                   <td colSpan="2">
// //                     <strong>Total Price:</strong> ₹{totalPrice}
// //                   </td>
// //                 </tr>
// //               </tfoot>

// //             </table>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Cart;

// // import React, { useEffect, useState } from 'react';
// // import './cartstyle.css';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { addToCart, clearCart, decrementQty, removeFromCart } from '../../redux/slices/cartSlice';
// // import toast, { Toaster } from 'react-hot-toast';
// // import { useNavigate } from 'react-router-dom';

// // const Cart = () => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const { carts } = useSelector((state) => state.cart);

// //   const [totalPrice, setTotalPrice] = useState(0);
// //   const [totalQty, setTotalQty] = useState(0);

// //   // Increment
// //   const handleIncrement = (item) => {
// //     dispatch(addToCart(item));
// //     toast.success('Item added');
// //   };

// //   // Decrement
// //   const handleDecrement = (item) => {
// //     dispatch(decrementQty(item));
// //     toast.error('Item removed');
// //   };

// //   //  Remove Item
// //   const handleRemove = (item) => {
// //     dispatch(removeFromCart(item.id));
// //     toast.error('Item deleted');
// //   };

// //   //  Clear Cart
// //   const handleClearCart = () => {
// //     dispatch(clearCart());
// //     toast.error('Cart cleared');
// //   };

// //   const handleCheckout = () => {
// //     navigate('/order'); // your order page route
// //     // navigate('/order', { state: carts });
// //   };

// //   //  Total Calculation
// //   useEffect(() => {
// //     let price = 0;
// //     let qty = 0;

// //     carts.forEach((item) => {
// //       price += item.price * item.qty;
// //       qty += item.qty;
// //     });

// //     setTotalPrice(price);
// //     setTotalQty(qty);
// //   }, [carts]);

// //   return (
// //     <>
// //       <Toaster position="top-center" />

// //       <div className="container my-5">
// //         <div className="card">

// //           {/* HEADER */}
// //           <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
// //             <h5 className="m-0 text-white">
// //               Cart ({carts.length})
// //             </h5>

// //             {carts.length > 0 && (
// //               <button className="btn btn-danger btn-sm" onClick={handleClearCart}>
// //                 <i className="fa fa-trash me-2"></i>Clear Cart
// //               </button>
// //             )}
// //           </div>

// //           {/* BODY */}
// //           <div className="card-body p-0">

// //             {carts.length === 0 ? (
// //               <div className="text-center p-5">
// //                 <i className="fa fa-shopping-cart fa-2x text-muted mb-3"></i>
// //                 <p>Your cart is empty</p>
// //               </div>
// //             ) : (
// //               <>
// //                 <table className="table table-bordered mb-0 text-center align-middle">
// //                   <thead className="table-light">
// //                     <tr>
// //                       <th>Action</th>
// //                       <th>Image</th>
// //                       <th>Product</th>
// //                       <th>Price</th>
// //                       <th>Qty</th>
// //                       <th>Total</th>
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {carts.map((item) => (
// //                       <tr key={item.id}>

// //                         {/* DELETE */}
// //                         <td>
// //                           <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item)} >
// //                             <i className="fa fa-trash"></i>
// //                           </button>
// //                         </td>

// //                         {/* IMAGE */}
// //                         <td>
// //                           <img src={item.image} alt="" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
// //                         </td>

// //                         {/* TITLE */}
// //                         <td>{item.title}</td>
// //                         {/* PRICE */}
// //                         <td>${item.price}</td>
// //                         {/* QTY */}
// //                         <td>
// //                           <div className="d-flex justify-content-center align-items-center">
// //                             <button className="btn btn-sm btn-outline-primary" onClick={() => handleDecrement(item)}>-</button>
// //                             <input type="text" value={item.qty} readOnly className="form-control mx-2 text-center" style={{ width: "50px" }} />
// //                             <button className="btn btn-sm btn-outline-primary" onClick={() => handleIncrement(item)}>+</button>
// //                           </div>
// //                         </td>

// //                         {/* TOTAL */}
// //                         <td>${(item.price * item.qty).toFixed(2)}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>

// //                   {/* FOOTER */}
// //                   <tfoot>
// //                     <tr>
// //                       <td colSpan="3"></td>
// //                       <td colSpan="1">
// //                         <strong>Total Items:</strong> {totalQty}
// //                       </td>
// //                       <td colSpan="2">
// //                         <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
// //                       </td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>

// //                 {/* ✅ CHECKOUT BUTTON */}
// //                 <div className="p-3 d-flex justify-content-end">
// //                   <button className="btn btn-success px-4" onClick={handleCheckout}>
// //                     Proceed to Checkout
// //                   </button>
// //                 </div>
// //               </>

// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Cart;

// @import url(https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css);
// @import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css);
// @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap");

// /* body {
//     background-color: #e0e3e8;
//     font-family: "Rubik", sans-serif;
//     font-size: 15px;
//     font-weight: 400;
//     line-height: 24px;
//     color: #727E8C;
// } */

// // .h1,
// // .h2,
// // .h3,
// // .h4,
// // .h5,
// // .h6,
// // h1,
// // h2,
// // h3,
// // h4,
// // h5,
// // h6 {
// //   color: #475F7B;
// // }

// // /*
// // a, a:hover, a:focus {
// //     text-decoration: none;
// //     transition: 0.5s;
// //     outline: none;
// // } */

// // /* ------------ */

// // .card {
// //   box-shadow: 0px 4px 8px rgb(0 0 0 / 16%);
// //   border-radius: 6px;
// //   overflow: hidden;
// //   margin-bottom: 30px;
// //   background-color: #fff;
// //   border: none;
// // }

// // .card-body {
// //   padding: 30px;
// // }

// // .btn-primary {
// //   border-color: #5a8dee !important;
// //   background-color: #5a8dee !important;
// //   color: #fff;
// // }

// // .btn-danger {
// //   border-color: #FF2829 !important;
// //   background-color: #FF5B5C !important;
// //   color: #FFF;
// // }

// // .form-submit {
// //   padding: 13px 30px;
// //   font-size: 15px;
// //   letter-spacing: 0.3px;
// //   font-weight: 400;
// // }

// // .card-header-flex {
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// // }

// // .prdct-qty-container {
// //   display: flex;
// //   align-items: center;
// // }

// // .qty-input-box {
// //   max-width: 70px;
// //   padding: 0px 5px;
// //   min-height: 40px;
// //   border-radius: 4px;
// //   text-align: center;
// //   display: inline-block;
// //   margin: 0px 5px;
// //   color: #475F7B;
// //   background-color: #FFF;
// //   border: 1px solid #DFE3E7;
// //   transition: 0.3s;
// // }

// // .qty-input-box:focus {
// //   color: #475F7B;
// //   background-color: #FFF;
// //   border-color: #5A8DEE;
// //   outline: 0;
// //   box-shadow: 0 3px 8px 0 rgb(0 0 0 / 10%);
// // }

// // .prdct-qty-btn {
// //   width: 40px;
// //   height: 40px;
// //   border: none;
// //   border-radius: 4px;
// //   background-color: #5a8dee2e;
// //   color: #5a8dee;
// //   font-size: 11px;
// //   transition: 0.3s;
// // }

// // .prdct-qty-btn:hover {
// //   background-color: #5a8dee;
// //   color: #fff;
// // }

// // .product-img img {
// //   width: 40px;
// //   height: 40px;
// //   border-radius: 4px;
// // }

// // .card-header-flex {
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// // }

// // .prdct-delete {
// //   width: 40px;
// //   height: 40px;
// //   border: none;
// //   border-radius: 4px;
// //   background-color: #fde6e7;
// //   color: #ff5b5c;
// //   font-size: 15px;
// //   transition: 0.3s;
// // }

// // .prdct-delete:hover {
// //   background-color: #ff5b5c;
// //   color: #fff;
// // }

// // .cart-empty {
// //   text-align: center;
// //   padding: 30px;
// // }

// // .cart-empty i {
// //   font-size: 45px;
// //   color: #d5d6d8;
// //   margin-bottom: 10px;
// //   display: inline-block;
// // }

// // .cart-empty p {
// //   margin-bottom: 0;
// //   color: #bdbdbd;
// //   font-size: 16px;
// // }

// // .cart-table td,
// // .cart-table th {
// //   vertical-align: middle;
// // }


