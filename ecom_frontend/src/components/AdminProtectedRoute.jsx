import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../helper";

const AdminProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);


  useEffect(() => {
    const verifyAdmin = async () => {
      const admintoken = localStorage.getItem("admintoken");
      // console.log("admin token in localstorage is", admintoken)

      const admin = JSON.parse(localStorage.getItem("admin"));
      const user = JSON.parse(localStorage.getItem("user"));

      // ❌ IF USER LOGIN EXISTS BLOCK ADMIN ACCESS
      if (user?.role === "user") {
        setIsAuth(false);
        return;
      }

      // ❌ NO ADMIN LOGIN
      if (!admintoken || admin?.role !== "admin") {
        setIsAuth(false);
        return;
      }

      const lastVerified = localStorage.getItem("admin_auth_verified_time");
      // console.log("admin_auth_verified_time in localstorage is", lastVerified)


      try {
        await axios.get(`${BASE_URL}/api/admin/adminverify`, { headers: { Authorization: `Bearer ${admintoken}`, }, });
        setIsAuth(true);
      } catch (error) {
        // console.log("Admin Token Invalid:", error);
        localStorage.removeItem("admintoken");
        localStorage.removeItem("admin");
        setIsAuth(false);
      }
    };
    verifyAdmin();
  }, []);



  // LOADING

  if (isAuth === null) {
    return (<h3 style={{ textAlign: "center" }}>Checking Admin Authentication...</h3>);
  }

  return isAuth ? children : <Navigate to="/admin/login" replace />;
};


export default AdminProtectedRoute;

