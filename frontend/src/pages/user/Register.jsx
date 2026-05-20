import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [passShow, setPassShow] = useState(false);
  const [cPassShow, setCPassShow] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const [userDetail, setUserDetail] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const styleObj = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0d6efd",
  };

  const imgStyle = {
    width: "60px",
    height: "60px",
    objectFit: "cover",
  };

  const headingStyle = { color: "navy" };

  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
    } = userDetail;

    if (firstname === "") return toast.error("First Name is Required !");
    if (lastname === "") return toast.error("Last Name is Required !");
    if (email === "") return toast.error("Email is Required !");
    if (!email.includes("@")) return toast.error("Enter Valid Email !");
    if (!image) return toast.error("Profile Image Required !");
    if (password === "") return toast.error("Password is Required !");
    if (confirmpassword === "")
      return toast.error("Confirm Password Required !");
    if (password !== confirmpassword)
      return toast.error("Passwords do not match !");

    try {
      const formData = new FormData();

      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmpassword", confirmpassword);
      formData.append("userprofile", image);

      const res = await axios.post(
        `${BASE_URL}/api/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        res.data || "User Registered Successfully 🎉"
      );

      setUserDetail({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      setImage("");
      setPreview("");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.error ||
          "Registration Failed"
      );
    }
  };

  useEffect(() => {
    if (image) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  return (
    <>
      <Toaster />

      <section className="d-flex align-items-center bg-light pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body px-3">

                  <h2
                    className="text-center mb-2"
                    style={headingStyle}
                  >
                    Sign Up
                  </h2>

                  <div className="text-center mb-3">
                    <img
                      src={
                        preview
                          ? preview
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="profile"
                      className="rounded-circle border"
                      style={imgStyle}
                    />
                  </div>

                  <form>

                    <input
                      type="text"
                      name="firstname"
                      value={userDetail.firstname}
                      onChange={handleChange}
                      className="form-control py-1 mb-2"
                      placeholder="Enter First Name"
                    />

                    <input
                      type="text"
                      name="lastname"
                      value={userDetail.lastname}
                      onChange={handleChange}
                      className="form-control py-1 mb-2"
                      placeholder="Enter Last Name"
                    />

                    <input
                      type="email"
                      name="email"
                      value={userDetail.email}
                      onChange={handleChange}
                      className="form-control py-1 mb-2"
                      placeholder="Enter Email"
                    />

                    <input
                      type="file"
                      onChange={setProfile}
                      className="form-control py-1 mb-2"
                    />

                    <input
                      type={passShow ? "text" : "password"}
                      name="password"
                      value={userDetail.password}
                      onChange={handleChange}
                      className="form-control py-1 mb-2"
                      placeholder="Enter Password"
                    />

                    <input
                      type={cPassShow ? "text" : "password"}
                      name="confirmpassword"
                      value={userDetail.confirmpassword}
                      onChange={handleChange}
                      className="form-control py-1 mb-3"
                      placeholder="Confirm Password"
                    />

                    <div className="d-grid mb-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSubmit}
                      >
                        Sign Up
                      </button>
                    </div>

                    <p className="text-center mb-3">
                      Already have an account?{" "}
                      <NavLink to="/">
                        Login
                      </NavLink>
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
};

export default Register;