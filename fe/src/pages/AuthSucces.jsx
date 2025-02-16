import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import colors from "../helper/colors.js";
import { jwtDecode } from "jwt-decode";

const AuthSucces = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token');
      localStorage.setItem("token", token);
    }
    if (!token) {
      navigate("/login");
      return;
    }

    const userRole = jwtDecode(token).role;

    const timer = setTimeout(() => {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: colors.background,
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxWidth: "300px",
        }}
      >
        <FaCheckCircle
          style={{ color: "green", fontSize: "50px", marginBottom: "20px" }}
        />
        <h3>Success</h3>
        <p>Your authentication was successful.</p>
        <p>You will be redirected to the dashboard shortly.</p>
      </div>
    </div>
  );
};

export default AuthSucces;
