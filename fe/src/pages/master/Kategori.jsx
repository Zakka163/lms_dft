import { useEffect, useState } from "react";
import colors from "../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import down from "../../assets/down.png";
import subkategori from "../../assets/subkategori.png";
import pen from "../../assets/pen.png";
import remove from "../../assets/remove.png";
import warning from "../../assets/warning.png";
import { config } from "../../config";
import axios from "axios";
import { errorNotify, successNotify } from "../../helper/toast";

const Kategori = () => {
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSelectedDown, setIsSelectedDown] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubAdding, setIsSubAdding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [idIsOpen, setIdIsOpen] = useState("");
  const [idIsSubEditing, setIdIsSubEditing] = useState("");
  const [IdDelete, setIdDelete] = useState("");


  const transformData = (responseArray) => {
    return responseArray.map(response => ({
      id: response.kategori_id,
      name: `${response.nama_kategori}`,
      subcategories: response.sub_kategoris.map(x => ({
        sub_kategori_id: x.sub_kategori_id,
        name: x.nama_sub_kategori,
      })),
      isEditing: false
    }));
  }



  // service fetch
  let token = localStorage.getItem("token");

  const serviceGetCategory = async () => {
    try {
      const response = await axios.get(
        `${config.APIURL}/kategori/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log("🚀 ~ serviceGetCategory ~ response:", response)
      setCategories([...transformData(response.data.data)])
    } catch (error) {
      console.log("Error fetching schedule", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  }
  const serviceAddCategory = async (data) => {
    try {
      const response = await axios.post(
        `${config.APIURL}/kategori/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      successNotify("Berhasil Tambah Kategori")
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error add category", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };
  const serviceEditCategory = async (id, data) => {
    try {
      const response = await axios.post(
        `${config.APIURL}/kategori/edit/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      successNotify("Berhasil Edit Kategori")
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error add category", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };
  const serviceAddSubCategory = async (data) => {
    console.log("🚀 ~ serviceAddSubCategory ~ data:", data)
    try {
      const response = await axios.post(
        `${config.APIURL}/sub_kategori/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      successNotify("Berhasil Tambah Sub Kategori")
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error add category", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };
  const serviceEditSubCategory = async (id, data) => {
    console.log("🚀 ~ serviceAddSubCategory ~ data:", data)
    try {
      const response = await axios.post(
        `${config.APIURL}/sub_kategori/edit/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      successNotify("Berhasil Edit Sub Kategori")
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error add category", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };
  const serviceDeleteSubCategory = async (id) => {
    try {
      await axios.post(
        `${config.APIURL}/sub_kategori/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      successNotify("Berhasil delete Sub Kategori")
      setRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error add category", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };

  useEffect(() => {
    serviceGetCategory()
  }, [refresh])



  const handleRemove = (id) => {
    setIdDelete(id)
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    serviceDeleteSubCategory(IdDelete)
    setShowConfirm(false);
    setIdDelete("")

  };

  const toggleCategory = (id) => {
    setIsSelectedDown(!isSelectedDown)
    if (id == idIsOpen) {
      setIdIsOpen("")
    } else {
      setIdIsOpen(id)
    }

    // setCategories(
    //   categories.map((category) =>
    //     category.id === id ? { ...category, isOpen: !category.isOpen } : category
    //   )
    // );
  };
  const addCategory = () => {
    if (newCategory.trim() === "") return;
    // setCategories([...categories, { id: Date.now(), name: newCategory, subcategories: [], isOpen: false }]);
    serviceAddCategory({ nama_kategori: newCategory })
    setNewCategory("");
    setIsAdding(false);
  };
  const addSubcategory = (categoryId) => {
    if (newSubCategory.trim() === "") return;
    serviceAddSubCategory({ kategori_id: categoryId, nama_sub_kategori: newSubCategory })
    // setCategories(categories.map((category) =>
    //   category.id === categoryId
    //     ? {
    //       ...category,
    //       subcategories: [...category.subcategories, { id: Date.now(), name: newSubCategory }]
    //     }
    //     : category
    // ));

    setNewSubCategory("");
    setIsSubAdding(false);
  };

  const startEditing = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, isEditing: true } : category
      )
    );
  };

  const handleEditChange = (id, newName) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );
  };

  const stopEditing = (id, newName) => {
    serviceEditCategory(id, { nama_kategori: newName })
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, isEditing: false } : category
      )
    );
  };
  const startSubEditing = (categoryId, subId) => {
    setIdIsSubEditing(subId)
    console.log("🚀 ~ startSubEditing ~ subId:", subId)
    console.log("🚀 ~ startSubEditing ~ categoryId:", categoryId)
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.sub_kategori_id === subId ? { ...sub, isEditing: true } : sub
            ),
          }
          : category
      )
    );
  };

  const handleSubEditChange = (categoryId, subId, newName) => {
    console.log("🚀 ~ handleSubEditChange ~ newName:", newName)
    console.log("🚀 ~ handleSubEditChange ~ subId:", subId)
    console.log("🚀 ~ handleSubEditChange ~ categoryId:", categoryId)
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.sub_kategori_id === subId ? { ...sub, name: newName } : sub
            ),
          }
          : category
      )
    );
  };

  const stopSubEditing = (categoryId, subId, newNameSubCategory) => {
    serviceEditSubCategory(subId, { nama_sub_kategori: newNameSubCategory })
    setIdIsSubEditing("")
    // setCategories(
    //   categories.map((category) =>
    //     category.id === categoryId
    //       ? {
    //         ...category,
    //         subcategories: category.subcategories.map((sub) =>
    //           sub.sub_kategori_id === subId ? { ...sub, isEditing: false } : sub
    //         ),
    //       }
    //       : category
    //   )
    // );
  };






  return (
    <motion.div className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: colors.background }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} >
      <ToastContainer />
      <div className=" bg-white shadow-lg d-flex flex-column" style={{ width: "95%", height: "95%", borderRadius: "15px", padding: "20px", }}>

        <div className="d-flex justify-content-between mb-3">
          <h4></h4>
          <button className="btn btn-danger rounded-pill" style={{ marginRight: "30px", marginTop: "5px", width: "100px", height: "40px", border: `2px solid ${colors.primary}`, color: "white", fontWeight: "bold", backgroundColor: colors.primary, cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease", }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              e.target.style.transform = "scale(1.05)";
              e.target.style.color = colors.primary
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "white"
              e.target.style.backgroundColor = colors.primary;
              e.target.style.boxShadow = "none";
              e.target.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onClick={() => setIsAdding(true)}
          >
            Tambah
          </button>
        </div>

        <div className="flex-grow-1 p-4 overflow-auto">
          {
            categories.map((i) => (

              <div key={i.id} className="border rounded p-2 mb-3" style={{ borderColor: colors.primary, borderWidth: "2px", borderStyle: "solid" }}>
                <div className="d-flex justify-content-between align-items-center">
                  {
                    i.isEditing ?
                      (
                        <input
                          type="text"
                          value={i.name}
                          onChange={(e) => handleEditChange(i.id, e.target.value)}
                          onBlur={(e) => stopEditing(i.id, e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && stopEditing(i.id, e.target.value)}
                          className="form-control edit-input"
                          onFocus={(e) => (e.target.style.transform = "scale(1)")}
                        />

                      ) :
                      (
                        <button className="btn btn-link text-dark text-decoration-none" onClick={() => toggleCategory(i.id)} >
                          {<img
                            src={down}
                            alt="down Icon"
                            width="13px"
                            height="13px"
                            className={`me-2 icon-white ${i.id == idIsOpen ? "rotate" : ""}`}
                            style={{
                              transition: "transform 0.3s ease-in-out",
                              transform: i.id == idIsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                            }}
                          />
                          }
                          {i.name}
                        </button>
                      )
                  }
                  <div>
                    {
                      i.id == idIsOpen ?
                        (
                          <button
                            className="btn btn-sm me-2" style={{ backgroundColor: colors.primary, color: "white" }}
                            onClick={() => {
                              setCategoryId(i.id)
                              setIsSubAdding(true)
                            }
                            }>
                            Tambah
                          </button>
                        ) :
                        (
                          <button
                            className="btn btn-sm btn-warning me-2" style={{ color: "white" }}
                            onClick={() => startEditing(i.id)}>
                            Edit
                          </button>
                        )
                    }
                  </div>
                </div>
                {
                  i.id == idIsOpen && (
                    <div className="mt-2 ps-4">
                      {
                        i.subcategories.map((sub, index) => (
                          <div key={index} className="p-1 m-1 d-flex justify-content-between align-items-center" style={{ backgroundColor: colors.background }}>
                            {
                              idIsSubEditing == sub.sub_kategori_id ?
                                (
                                  <input
                                    type="text"
                                    value={sub.name}
                                    onChange={(e) => handleSubEditChange(i.id, sub.sub_kategori_id, e.target.value)}
                                    onBlur={(e) => stopSubEditing(i.id, sub.sub_kategori_id, e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && stopSubEditing(i.id, sub.sub_kategori_id, e.target.value)}
                                    className="form-control edit-input"
                                    onFocus={(e) => (e.target.style.transform = "scale(1)")}
                                  />
                                )
                                :
                                (
                                  <span style={{ marginLeft: "10px" }} className="d-flex align-items-center">
                                    <img
                                      src={subkategori}
                                      alt="down Icon"
                                      width="13px"
                                      height="13px"
                                      className="me-2 icon-white"
                                      style={{
                                        transition: "transform 0.3s ease-in-out",
                                        transform: i.id == idIsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                                      }}
                                    />
                                    {sub.name}
                                  </span>
                                )
                            }
                            <span className="d-flex align-items-center">
                              <button type="button" className="btn border me-2" onClick={() => startSubEditing(i.id, sub.sub_kategori_id)}>
                                <img src={pen} alt="edit Icon" width="22px" height="22px" className="icon-white" />
                              </button>
                              <button type="button" className="btn border" onClick={() => handleRemove(sub.sub_kategori_id)}>
                                <img src={remove} alt="remove Icon" width="22px" height="22px" className="icon-white" />
                              </button>
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
              </div>
            ))
          }
        </div>
      </div>

      {
        showConfirm && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="bg-white p-4 rounded shadow-lg " style={{ width: "350px", borderRadius: "12px", textAlign: "center" }}>
              <img src={warning} alt="Warning" width="50px" style={{ marginBottom: "10px" }} />
              <p>Apakah kamu yakin ingin menghapus ini ?</p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-danger me-2" onClick={confirmDelete}>
                  Yes
                </button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  setShowConfirm(false)
                  setIdDelete("")
                }}>
                  No
                </button>
              </div>
            </div>
          </div>
        )
      }

      {
        isAdding && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white p-4 rounded shadow-lg" style={{ width: "350px", borderRadius: "12px" }}>
              <h5 className="d-flex align-items-center mb-3 fw-bold">
              </h5>
              <input
                type="text"
                className="form-control my-2"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Masukkan Nama Kategori"
                style={{
                  border: "2px solid #B3001B",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "14px",
                  color: "#333",
                  outline: "none",
                }}
              />
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn me-3"
                  onClick={() => setIsAdding(false)}
                  style={{
                    border: "2px solid #B3001B",
                    color: "#B3001B",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn"
                  onClick={addCategory}
                  style={{
                    backgroundColor: "#B3001B",
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )
      }
      {
        isSubAdding && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white p-4 rounded shadow-lg" style={{ width: "350px", borderRadius: "12px" }}>
              <h5 className="d-flex align-items-center mb-3 fw-bold">
              </h5>
              <input
                type="text"
                className="form-control my-2"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="Masukkan Nama Sub Kategori"
                style={{
                  border: "2px solid #B3001B",
                  borderRadius: "10px",
                  padding: "10px",
                  fontSize: "14px",
                  color: "#333",
                  outline: "none",
                }}
              />
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn me-3"
                  onClick={() => setIsSubAdding(false)}
                  style={{
                    border: "2px solid #B3001B",
                    color: "#B3001B",
                    fontWeight: "bold",
                    backgroundColor: "white",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  Batal
                </button>
                <button
                  className="btn"
                  onClick={() => { addSubcategory(categoryId) }}
                  style={{
                    backgroundColor: "#B3001B",
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "20px",
                  }}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )
      }

    </motion.div >
  );
};

export default Kategori;
