import { useEffect, useState } from "react";
import colors from "../helper/colors.js";
import BgImage from "../assets/Union.png";
import LogoUser from "../assets/loginPic.png";
import googleLogo from "../assets/google.png";
import "../styles/loginStyle.css";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import { config } from "../config/index.js";
import { ToastContainer } from "react-toastify";
import { errorNotify, successNotify } from "../helper/toast.js";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
const Login = () => {

  const [dataForm, setDataForm] = useState({ email: "", password: "" });
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      window.location.href = `${config.APIURL}/auth/google`;
    } catch (error) {
      console.error("Error during Google login redirect:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form Data Submitted:", dataForm);
    try {
      const response = await axios.post(`${config.APIURL}/auth/login`, dataForm);
      console.log("Login Success:", response.data);
      successNotify("Berhasil Login")
      localStorage.setItem("token", response.data.token);
      navigate("/auth-success")
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code == "ERR_NETWORK") {
        errorNotify("ERR_NETWORK")
      } else {
        errorNotify("Password atau Email salah")
      }

    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/")
    }
  }, [])



  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div
        className="d-flex justify-content-center vh-100 rounded"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="card shadow-lg border-0 overflow-hidden position-relative bg-white d-flex flex-row"
          style={{
            width: "908px",
            height: "531px",
            borderRadius: "100px 10px 100px 10px",
            marginTop: "130px",
          }}
        >
          {/* Kiri */}
          <div
            className="g-0 d-flex flex-column align-items-center"
            style={{
              width: "705px",
              height: "531px",
              zIndex: 1,
            }}
          >
            <div className="d-flex flex-column align-items-center mt-4">
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={LogoUser}
                  alt="Logo"
                  style={{
                    width: "120px",
                    marginBottom: "20px",
                    marginLeft: "75px",
                  }}
                />
              </div>
              <form
                className=""
                style={{ width: "350px", marginLeft: "80px" }}
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Masukkan Email"
                    value={dataForm.email}
                    onChange={handleChange}
                    style={{
                      boxShadow: `0px 0px 5px ${colors.primary}`,
                      borderColor: colors.primary,
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Masukkan Password"
                    value={dataForm.password}
                    onChange={handleChange}
                    style={{
                      boxShadow: `0px 0px 5px ${colors.primary}`,
                      borderColor: colors.primary,
                    }}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <button
                    type="submit"
                    className="btn text-white rounded-pill d-flex justify-content-center align-items-center"
                    style={{
                      width: "100px",
                      height: "27px",
                      backgroundColor: colors.primary,
                    }}
                    disabled={loading}
                  >
                    Masuk
                  </button>
                </div>
              </form>
              <div
                className="d-flex flex-column  align-items-center"
                style={{ marginLeft: "75px" }}
              >
                <div className="mt-3">
                  <div>
                    Anda belum punya akun?{" "}
                    <a href="#" className="text-danger">
                      Daftar
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center mt-2 w-100">
                  <hr
                    className="flex-grow-1 border-secondary mx-2"
                    style={{ height: "1px" }}
                  />
                  <h6 className="fs-6 text-muted mb-0">Or With</h6>
                  <hr
                    className="flex-grow-1 border-secondary mx-2"
                    style={{ height: "1px" }}
                  />
                </div>

                <div className="d-flex gap-3 mt-2">
                  <img
                    src={googleLogo}
                    alt="Google"
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    onClick={handleGoogleLogin}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kanan */}
          <div
            className="flex-grow-1 d-flex align-items-center"
            style={{
              width: "100%",
              height: "531px",
              backgroundImage: `url(${BgImage})`,
              backgroundSize: "cover",
            }}
          >
            <div
              className="text-start"
              style={{ marginLeft: "150px", textAlign: "left" }}
            >
              <h1 className="text-white">Hallo,</h1>
              <h1 className="text-white fw-bold">Selamat Datang!</h1>
              <h6 className="text-white">Silahkan masuk ke akun anda</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
