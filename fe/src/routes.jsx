import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NavbarAdmin from "./components/NavbarAdmin.jsx";
import Jadwal from "./pages/master/jadwal.jsx";
import Kategori from "./pages/master/Kategori.jsx";
import Login from "./pages/Login.jsx";
import colors from "./helper/colors.js";

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-row" style={{ backgroundColor: colors.background }}>
      <NavbarAdmin />
      {children}
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/master/jadwal" element={<Jadwal />} />
                <Route path="/master/kategori" element={<Kategori />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
