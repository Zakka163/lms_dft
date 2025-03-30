/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import colors from "../../../helper/colors";
import { config } from "../../../config";
import LoadingSpinner from "../../../components/Loading";

const KategoriForm = ({ isEditing,formData, setFormData }) => {
   
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) setToken(savedToken);
        // console.log("🚀 ~ KategoriForm ~ formData:", formData)
        let data = []
       
        for (let i = 0; i < formData.categories.length; i++) {
            data.push({
                id: formData.categories[i].kategori_id || formData.categories[i].id,
                name: formData.categories[i].nama_kategori || formData.categories[i].name,
                sub_kategori_id: formData.categories[i].sub_kategori_id,
                subcategory:  formData.categories[i].nama_sub_kategori || formData.categories[i].subcategory,
            })
        }
        // console.log("🚀 ~ useEffect ~ data:", data)
        setSelectedCategories(data)
    }, []);

    const serviceGetAllCategory = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${config.APIURL}/kategori/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        serviceGetAllCategory();
    }, [token]);

    const handleAddKategori = () => setIsOverlayVisible(true);

    const handleCloseOverlay = () => {
        setIsOverlayVisible(false);
        setSelectedCategory("");
        setSelectedSubCategory("");
        setSelectedSubCategoryId("");
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedSubCategory("");
        setSelectedSubCategoryId("");
    };

    const handleAddSelectedCategory = () => {
        if (!selectedCategory || !selectedSubCategory || !selectedSubCategoryId) {
            alert("Pilih kategori dan subkategori terlebih dahulu!");
            return;
        }

        const categoryObj = categories.find(cat => cat.nama_kategori === selectedCategory);
        if (!categoryObj) return;

        const newCategory = {
            id: categoryObj.kategori_id,
            name: categoryObj.nama_kategori,
            sub_kategori_id: selectedSubCategoryId,
            subcategory: selectedSubCategory,
        };

        if (!selectedCategories.some(cat => cat.id === newCategory.id && cat.subcategory === newCategory.subcategory)) {
            setSelectedCategories(prev => [...prev, newCategory]);
            setFormData({ ...formData, categories: [...(formData.categories || []), newCategory] });
        } else {
            alert("Kategori sudah ditambahkan sebelumnya!");
        }

        handleCloseOverlay();
    };

    const handleRemoveCategory = (index) => {
        
        setFormData({ ...formData, categories: [] });
        setSelectedCategories(prev => prev.filter((_, i) => i !== index));
        console.log(selectedCategories);
        setFormData({ ...formData, categories: selectedCategories.filter((_, i) => i !== index) });
    };

    const availableCategories = categories.filter(
        category => !selectedCategories.some(selected => selected.id === category.kategori_id)
    );

    const selectedCategoryObj = categories.find(cat => cat.nama_kategori === selectedCategory);
    const availableSubCategories = selectedCategoryObj
        ? selectedCategoryObj.sub_kategoris.filter(sub =>
            !selectedCategories.some(selected => selected.name === selectedCategory && selected.subcategory === sub.nama_sub_kategori)
        )
        : [];

    return (
        <div >
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
                            {hoveredIndex === index && isEditing && (
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
                                    disabled={!isEditing}
                                    onClick={() => handleRemoveCategory(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isEditing&&<button className="btn btn-danger mt-2"
             disabled={!isEditing}
                style={{ borderRadius: "8px", width: "max-content", backgroundColor: colors.primary, fontWeight: "bold" }}
                onClick={handleAddKategori}>
                Add
            </button>}

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
                                <select
                                    className="form-select border-danger mb-3"
                                    value={selectedSubCategoryId}
                                    onChange={(e) => {
                                        const selectedValue = parseInt(e.target.value, 10);
                                        setSelectedSubCategoryId(selectedValue);
                                        const selectedSub = availableSubCategories.find(sub => sub.sub_kategori_id === selectedValue);
                                        setSelectedSubCategory(selectedSub ? selectedSub.nama_sub_kategori : "");
                                    }}
                                >
                                    <option value="">Pilih Subkategori</option>
                                    {availableSubCategories.map((subCategory, index) => (
                                        <option key={index} value={subCategory.sub_kategori_id}>
                                            {subCategory.nama_sub_kategori}
                                        </option>
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
