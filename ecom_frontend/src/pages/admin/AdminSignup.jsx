import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../helper";


const AdminSignup = () => {
  const navigate = useNavigate();
  const [passShow, setPassShow] = useState(false);
  const [cPassShow, setCPassShow] = useState(false);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const [adminDetail, setAdminDetail] =
    useState({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: ""
    });

  const styleObj = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0d6efd"
  };


  const imgStyle = {
    width: "60px",
    height: "60px",
    objectFit: "cover"
  };

  const headingStyle = {
    color: "navyBlue"
  };


  // IMAGE SET
  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };


  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetail({ ...adminDetail, [name]: value });
  };


  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, email, password, confirmpassword } = adminDetail;


    // VALIDATIONS

    if (firstname === "") {
      toast.error("First Name is Required !");
    } else if (lastname === "") {
      toast.error("Last Name is Required !");
    } else if (email === "") {
      toast.error("Email is Required !");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !");
    } else if (!image) {
      toast.error("Admin Profile Required !");
    } else if (password === "") {
      toast.error("Password is Required !");
    } else if (confirmpassword === "") {
      toast.error("Confirm Password Required !");
    } else if (
      password !== confirmpassword
    ) {
      toast.error("Passwords do not match !");
    } else {
      try {
        const formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("lastname", lastname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmpassword", confirmpassword);
        formData.append("adminprofile", image);

        // console.log("form data have", formData)
        // console.log([...formData.entries()]);

        const res = await axios.post(`${BASE_URL}/api/admin/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        toast.success(res.data.message || "Admin Registered Successfully 🎉");

        setAdminDetail({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmpassword: ""
        });

        setImage("");
        setPreview("");

        navigate("/admin/login");
      } catch (error) {
        // console.log(error);
        toast.error(error.response?.data?.error || "Registration Failed");
      }
    }
  };


  // IMAGE PREVIEW
  useEffect(() => {
    if (image) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);


  // SCROLL TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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
      <section className="d-flex align-items-center bg-light pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body px-3">
                  <h2 className="text-center mb-2" style={headingStyle}>Admin Sign Up</h2>

                  {/* PROFILE PREVIEW */}
                  <div className="text-center mb-3">
                    <img src={preview ? preview : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" className="rounded-circle border" style={imgStyle} />
                  </div>

                  <form>

                    {/* FIRST NAME */}
                    <div className="mb-3">
                      <input type="text" name="firstname" value={adminDetail.firstname} onChange={handleChange} className="form-control py-1" placeholder="Enter First Name" />
                    </div>


                    {/* LAST NAME */}
                    <div className="mb-3">
                      <input type="text" name="lastname" value={adminDetail.lastname} onChange={handleChange} className="form-control py-1" placeholder="Enter Last Name" />
                    </div>


                    {/* EMAIL */}
                    <div className="mb-3">
                      <input type="email" name="email" value={adminDetail.email} onChange={handleChange} className="form-control py-1" placeholder="Enter Email" />
                    </div>


                    {/* FILE */}
                    <div className="mb-3">
                      <input type="file" name="adminprofile" onChange={setProfile} className="form-control py-1" />
                    </div>


                    {/* PASSWORD */}
                    <div className="mb-3 position-relative">
                      <input type={passShow ? "text" : "password"} name="password" value={adminDetail.password} onChange={handleChange} className="form-control py-1" placeholder="Enter Password" />
                      <span onClick={() => setPassShow(!passShow)} style={styleObj}>
                        {passShow ? "Hide" : "Show"}
                      </span>
                    </div>


                    {/* CONFIRM PASSWORD */}
                    <div className="mb-3 position-relative">
                      <input type={cPassShow ? "text" : "password"} name="confirmpassword" value={adminDetail.confirmpassword} onChange={handleChange} className="form-control py-1" placeholder="Confirm Password" />
                      <span onClick={() => setCPassShow(!cPassShow)} style={styleObj}>
                        {cPassShow ? "Hide" : "Show"}
                      </span>
                    </div>


                    {/* BUTTON */}
                    <div className="d-grid mb-2">
                      <button className="btn btn-dark btn-sm" onClick={handleSubmit}>
                        Admin Sign Up
                      </button>
                    </div>


                    {/* LOGIN LINK */}

                    <p className="text-center mb-3">
                      Already have an admin account?{" "}

                      <NavLink to="/admin/login" className="text-decoration-none">
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

export default AdminSignup;