import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../helper";

const OrderPage = () => {
  const navigate = useNavigate();

  // =========================
  // LOADING STATE
  // =========================
  const [loading, setLoading] = useState(false);

  // =========================
  // REDUX CART DATA
  // =========================
  const carts = useSelector((state) => state.cart.carts);

  // TOTAL QUANTITY
  const totalQty = carts.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  // TOTAL PRICE
  const totalPrice = carts.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // =========================
  // LOAD RAZORPAY SDK
  // =========================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      // SDK ALREADY LOADED
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================
  // PLACE ORDER
  // =========================
  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      console.log("clicked on place order");

      // =========================
      // WAKE RENDER BACKEND
      // =========================
      await axios.get(`${BASE_URL}/`);

      // =========================
      // LOAD RAZORPAY SDK
      // =========================
      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        toast.error("Razorpay SDK Failed To Load");
        setLoading(false);
        return;
      }

      // =========================
      // USER
      // =========================
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user) {
        toast.error("Please Login First");
        setLoading(false);
        return;
      }

      console.log("user is", user);

      // =========================
      // CREATE ORDER API
      // =========================
      const orderResponse = await axios.post(
        `${BASE_URL}/api/payment/create-order`,
        {
          amount: totalPrice,
        }
      );

      console.log(
        "order response is",
        orderResponse.data
      );

      const order = orderResponse.data;

      // =========================
      // RAZORPAY OPTIONS
      // =========================
      const options = {
        key: "rzp_test_StC61zg7qzX7e1",
        amount: order.amount,
        currency: order.currency,
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: order.id,

        prefill: {
          name: `${user.firstname} ${user.lastname}`,
          email: user.email,
          contact: user.mobile || "9999999999",
        },

        theme: {
          color: "#3399cc",
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled");
          },
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================
        handler: async function (response) {
          console.log(
            "payment success response",
            response
          );

          try {
            console.log(
              "VERIFY API CALL STARTED"
            );

            // =========================
            // VERIFY PAYMENT API
            // =========================
            const verifyResponse =
              await axios.post(
                `${BASE_URL}/api/payment/verify-payment`,
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  user,
                  carts,
                  totalQty,
                  totalPrice,
                }
              );

            console.log(
              "verify response",
              verifyResponse.data
            );

            // =========================
            // SUCCESS
            // =========================
            if (verifyResponse.data.success) {

              toast.success(
                "Payment Successful 🎉"
              );

              // =========================
              // SEND MAIL API
              // =========================
              try {

                console.log(
                  "MAIL API STARTED"
                );

                await axios.post(
                  `${BASE_URL}/api/payment/send-order-mail`,
                  {
                    user,
                    carts,
                    totalQty,
                    totalPrice,
                  }
                );

                toast.success(
                  "Order Email Sent 📧"
                );

              } catch (mailError) {

                console.log(
                  "MAIL ERROR =>",
                  mailError
                );

                console.log(
                  "MAIL ERROR RESPONSE =>",
                  mailError.response?.data
                );

                toast.error(
                  mailError.response?.data
                    ?.message ||
                  "Mail Sending Failed"
                );
              }

              // =========================
              // SUCCESS PAGE
              // =========================

              setTimeout(() => {
                navigate("/order-success");
              }, 2000);

              // navigate("/order-success");
            } else {
              toast.error(
                "Payment Verification Failed"
              );
            }

          } catch (error) {
            console.log(
              "VERIFY ERROR =>",
              error
            );

            console.log(
              "VERIFY ERROR RESPONSE =>",
              error.response?.data
            );

            toast.error(
              error.response?.data?.message ||
              "Verification Failed"
            );
          }
        },
      };

      // =========================
      // OPEN RAZORPAY
      // =========================
      const paymentObject =
        new window.Razorpay(options);

      paymentObject.open();

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container my-5">
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-dark text-white">
                <h5 className="m-0 text-white">
                  Order Summary
                </h5>
              </div>

              <div className="card-body">
                {
                  carts.length === 0 ? (
                    <p>Your cart is empty</p>
                  ) : (

                    carts.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                      >

                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt=""
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                            }}
                          />

                          <div className="ms-3">
                            <h6 className="mb-1">
                              {item.title}
                            </h6>

                            <small>
                              Qty: {item.qty}
                            </small>

                          </div>
                        </div>

                        <div>
                          ₹{item.price * item.qty}
                        </div>
                      </div>
                    ))
                  )
                }

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="m-0 text-white">
                  Price Details
                </h5>
              </div>

              <div className="card-body">
                <p>
                  <strong>Total Items:</strong>{" "}
                  {totalQty}
                </p>

                <p>
                  <strong>Total Price:</strong>{" "}
                  ₹{totalPrice}
                </p>

                <hr />

                <button
                  className="btn btn-success w-100"
                  onClick={handlePlaceOrder}
                  disabled={
                    carts.length === 0 || loading
                  }
                >
                  {
                    loading
                      ? "Processing..."
                      : "Place Order"
                  }
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default OrderPage;



// import axios from 'axios';
// import React from 'react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { BASE_URL } from '../../helper';

// const OrderPage = () => {
//   const navigate = useNavigate();

//   // REDUX CART DATA
//   const carts = useSelector((state) => state.cart.carts);
//   // TOTAL QUANTITY
//   const totalQty = carts.reduce((acc, item) => acc + item.qty, 0);
//   // TOTAL PRICE
//   const totalPrice = carts.reduce((acc, item) => acc + item.price * item.qty, 0);

//   console.log("carts are", carts);
//   console.log("totalQty are", totalQty);
//   console.log("totalPrice are", totalPrice);



