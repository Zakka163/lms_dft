import { useState } from "react";
import colors from "../../helper/colors";

function Kategori() {
  const [categories, setCategories] = useState([
    { name: "Elektronik", subcategories: ["Laptop", "Handphone", "TV"] },
    { name: "Pakaian", subcategories: ["Kaos", "Jaket", "Celana"] },
    { name: "Makanan", subcategories: ["Camilan", "Makanan Berat", "Minuman"] },
  ]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [isAddingSub, setIsAddingSub] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { name: newCategory, subcategories: [] }]);
      setNewCategory("");
    }
  };

  const addSubCategory = (categoryIndex) => {
    if (newSubCategory.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].subcategories.push(newSubCategory);
      setCategories(updatedCategories);
      setNewSubCategory("");
      setIsAddingSub(null);
    }
  };

  const editSubCategory = (categoryIndex, subIndex, newSubName) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subIndex] = newSubName;
    setCategories(updatedCategories);
    setEditingSub(null);
  };

  const deleteSubCategory = () => {
    if (deleteConfirm) {
      const { categoryIndex, subIndex } = deleteConfirm;
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].subcategories.splice(subIndex, 1);
      setCategories(updatedCategories);
      setDeleteConfirm(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.some((sub) => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <div className="card shadow-lg p-4" style={{
          width: "95%",
          height: "95%",
          borderRadius: "15px",
          padding: "20px",
        }}>
        <h4 className="text-center text-primary">Manajemen Kategori</h4>

        {/* 🔍 Search Bar */}
        <input
          type="text"
          className="form-control mt-3"
          placeholder="Cari kategori atau sub-kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* ➕ Tambah Kategori */}
        <div className="d-flex mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nama kategori baru"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-success mx-2" onClick={addCategory}>
            Tambah
          </button>
        </div>

        {/* 📂 List Kategori */}
        <div className="mt-4">
          {filteredCategories.length === 0 ? (
            <p className="text-muted text-center">Tidak ada kategori</p>
          ) : (
            filteredCategories.map((category, index) => (
              <div key={index} className="mb-3">
                {/* Kategori Header */}
                <div
                  className="d-flex justify-content-between align-items-center p-3 bg-light rounded shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleCategory(category.name)}
                >
                  <span className="fw-bold">{category.name}</span>
                  <div>
                    <button className="btn btn-sm btn-info mx-1">
                      {expandedCategory === category.name ? "Tutup" : "Detail"}
                    </button>
                    <button className="btn btn-sm btn-success mx-1" onClick={() => setIsAddingSub(index)}>
                      + Sub
                    </button>
                  </div>
                </div>

                {/* Sub-Kategori (Dropdown) */}
                {expandedCategory === category.name && (
                  <div className="p-2 mt-2 bg-white rounded shadow-sm">
                    {category.subcategories.length > 0 ? (
                      category.subcategories.map((sub, subIndex) => (
                        <div key={subIndex} className="d-flex justify-content-between align-items-center p-2">
                          {editingSub === `${index}-${subIndex}` ? (
                            <input
                              type="text"
                              value={newSubCategory}
                              onChange={(e) => setNewSubCategory(e.target.value)}
                              className="form-control"
                            />
                          ) : (
                            <span>{sub}</span>
                          )}
                          <div>
                            {editingSub === `${index}-${subIndex}` ? (
                              <button
                                className="btn btn-sm btn-success mx-1"
                                onClick={() => editSubCategory(index, subIndex, newSubCategory)}
                              >
                                Simpan
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-warning mx-1"
                                onClick={() => {
                                  setEditingSub(`${index}-${subIndex}`);
                                  setNewSubCategory(sub);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-danger mx-1"
                              onClick={() => setDeleteConfirm({ categoryIndex: index, subIndex })}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted text-center">Tidak ada sub-kategori</p>
                    )}
                  </div>
                )}

                {/* ➕ Form Tambah Sub-Kategori */}
                {isAddingSub === index && (
                  <div className="d-flex mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama sub-kategori"
                      value={newSubCategory}
                      onChange={(e) => setNewSubCategory(e.target.value)}
                    />
                    <button className="btn btn-primary mx-2" onClick={() => addSubCategory(index)}>
                      Tambah
                    </button>
                    <button className="btn btn-secondary" onClick={() => setIsAddingSub(null)}>
                      Batal
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🗑️ Modal Floating Konfirmasi Hapus */}
      {deleteConfirm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="p-4 bg-white rounded shadow-lg text-center">
            <h5>Yakin ingin menghapus sub-kategori?</h5>
            <div className="mt-3">
              <button className="btn btn-danger mx-2" onClick={deleteSubCategory}>
                Hapus
              </button>
              <button className="btn btn-secondary mx-2" onClick={() => setDeleteConfirm(null)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Kategori;
