import { Routes, Route } from "react-router-dom";
import { KelasList } from "./KelasList.jsx";
import KelasAdd from "./KelasAdd.jsx";
import KelasDetail from "./KelasDetail.jsx";
// import { PoinAdd } from "./PoinAdd.jsx";
// import { PoinEdit } from "./PoinEdit.jsx";
KelasList
const Kelas = () => {
  return (
    <Routes>
      <Route path="/" element={<KelasList />} /> {/* Halaman utama poin */}
      <Route path="add" element={<KelasAdd />} />
      <Route path="detail/:id" element={<KelasDetail />} />
    </Routes>
  );
};

export default Kelas


