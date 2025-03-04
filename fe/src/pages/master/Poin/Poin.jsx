import { Routes, Route } from "react-router-dom";
import { PoinList } from "./PoinList.jsx";
import { PoinAdd } from "./PoinAdd.jsx";
import { PoinEdit } from "./PoinEdit.jsx";
const Poin = () => {
  return (
    <Routes>
      <Route path="/" element={<PoinList />} /> {/* Halaman utama poin */}
      <Route path="add" element={<PoinAdd />} /> {/* Halaman tambah poin */}
      <Route path="edit/:id" element={<PoinEdit />} />
    </Routes>
  );
};

export default Poin


