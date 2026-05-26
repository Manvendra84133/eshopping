import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

import { BASE_URL } from "../../helper";
import AdminNavbar from "./AdminNavbar";


function AdminLogin() {
  const navigate = useNavigate();

  const [passShow, setPassShow] = useState(false);

  const [adminDetail, setAdminDetail] = useState({ email: "", password: "", });


  const stylePass = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0d6efd"
  };


  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetail((prev) => ({ ...prev, [name]: value, }));
  };


  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = adminDetail;


    // VALIDATIONS
    if (!email) {
      return toast.error("Email is Required !");
    }

    if (!email.includes("@")) {
      return toast.error("Enter Valid Email !");
    }

    if (!password) {
      return toast.error("Password is Required !");
    }


    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, adminDetail);
      // console.log("ADMIN LOGIN SUCCESS:", res.data);

      // STORE TOKEN
      if (res.data.token) {
        localStorage.setItem("admintoken", res.data.token);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("usertoken");

      // STORE ADMIN DATA
      localStorage.setItem("admin", JSON.stringify(res.data.adminValid));
      toast.success("Admin Login Successful 🎉");

      navigate("/admin/addproduct");

    } catch (error) {
      // console.log("FULL ERROR:", error);
      // console.log("BACKEND ERROR:", error.response?.data);
      toast.error(error.response?.data?.error || "Login Failed");
    }
  };


  // TOKEN CHECK
  useEffect(() => {
    const token = localStorage.getItem("admintoken");

    if (token) {
      navigate("/admin/addproduct");
    }
  }, [navigate]);


  return (
    <>
      <Toaster />
      {/* <AdminNavbar /> */}
      <section className="d-flex align-items-center bg-light pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body px-3">
                  <h2 className="text-center mb-3 text-dark">Admin Sign In</h2>

                  <form onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div className="mb-3">
                      <input type="email" name="email" value={adminDetail.email} onChange={handleChange} className="form-control" placeholder="Enter Email" />
                    </div>


                    {/* PASSWORD */}
                    <div className="mb-3 position-relative">
                      <input type={passShow ? "text" : "password"} name="password" value={adminDetail.password} onChange={handleChange} className="form-control" placeholder="Enter Password" />

                      <span onClick={() => setPassShow(!passShow)} style={stylePass}>
                        {passShow ? "Hide" : "Show"}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <div className="d-grid mb-2">
                      <button type="submit" className="btn btn-dark">Admin Sign In</button>
                    </div>

                    {/* REGISTER LINK */}
                    <p className="text-center">Don't have an admin account?{" "}
                      <NavLink to="/admin/signup">Register Here</NavLink>
                    </p>
                  </form>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;