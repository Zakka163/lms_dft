import colors from "../helper/colors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const handleClick = (i) => {
    navigate(`/${i}`);
    // console.log(i);
  };
  const token = localStorage.getItem("token");
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm bg-white border-bottom fixed-top"
      style={{ height: "50px" }}
    >
      <div className="container-fluid px-4 d-flex align-items-center">
        <a className="navbar-brand text-danger fw-bold" href="#">
          logo
        </a>

        {/* Menu Tengah */}
        <div className="d-flex flex-grow-1 justify-content-center">
          <ul className="navbar-nav d-flex flex-row gap-5">
            {["Home", "Course", "Contact"].map((item, index) => (
              <li className="nav-item" key={index}>
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: activeIndex === index ? "white" : colors.primary,
                    backgroundColor:
                      activeIndex === index ? colors.primary : "transparent",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    transition: "all 0.3s ease-in-out",
                    fontWeight: "600",
                  }}
                  onClick={(e) => {
                    handleClick(item);
                    setActiveIndex(index);
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Search dan Button */}
        <div className="d-flex align-items-center gap-3">
          <form className="d-flex position-relative">
            <input
              className="form-control rounded-pill ps-5"
              type="search"
              placeholder="Search anything..."
              aria-label="Search"
              style={{
                height: "28px",
                width: "280px",
                border: `1.5px solid ${colors.primary}`,
              }}
            />
            <span className="position-absolute start-0 ms-3 text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.615.656a5 5 0 1 1 3.536-1.464A5 5 0 0 1 6.127 11z" />
              </svg>
            </span>
          </form>

          {/* Tombol Masuk & Daftar */}

          {token ? (
            <>
              <button
                className="btn d-flex align-items-center rounded-pill text-white"
                style={{ height: "28px", backgroundColor: colors.primary }}
                onClick={() => handleClick("my-courses")}
              >
                Kursus Saya
              </button>

              {/* Notifikasi (tombol baru) */}
              <button
                className="btn d-flex align-items-center rounded-pill text-white"
                style={{ height: "28px", backgroundColor: colors.primary }}
                onClick={() => handleClick("notifications")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.25 14a1.25 1.25 0 0 1 2.5 0h-2.5zm-.682-3.013a1 1 0 0 0 .682.877v-.003l.301.125a4.35 4.35 0 0 0 1.071.13h.98a4.35 4.35 0 0 0 1.07-.13l.301-.125v.003a1 1 0 0 0 .682-.877A5.938 5.938 0 0 0 10 6c0-2.24-1.57-4.116-3.742-4.648a1.004 1.004 0 0 0-.316-.352A5.935 5.935 0 0 0 8 1a5.935 5.935 0 0 0-1.942.352 1.003 1.003 0 0 0-.316.352C4.57 1.884 3 3.76 3 6a5.938 5.938 0 0 0 .682 4.987z" />
                </svg>
              </button>

              {/* Gambar Profil */}
              <img
                src="https://www.w3schools.com/w3images/avatar2.png" // Ganti dengan gambar profil pengguna yang sesuai
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => handleClick("profile")}
              />

            </>
          ) : (<>
            <button
              className="btn d-flex align-items-center rounded-pill text-white px-3"
              style={{ height: "28px", backgroundColor: colors.primary }}
              onClick={(e) => {
                e.preventDefault();
                handleClick("register");
              }}
            >
              Daftar
            </button>
            <button
              className="btn d-flex align-items-center rounded-pill text-white px-3"
              style={{ height: "28px", backgroundColor: colors.primary }}
              onClick={(e) => {
                e.preventDefault();
                handleClick("login");
              }}
            >
              Masuk
            </button></>)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
