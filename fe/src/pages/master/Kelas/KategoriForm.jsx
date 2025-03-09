import { useState, useEffect } from "react";
import axios from "axios";
import colors from "../../../helper/colors";
import { config } from "../../../config";
import LoadingSpinner from "../../../components/Loading";


const KategoriForm = () => {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = localStorage.getItem("token");
    const serviceGettAllCategory = async () => {
        try {
            const response = await axios.get(`${config.APIURL}/kategori/list`, {
                headers: {

                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("🚀 ~ serviceGettAllCategory ~ response:", response.data.data)
            setCategories(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            // setLoading(false);
        }
    }
    useEffect(() => {
        serviceGettAllCategory()
    }, []);

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

        const newCategory = {
            name: selectedCategory,
            subcategory: selectedSubCategory
        };

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

    const availableCategories = categories.filter(
        (category) => !selectedCategories.some((selected) => selected.name === category.nama_kategori)
    );

    const availableSubCategories = selectedCategory
        ? categories.find((category) => category.nama_kategori === selectedCategory)?.sub_kategoris.filter(
            (subCategory) =>
                !selectedCategories.some(
                    (selected) => selected.name === selectedCategory && selected.subcategory === subCategory.nama_sub_kategori
                )
        ) || []
        : [];

    return (
        <div className="shadow-sm card p-3 position-relative" style={{ width: "100%", minHeight: "300px", borderRadius: "10px", marginBottom: "10px" }}>
            <label className="form-label fw-bold">Kategori *</label>

            {loading ? (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50">
                    <LoadingSpinner />
                </div>
            ) : (
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
            )}

            <button className="btn btn-danger mt-2"
                style={{ borderRadius: "8px", width: "max-content", backgroundColor: colors.primary, fontWeight: "bold" }}
                onClick={handleAddKategori}>
                Add
            </button>

            {isOverlayVisible && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 10 }}></div>

                    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 11 }}>
                        <div className="shadow-sm card p-3" style={{ width: "300px", height: "200px", borderRadius: "10px", backgroundColor: "white" }}>
                            <select className="form-select border-danger mb-3" value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">Pilih Kategori</option>
                                {availableCategories.map((category, index) => (
                                    <option key={index} value={category.nama_kategori}>{category.nama_kategori}</option>
                                ))}
                            </select>

                            {selectedCategory && availableSubCategories.length > 0 && (
                                <select className="form-select border-danger mb-3" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
                                    <option value="">Pilih Subkategori</option>
                                    {availableSubCategories.map((subCategory, index) => (
                                        <option key={index} value={subCategory.nama_sub_kategori}>{subCategory.nama_sub_kategori}</option>
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
