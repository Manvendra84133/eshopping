import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { BASE_URL } from "../helper";

const UserProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);


  useEffect(() => {
    const verifyUser = async () => {
      const admin = JSON.parse(localStorage.getItem("admin"));
      const token = localStorage.getItem("usertoken");
      const lastVerified = localStorage.getItem("auth_verified_time");

      // console.log("token in localstorage is", token)
      // console.log("lastVerified in localstorage is", lastVerified)


      if (admin?.role === "admin") {
        setIsAuth(false);
        return;
      }

      // ❌ no token → force verify (fail)
      if (!token) {
        setIsAuth(false);
        return;
      }

      // ✅ check cached verification (31 days)
      const now = new Date().getTime();
      const limit = 31 * 24 * 60 * 60 * 1000; // 31 days

      // console.log("now is", now)
      // console.log("limit is", limit)


      if (lastVerified && now - lastVerified < limit) {
        // console.log("Using cached auth ✅");
        setIsAuth(true);
        return;
      }

      try {
        await axios.get(`${BASE_URL}/api/users/userverify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ store verification time
        localStorage.setItem("auth_verified_time", now);

        setIsAuth(true);

      } catch (error) {
        // console.log("Token invalid:", error);

        localStorage.removeItem("usertoken");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_verified_time");

        setIsAuth(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuth === null) {
    return <h3 style={{ textAlign: "center" }}>Checking Authentication...</h3>;
  }

  return isAuth ? (
    <>
      <Navbar user={JSON.parse(localStorage.getItem("user"))} />
      {children}
    </>
  ) : <Navigate to="/" replace />;
};

export default UserProtectedRoute;

