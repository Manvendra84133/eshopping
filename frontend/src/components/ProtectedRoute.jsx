import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const lastVerified = Number(localStorage.getItem("auth_verified_time"));

      // ❌ no token → force verify (fail)
      if (!token) {
        setIsAuth(false);
        return;
      }

      // ✅ check cached verification (31 days)
      const now = new Date().getTime();
      const limit = 31 * 24 * 60 * 60 * 1000; // 31 days

      if (lastVerified && now - lastVerified < limit) {
        console.log("Using cached auth ✅");
        setIsAuth(true);
        return;
      }

      try {
        await axios.get("http://localhost:4009/api/users/userverify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ store verification time
        localStorage.setItem("auth_verified_time", now);

        setIsAuth(true);

      } catch (error) {
        console.log("Token invalid:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth_verified_time");

        setIsAuth(false);
      }
    };

    verifyUser();
  }, [localStorage.getItem("token")]);

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

export default ProtectedRoute;