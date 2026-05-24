import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./navbar.css";
import { BASE_URL } from "../helper";
import toast, { Toaster } from "react-hot-toast";

function Navbar({ user }) {
  const navigate = useNavigate();

  const carts = useSelector((state) => state.cart.carts);


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("usertoken");

      if (token) {
        await axios.get(`${BASE_URL}/api/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // console.log("Logout error:", error);
      toast.error("Logout Failed !");
      localStorage.removeItem("usertoken");
    }

    // ✅ Clear frontend storage
    localStorage.removeItem("usertoken");
    localStorage.removeItem("user");
    localStorage.removeItem("auth_verified_time");
    navigate("/");
  };

  const badgeStyle = {
    position: "absolute",
    top: "-11px",
    right: "-12px",
    background: "#dc3545",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    padding: "2px 6px",
    fontWeight: "bold",
  };

  return (
    <>
      <Toaster />
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          {/* Logo */}
          <NavLink className="navbar-brand fw-bold" to="/dashboard">
            <img src="https://i.postimg.cc/TP6JjSTt/logo.webp" alt="logo" style={{ width: "130px" }} />
          </NavLink>

          {/* Mobile Toggle */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span className="navbar-toggler-icon"></span>
          </button>




          {/* Navbar Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* LEFT */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Products</NavLink>
              </li>
            </ul>

            {/* RIGHT */}
            {/* <div className="d-flex align-items-center gap-3"> */}
            <div className="d-flex align-items-center gap-3 ms-lg-auto position-relative">
              {/* CART */}
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("/cart")}>
                <i className="fa-solid fa-cart-shopping fs-5"></i>
                {carts.length > 0 && (<span style={badgeStyle}>{carts.length}</span>)}
              </div>

              {/* USER DROPDOWN */}
              {/* <div className="dropdown"> */}
              <div className="dropdown position-relative">
                <img src={user?.userprofile || "/logo192.png"} alt="profile" className="rounded-circle dropdown-toggle" width="40" height="40" style={{ cursor: "pointer", objectFit: "cover" }} data-bs-toggle="dropdown" />

                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li className="px-3 py-2">
                    <div className="fw-semibold"> {user?.firstname} {user?.lastname} </div>
                    <div className="small text-muted"> {user?.email} </div>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <NavLink className="dropdown-item" to="/userprofile">
                      <i className="fa-regular fa-user me-2"></i>Profile
                    </NavLink>
                  </li>

                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket me-2"></i>
                      Logout
                    </button>
                  </li>

                </ul>

              </div>

            </div>
          </div>


        </div>
      </nav >
    </>

  );
}

export default Navbar;