//   // =========================
//   // LOAD RAZORPAY SDK
//   // =========================


//   // const loadRazorpay = () => {
//   //   return new Promise((resolve) => {
//   //     const script = document.createElement("script");
//   //     script.src = "https://checkout.razorpay.com/v1/checkout.js";

//   //     script.onload = () => {
//   //       resolve(true);
//   //     };

//   //     script.onerror = () => {
//   //       resolve(false);
//   //     };
//   //     document.body.appendChild(script);
//   //   });
//   // };


//   const loadRazorpay = () => {

//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }

//       const script = document.createElement("script");

//       script.src = "https://checkout.razorpay.com/v1/checkout.js";

//       script.onload = () => {
//         resolve(true);
//       };

//       script.onerror = () => {
//         resolve(false);
//       };

//       document.body.appendChild(script);

//     });
//   };

//   // =========================
//   // PLACE ORDER
//   // =========================

//   const handlePlaceOrder = async () => {
//     try {
//       console.log("clicked on place order");

//       // LOAD RAZORPAY
//       const razorpayLoaded = await loadRazorpay();

//       if (!razorpayLoaded) {
//         toast.error("Razorpay SDK Failed To Load");
//         return;
//       }

//       // USER
//       const user = JSON.parse(localStorage.getItem("user"));
//       console.log("user is", user);

//       // =========================
//       // CREATE ORDER API
//       // =========================
//       const orderResponse = await axios.post(`${BASE_URL}/api/payment/create-order`, { amount: totalPrice, });

//       console.log("order response is", orderResponse.data);
//       const order = orderResponse.data;

//       // =========================
//       // RAZORPAY OPTIONS
//       // =========================

//       const options = {
//         key: "rzp_test_Sq1bluWLjCYv1T",
//         amount: order.amount,
//         currency: order.currency,
//         name: "Ecommerce Store",
//         description: "Order Payment",
//         order_id: order.id,

//         prefill: {
//           name: `${user.firstname} ${user.lastname}`,
//           email: user.email,
//           contact: user.mobile || "9999999999",
//         },
//         theme: {
//           color: "#3399cc",
//         },


//         // =========================
//         // PAYMENT SUCCESS
//         // =========================

//         handler: async function (response) {
//           console.log("payment success response", response);

//           try {
//             console.log("VERIFY API CALL STARTED");
//             // =========================
//             // VERIFY PAYMENT API
//             // =========================
//             const verifyResponse = await axios.post(`${BASE_URL}/api/payment/verify-payment`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,

//                 user,
//                 carts,
//                 totalQty,
//                 totalPrice,
//               }
//             );


//             console.log("verify response", verifyResponse.data);


//             // =========================
//             // SUCCESS
//             // =========================

//             if (verifyResponse.data.success) {
//               toast.success("Payment Successful 🎉");

//               // SEND MAIL API
//               try {
//                 const mailResponse = await axios.post(
//                   `${BASE_URL}/api/payment/send-order-mail`,
//                   {
//                     user,
//                     carts,
//                     totalQty,
//                     totalPrice
//                   });


//                 // toast.success("Order Mail Sent Successfully");

//                 toast.success("Order Email Sent 📧");
//               } catch (mailError) {
//                 toast.error("Mail Sending Failed");

//                 console.log("MAIL ERROR =>", mailError);
//               }


//               // SUCCESS PAGE
//               navigate("/order-success");
//             }
//             else {
//               toast.error("Payment Verification Failed");
//             }
//           }
//           catch (error) {
//             console.log(error);
//             // toast.error("Verification Failed");
//             console.log("VERIFY ERROR =>", error);
//             console.log("VERIFY ERROR RESPONSE =>", error.response?.data);

//             toast.error(error.response?.data?.message || "Verification Failed");
//           }
//         },
//       };



//       // =========================
//       // OPEN RAZORPAY
//       // =========================

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     }
//     catch (error) {
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   };



//   return (
//     <>
//       <Toaster />
//       <div className="container my-5">
//         <div className="row">

//           {/* LEFT SIDE */}
//           <div className="col-md-8">
//             <div className="card">
//               <div className="card-header bg-dark text-white">
//                 <h5 className="m-0 text-white">Order Summary</h5>
//               </div>


//               <div className="card-body">
//                 {
//                   carts.length === 0 ? (
//                     <p>Your cart is empty</p>
//                   ) : (
//                     carts.map((item) => (
//                       <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
//                         <div className="d-flex align-items-center">
//                           <img src={item.image} alt="" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
//                           <div className="ms-3">
//                             <h6 className="mb-1">{item.title}</h6>
//                             <small>Qty: {item.qty}</small>
//                           </div>
//                         </div>
//                         <div>₹{item.price * item.qty}</div>
//                       </div>
//                     ))
//                   )
//                 }
//               </div>
//             </div>
//           </div>



//           {/* RIGHT SIDE */}
//           <div className="col-md-4">
//             <div className="card">
//               <div className="card-header bg-success text-white">
//                 <h5 className="m-0 text-white">Price Details</h5>
//               </div>


//               <div className="card-body">
//                 <p>
//                   <strong>Total Items:</strong>
//                   {" "}
//                   {totalQty}
//                 </p>


//                 <p>
//                   <strong>
//                     Total Price:
//                   </strong>

//                   {" "}

//                   ₹{totalPrice}
//                 </p>

//                 <hr />


//                 <button className="btn btn-success w-100" onClick={handlePlaceOrder} disabled={carts.length === 0}>Place Order</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OrderPage;
