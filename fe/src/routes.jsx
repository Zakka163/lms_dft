/* eslint-disable react/prop-types */

import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
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
import Poin from "./pages/master/Poin/Poin.jsx";
import Kelas from "./pages/master/Kelas/Index.jsx";
import Course from "./pages/Course.jsx";
import ClassDetail from "./pages/ClassDetail.jsx";
import Transaksi from "./pages/master/Transaksi.jsx";
import TransaksiDetail from "./pages/master/DetailTransaksi.jsx";
import User from "./pages/master/User.jsx";
const AdminPage = ({ children }) => {
  return (
    <div
      className="d-flex flex-row"
      style={{ backgroundColor: colors.background, height: "100vh" }}
    > <NavbarAdmin />
      <div
        style={{
          marginLeft: "280px",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};




const HomeLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Untuk merender komponen dalam rute bersarang */}
  </>
);

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page dengan rute bersarang */}
        <Route path="/" element={<HomeLayout />}>
          <Route path="course" element={<Course />} />
          <Route path="course/:id" element={<ClassDetail />} />
        </Route>
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
                  <Route path="master/poin/*" element={<Poin />} /> {/* Rute ke Poin */}
                  <Route path="master/kelas/*" element={<Kelas />} />
                  <Route path="transaksi" element={<Transaksi />} />
                  <Route path="transaksi/:order_id" element={<TransaksiDetail />} />
                  <Route path="daftar-siswa" element={<User />} />
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

// import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
// import NavbarAdmin from "./components/NavbarAdmin.jsx";
// import Jadwal from "./pages/master/Jadwal.jsx";
// import Kategori from "./pages/master/Kategori.jsx";
// import Login from "./pages/Login.jsx";
// import colors from "./helper/colors.js";
// import Navbar from "./components/Navbar.jsx";
// import AuthSucces from "./pages/AuthSucces.jsx";
// import AccessDenied from "./pages/AccesDenied.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import { PrivateRoute } from "./components/PrivateRoute.jsx";
// import Poin from "./pages/master/Poin/Poin.jsx";
// import Kelas from "./pages/master/Kelas/Index.jsx";
// import Course from "./pages/Course.jsx";

// const AdminLayout = () => (
//   <div
//     className="d-flex flex-row"
//     style={{ backgroundColor: colors.background, height: "100vh" }}
//   >
//     <NavbarAdmin />
//     <div style={{ marginLeft: "280px", width: "100%", overflowY: "auto" }}>
//       <Outlet /> {/* Untuk merender komponen dalam rute bersarang */}
//     </div>
//   </div>
// );

// const HomeLayout = () => (
//   <>
//     <Navbar />
//     <Outlet /> {/* Untuk merender komponen dalam rute bersarang */}
//   </>
// );

// const AppRoutes = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />

// {/* Home Page dengan rute bersarang */}
// <Route path="/" element={<HomeLayout />}>
//   <Route path="course" element={<Course />} />
// </Route>

//         {/* Admin Route yang dilindungi dengan PrivateRoute */}
//         <Route
//           path="/admin/*"
//           element={
//             <PrivateRoute requiredRole="admin">
//               <AdminLayout>
//                 <Routes>
//                   <Route path="master/jadwal" element={<Jadwal />} />
//                   <Route path="master/kategori" element={<Kategori />} />
//                   <Route path="master/poin/*" element={<Poin />} /> {/* Rute ke Poin */}
//                   <Route path="master/kelas/*" element={<Kelas />} />
//                 </Routes>
//               </AdminLayout>
//             </PrivateRoute>
//           }
//         />

//         <Route path="/auth-success" element={<AuthSucces />} />
//         <Route path="/access-denied" element={<AccessDenied />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRoutes;
