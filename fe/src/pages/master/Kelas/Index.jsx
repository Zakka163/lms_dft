import { Routes, Route } from "react-router-dom";
import { KelasList } from "./KelasList.jsx";
import FormComponent from "./KelasAdd.jsx";
import Tes from "./KelasEdit.jsx";
// import { PoinAdd } from "./PoinAdd.jsx";
// import { PoinEdit } from "./PoinEdit.jsx";
KelasList
const Kelas = () => {
  return (
    <Routes>
      <Route path="/" element={<KelasList />} /> {/* Halaman utama poin */}
      <Route path="add" element={<FormComponent />} />
      <Route path="edit" element={<Tes />} />
    </Routes>
  );
};

export default Kelas


