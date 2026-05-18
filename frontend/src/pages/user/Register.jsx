import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
const Register = () => {
  const navigate = useNavigate();

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


  const styleObj = { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "14px", color: "#0d6efd", }
  const imgStyle = { width: "60px", height: "60px", objectFit: "cover" }
  const headingStyle = { color: 'navyBlue' }


  // image set
  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, email, password, confirmpassword } = userDetail;

    // validations
    if (firstname === "") {
      toast.error("First Name is Required !");
    } else if (lastname === "") {
      toast.error("Last Name is Required !");
    } else if (email === "") {
      toast.error("Email is Required !");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !");
    } else if (!image) {
      toast.error("Profile Image Required !");
    } else if (password === "") {
      toast.error("Password is Required !");
    } else if (confirmpassword === "") {
      toast.error("Confirm Password Required !");
    } else if (password !== confirmpassword) {
      toast.error("Passwords do not match !");
    } else {
      try {
        const formData = new FormData();

        console.log("called")
        formData.append("firstname", firstname);
        formData.append("lastname", lastname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmpassword", confirmpassword);
        formData.append("userprofile", image); // important

        const res = await axios.post("http://localhost:4009/api/users/register", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success(res.data || "User Registered Successfully 🎉");

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
        toast.error(error.response?.data?.error || "Registration Failed");
      }
    }
  };

  // image preview
  useEffect(() => {
    if (image) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);


  // scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
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
                  <h2 className="text-center mb-2" style={headingStyle}>Sign Up</h2>

                  {/* Profile Preview */}
                  <div className="text-center mb-3">
                    <img src={preview ? preview : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" className="rounded-circle border" style={imgStyle} />
                  </div>

                  <form>
                    {/* First Name */}
                    <div className="mb-3">
                      <input type="text" name="firstname" value={userDetail.firstname} onChange={handleChange} className="form-control py-1" placeholder="Enter First Name" />
                    </div>

                    {/* Last Name */}
                    <div className="mb-3">
                      <input type="text" name="lastname" value={userDetail.lastname} onChange={handleChange} className="form-control py-1" placeholder="Enter Last Name" />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <input type="email" name="email" value={userDetail.email} onChange={handleChange} className="form-control py-1" placeholder="Enter Email" />
                    </div>

                    {/* File Upload */}
                    <div className="mb-3">
                      <input type="file" name="userprofile" onChange={setProfile} className="form-control py-1" />
                    </div>

                    {/* Password */}
                    <div className="mb-3 position-relative">
                      <input type={passShow ? "text" : "password"} name="password" value={userDetail.password} onChange={handleChange} className="form-control py-1" placeholder="Enter Password" />
                      <span onClick={() => setPassShow(!passShow)} style={styleObj}>{passShow ? "Hide" : "Show"}</span>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3 position-relative">
                      <input type={cPassShow ? "text" : "password"} name="confirmpassword" value={userDetail.confirmpassword} onChange={handleChange} className="form-control py-1" placeholder="Confirm Password" />
                      <span onClick={() => setCPassShow(!cPassShow)} style={styleObj}>{cPassShow ? "Hide" : "Show"}</span>
                    </div>

                    {/* Button */}
                    <div className="d-grid mb-2">
                      <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Sign Up</button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center mb-3">Already have an account?{" "}
                      <NavLink to="/" className="text-decoration-none">
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