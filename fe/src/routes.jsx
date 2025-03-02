/* eslint-disable react/prop-types */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarAdmin from "./components/NavbarAdmin.jsx";
import Jadwal from "./pages/master/Jadwal.jsx";
import Kategori from "./pages/master/Kategori.jsx";
import Login from "./pages/Login.jsx";
import colors from "./helper/colors.js";
import Navbar from "./components/Navbar.jsx";
import AuthSucces from "./pages/AuthSucces.jsx";
import AccessDenied from "./pages/AccesDenied.jsx";
import NotFound from "./pages/NotFound.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import Poin from "./pages/master/Poin.jsx";

const AdminPage = ({ children }) => {
  return (
    <div className="d-flex flex-row" style={{ backgroundColor: colors.background }}>
      <NavbarAdmin />
      {children}
    </div>
  );
};


// eslint-disable-next-line no-unused-vars
const HomePage = ({ children }) => {
  return (
    <>
      <Navbar />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        {/* Admin Route yang dilindungi dengan PrivateRoute */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminPage>
                <Routes>
                  <Route path="master/jadwal" element={<Jadwal />} />
                  <Route path="master/kategori" element={<Kategori />} />
                  <Route path="master/poin" element={<Poin />} />
                </Routes>
              </AdminPage>
            </PrivateRoute>
          }
        />
        <Route path="/auth-success" element={<AuthSucces />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
