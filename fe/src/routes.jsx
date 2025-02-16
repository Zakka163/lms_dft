import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import NavbarAdmin from "./components/NavbarAdmin.jsx";
import Jadwal from "./pages/master/jadwal.jsx";
import Kategori from "./pages/master/Kategori.jsx";
import Login from "./pages/Login.jsx";
import colors from "./helper/colors.js";
import Navbar from "./components/Navbar.jsx";
import AuthSucces from "./pages/AuthSucces.jsx";
import AccessDenied from "./pages/AccesDenied.jsx";
import NotFound from "./pages/NotFound.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";

const AdminPage = ({ children }) => {
  return (
    <div className="d-flex flex-row" style={{ backgroundColor: colors.background }}>
      <NavbarAdmin />
      {children}
    </div>
  );
};
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
                </Routes>
              </AdminPage>
            </PrivateRoute>
          }
        />
        xx
        <Route path="/auth-success" element={<AuthSucces />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
