// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Halaman Tidak Ditemukan</h1>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
          Go to Homepage
        </Link>
    </div>
  );
};

export default NotFound;
