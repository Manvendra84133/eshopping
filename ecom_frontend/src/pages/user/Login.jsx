import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "../../helper";


function Login() {
  const navigate = useNavigate();

  const [passShow, setPassShow] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const stylePass = { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "14px", color: "#0d6efd" }


  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail((prev) => ({ ...prev, [name]: value, }));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = userDetail;

    // validations
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
      const res = await axios.post(`${BASE_URL}/api/users/login`, userDetail);
      // console.log("LOGIN SUCCESS:", res.data);


      // ✅ store token
      if (res.data.token) {
        localStorage.setItem("usertoken", res.data.token);
      }

      localStorage.removeItem("admin");
      localStorage.removeItem("admintoken");

      
      // ✅ ADD THIS (important)
      localStorage.setItem("user", JSON.stringify(res.data.userValid));
      toast.success("Login Successful 🎉");

      navigate("/dashboard");
    } catch (error) {
      // console.log("FULL ERROR:", error);
      // console.log("BACKEND ERROR:", error.response?.data);
      toast.error(error.response?.data?.error || "Login Failed");
    }
  };



  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <Toaster />

      <section className="d-flex align-items-center bg-light pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body px-3">

                  <h2 className="text-center mb-3 text-primary">Sign In</h2>

                  <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-3">
                      <input type="email" name="email" value={userDetail.email} onChange={handleChange} className="form-control" placeholder="Enter Email" />
                    </div>

                    {/* Password */}
                    <div className="mb-3 position-relative">
                      <input type={passShow ? "text" : "password"} name="password" value={userDetail.password} onChange={handleChange} className="form-control" placeholder="Enter Password" />
                      <span onClick={() => setPassShow(!passShow)} style={stylePass}>{passShow ? "Hide" : "Show"}</span>
                    </div>

                    {/* Button */}
                    <div className="d-grid mb-2">
                      <button type="submit" className="btn btn-primary">Sign In</button>
                    </div>

                    {/* Register Link */}
                    <p className="text-center">
                      Don't have an account?{" "}
                      <NavLink to="/register">Register Here</NavLink>
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

export default Login;