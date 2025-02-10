import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NavbarAdmin from "./components/NavbarAdmin.jsx";
import Jadwal from "./pages/master/jadwal.jsx";
import Kategori from "./pages/master/Kategori.jsx";
// import Home from './pages/Home';
// import Products from './pages/Products';
// import Profile from './pages/Profile';
// import Navbar from './components/Navbar';

const AppRoutes = () => {
  return (
    <Router>
      <div className="d-flex flex-row">
        <NavbarAdmin />
        {/* <Navbar /> */}
        <Routes>
          <Route path="/master/jadwal" element={<Jadwal />} />
          <Route path="/master/kategori" element={<Kategori />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
