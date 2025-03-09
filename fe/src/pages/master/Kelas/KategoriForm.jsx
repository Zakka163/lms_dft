import React, { useState } from "react";
import colors from "../../../helper/colors";

const KategoriForm = () => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [categories, setCategories] = useState([
        { name: "Technology", subcategories: ["Web Development", "Mobile Development", "AI"] },
        { name: "Design", subcategories: ["Graphic Design", "UI/UX Design", "Animation"] },
        { name: "Marketing", subcategories: ["SEO", "Content Marketing", "Social Media"] },
    ]);
    const [selectedCategories, setSelectedCategories] = useState([]); // Menyimpan kategori yang sudah dipilih

    const handleAddKategori = () => {
        setIsOverlayVisible(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayVisible(false);
        setSelectedCategory("");
        setSelectedSubCategory("");
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubCategory("");
    };

    const handleAddSelectedCategory = () => {
        if (!selectedCategory || !selectedSubCategory) {
            alert("Pilih kategori dan subkategori terlebih dahulu!");
            return;
        }

        const newCategory = { name: selectedCategory, subcategory: selectedSubCategory };

        // Cek apakah kategori sudah ada dalam daftar yang dipilih
        if (!selectedCategories.some((cat) => cat.name === newCategory.name && cat.subcategory === newCategory.subcategory)) {
            setSelectedCategories((prev) => [...prev, newCategory]);
        } else {
            alert("Kategori sudah ditambahkan sebelumnya!");
        }

        handleCloseOverlay();
    };

    const handleRemoveCategory = (index) => {
        setSelectedCategories(selectedCategories.filter((_, i) => i !== index));
    };

    // Filter kategori yang sudah dipilih agar tidak muncul dalam dropdown
    const availableCategories = categories.filter(
        (category) => !selectedCategories.some((selected) => selected.name === category.name)
    );

    // Filter subkategori yang sudah dipilih agar tidak muncul dalam dropdown
    const availableSubCategories = selectedCategory
        ? categories
              .find((category) => category.name === selectedCategory)
              ?.subcategories.filter(
                  (subCategory) =>
                      !selectedCategories.some(
                          (selected) => selected.name === selectedCategory && selected.subcategory === subCategory
                      )
              ) || []
        : [];

    return (
        <div className="shadow-sm card p-3 position-relative" style={{ width: "100%", minHeight: "300px", borderRadius: "10px", marginBottom: "10px" }}>
            <label className="form-label fw-bold">Kategori *</label>

            {/* List Kategori yang sudah dipilih */}
            <div className="d-flex flex-wrap gap-2">
                {selectedCategories.map((category, index) => (
                    <div
                        key={index}
                        className="border-danger d-flex flex-row card p-2 shadow-sm text-center position-relative"
                        style={{
                            borderRadius: "10px",
                            width: "max-content",
                            backgroundColor: "#f8f9fa",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {category.name} - {category.subcategory}
                        {hoveredIndex === index && (
                            <button
                                className="btn btn-sm btn-danger position-absolute"
                                style={{
                                    top: "-5px",
                                    right: "-5px",
                                    borderRadius: "50%",
                                    fontSize: "10px",
                                    padding: "2px 6px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onClick={() => handleRemoveCategory(index)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button className="btn btn-danger mt-2" 
                style={{ borderRadius: "8px", width: "max-content", backgroundColor: colors.primary, fontWeight: "bold" }} 
                onClick={handleAddKategori}>
                Add
            </button>

            {/* Overlay */}
            {isOverlayVisible && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 10 }}></div>

                    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 11 }}>
                        <div className="shadow-sm card p-3" style={{ width: "300px", height: "200px", borderRadius: "10px", backgroundColor: "white" }}>
                            <select className="form-select border-danger mb-3" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">Pilih Kategori</option>
                                {availableCategories.map((category, index) => (
                                    <option key={index} value={category.name}>{category.name}</option>
                                ))}
                            </select>

                            {selectedCategory && availableSubCategories.length > 0 && (
                                <select className="form-select border-danger mb-3" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
                                    <option value="">Pilih Subkategori</option>
                                    {availableSubCategories.map((subCategory, index) => (
                                        <option key={index} value={subCategory}>{subCategory}</option>
                                    ))}
                                </select>
                            )}

                            <div className="d-flex justify-content-center gap-2">
                                <button className="btn btn-secondary btn-sm px-4 rounded-pill" onClick={handleCloseOverlay}>Cancel</button>
                                <button className="btn btn-danger btn-sm px-4 rounded-pill" onClick={handleAddSelectedCategory} disabled={!selectedCategory || !selectedSubCategory}>Add</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default KategoriForm;
