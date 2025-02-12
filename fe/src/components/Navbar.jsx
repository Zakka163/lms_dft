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
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm bg-white border-bottom fixed-top"
      style={{ height: "62px" }}
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
                height: "35px",
                width: "250px",
                border: `1.5px solid ${colors.primary}`,
              }}
            />
            <span className="position-absolute start-0 ms-3 mt-1 text-muted">
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
          <button
            className="btn rounded-pill text-white px-3"
            style={{ height: "35px", backgroundColor: colors.primary }}
            onClick={(e) => {
              e.preventDefault();
              handleClick("register");
            }}
          >
            Daftar
          </button>
          <button
            className="btn rounded-pill text-white px-3"
            style={{ height: "35px", backgroundColor: colors.primary }}
            onClick={(e) => {
              e.preventDefault();
              handleClick("login");
            }}
          >
            Masuk
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
