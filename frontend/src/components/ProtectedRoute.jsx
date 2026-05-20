import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const lastVerified = Number(localStorage.getItem("auth_verified_time"));

      if (!token) {
        setIsAuth(false);
        return;
      }

      const now = new Date().getTime();
      const limit = 31 * 24 * 60 * 60 * 1000;

      if (lastVerified && now - lastVerified < limit) {
        console.log("Using cached auth ✅");
        setIsAuth(true);
        return;
      }

      try {
        await axios.get(`${BASE_URL}/api/users/userverify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;