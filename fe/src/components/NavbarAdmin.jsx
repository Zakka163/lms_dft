import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../helper/colors";

const AdminLayout = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (ismaster, item, ismove) => {
    setIsSelected(item);
    if (ismove) {
      const formattedUrl = item.toLowerCase().replace(/\s+/g, "-");
      navigate(ismaster ? `/master/${formattedUrl}` : `/${formattedUrl}`);
    }
  };

  return (
    <nav
      className="vh-100 d-flex flex-column align-items-start"
      style={{
        margin: 0,
        padding: "10px",
        height:"100%",
        width: isHovered ? "280px" : "50px",
        backgroundColor: colors.primary,
        transition: "width 0.3s ease",
        overflow: "hidden",
        color: "white",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // setIsSelected(null);
        setIsHovered(true);
      }}
    >
      <div style={{ marginBottom: "40px" }}></div>

      <ul className="nav flex-column w-100">
        {/* Dashboard */}
        <li className="nav-item">
          <a
            className={`nav-link ${
              isSelected === "Dashboard"
                ? "text-red-500 bg-white rounded"
                : "text-white"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Dashboard", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Dashboard", false)}
            style={{
              textDecoration: "none",
              color: isSelected === "Dashboard" ? "red" : "white",
            }}
          >
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none" }}
            >
              Dashboard
            </span>
          </a>
        </li>

        {/* Master Dropdown */}
        <li className="nav-item">
          <a
            className="nav-link text-white d-flex justify-content-between align-items-center"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            style={{ cursor: "pointer" }}
          >
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none" }}
            >
              Master
            </span>
            <span style={{ display: isHovered ? "inline" : "none" }}>
              {isDropdownOpen ? "▲" : "▼"}
            </span>
          </a>

          {isDropdownOpen && isHovered && (
            <ul className="nav flex-column ps-3">
              {/* Jadwal */}
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isSelected === "Jadwal"
                      ? "text-red-500 bg-white rounded"
                      : "text-white"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Jadwal", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Jadwal", false)}
                  style={{
                    textDecoration: "none",
                    color: isSelected === "Jadwal" ? "red" : "white",
                  }}
                >
                  Jadwal
                </a>
              </li>

              {/* Poin */}
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isSelected === "Poin"
                      ? "text-red-500 bg-white rounded"
                      : "text-white"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Poin", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Poin", false)}
                  style={{
                    textDecoration: "none",
                    color: isSelected === "Poin" ? "red" : "white",
                  }}
                >
                  Poin
                </a>
              </li>

              {/* Kategori */}
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isSelected === "Kategori"
                      ? "text-red-500 bg-white rounded"
                      : "text-white"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Kategori", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Kategori", false)}
                  style={{
                    textDecoration: "none",
                    color: isSelected === "Kategori" ? "red" : "white",
                  }}
                >
                  Kategori
                </a>
              </li>

              {/* Kelas */}
              <li className="nav-item">
                <a
                  className={`nav-link ${
                    isSelected === "Kelas"
                      ? "text-red-500 bg-white rounded"
                      : "text-white"
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Kelas", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Kelas", false)}
                  style={{
                    textDecoration: "none",
                    color: isSelected === "Kelas" ? "red" : "white",
                  }}
                >
                  Kelas
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Menu Lainnya */}
        <li className="nav-item">
          <a
            className={`nav-link ${
              isSelected === "Daftar Siswa"
                ? "text-red-500 bg-white rounded"
                : "text-white"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Daftar Siswa", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Daftar Siswa", false)}
            style={{
              textDecoration: "none",
              color: isSelected === "Daftar Siswa" ? "red" : "white",
            }}
          >
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none" }}
            >
              Daftar Siswa
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${
              isSelected === "Jadwal Pertemuan"
                ? "text-red-500 bg-white rounded"
                : "text-white"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Jadwal Pertemuan", true);
            }}
            onMouseEnter={() =>
              handleItemClick(false, "Jadwal Pertemuan", false)
            }
            style={{
              textDecoration: "none",
              color: isSelected === "Jadwal Pertemuan" ? "red" : "white",
            }}
          >
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none" }}
            >
              Jadwal Pertemuan
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${
              isSelected === "Transaksi"
                ? "text-red-500 bg-white rounded"
                : "text-white"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Transaksi", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Transaksi", false)}
            style={{
              textDecoration: "none",
              color: isSelected === "Transaksi" ? "red" : "white",
            }}
          >
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none" }}
            >
              Transaksi
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default AdminLayout;
