import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Redux se cart
  const carts = useSelector((state) => state.cart.carts);

  // ✅ localStorage se user
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const totalQty = carts.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = carts.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleContinue = () => {
    dispatch(clearCart()); // optional but recommended
    navigate('/dashboard');
  };

  // console.log("cart data is on Order Success page", carts);
  // console.log("user data is on Order Success page", user);


  return (
    <div className="container my-5">
      <div className="card p-4 shadow">

        {/* SUCCESS */}
        <div className="text-center mb-4">
          <h3 className="text-success">🎉 Order Confirmed</h3>
          <p>Thank you for your order!</p>
        </div>

        <div className="row">
          {/* USER INFO */}
          <div className="col-md-4">
            <div className="border p-3 rounded">

              <div className='d-flex justify-content-between align-items-center'>
                <h5>User Info</h5>
                <div className="text-center">
                  <img src={user?.userprofile || "/logo192.png"} alt="profile" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                </div>
              </div>

              <hr />

              <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="col-md-5">
            <div className="border p-3 rounded">
              <h5>Order Summary</h5>
              <hr />

              {carts.length === 0 ? (
                <p>No items</p>
              ) : (
                carts.map((item, index) => (
                  <div key={index} >
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{item.title.slice(0, 20)} (x{item.qty})</span>
                      <img src={item.image} alt="product_image" style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                      <span>₹{item.price * item.qty}</span>
                    </div>

                    <hr className='text-warning' />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PRICE */}
          <div className="col-md-3">
            <div className="border p-3 rounded">
              <h5>Price</h5>
              <hr />

              <p>Total Items: {totalQty}</p>
              <p>Total Price: ₹{totalPrice}</p>

              <hr />
              <h6 className="text-success">Paid ✔</h6>
            </div>
          </div>

        </div>

        {/* ACTION */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleContinue}>Continue Shopping</button>
        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;