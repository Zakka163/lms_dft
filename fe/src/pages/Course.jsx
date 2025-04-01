/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import { errorNotify } from "../helper/toast";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import colors from "../helper/colors";
import { config } from "../config";
import { Pagination } from "../components/Pagination";
import React from "react";
import filter from "../assets/setting.png"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
// const courseTemplate = {
//   title: "CLO 3D Designer for Beginner",
//   description: "Kursus ini akan mengajarkan kalian tentang bagaimana cara membuat 3D Garment dengan benar",
//   trainer: "Nama Trainer",
//   duration: "5 Jam",
//   videos: "18 Video",
//   credits: "3 Credit Poin",
//   level: "Beginner",
//   originalPrice: "Rp. 220.000,00",
//   discountedPrice: "Rp. 125.000,00",
// };
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

const initialState = {
  dataKelas: [],
  currentPage: 1,
  totalPage: 1,
  searchTerm: "",
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, dataKelas: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_TOTAL_PAGE":
      return { ...state, totalPage: action.payload };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
const CourseList = React.memo(({ dataKelas }) => {
  const navigate = useNavigate();
  return (
    <div className="container mt-2" style={{ maxHeight: "700px", overflowY: "auto" }}>
      {dataKelas.map((course) => (
        <div
          key={course.kelas_id}
          className="border card border-danger d-flex flex-column"
          style={{ minHeight: "140px", marginBottom: "6px", cursor: "pointer" }}
          onClick={() => navigate(`/course/${course.kelas_id}`)}
        >
          <div className="card-body d-flex flex-row flex-grow-1" style={{ padding: 0 }}>
            {/* Gambar */}
            <div style={{ height: "150px", minWidth: "300px", overflow: "hidden", borderRadius: "5px", padding: "2px" }}>
              <img
                src={course.background_kelas ? `${config.APIURL}/uploads/${course.background_kelas}` : logo}
                alt="Course"
                loading="lazy" // Lazy loading gambar
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                }}
              />
            </div>
            {/* Detail Course */}
            <div className="d-flex flex-column" style={{ padding: "12px", flex: 5 }}>
              <h5 className="fw-bold m-0 text-dark"
                style={{ textDecoration: "none", cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.kelas_id}`); }}>
                {course.nama_kelas}
              </h5>
              <p className="m-0">{truncateText(course.deskripsi_kelas, 100)}</p>
              <p className="m-0"><strong>Durasi:</strong> {course.durasi || "0 Jam"}</p>
            </div>
            {/* Harga */}
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ padding: "10px", flex: 2 }}>
              <p className="text-danger text-decoration-line-through m-0">{formatRupiah(course.harga_kelas)}</p>
              <h5 className="text-dark m-0">{formatRupiah(course.harga)}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});






function Course() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { dataKelas, currentPage, totalPage, searchTerm, isLoading } = state;
  const [isFilter, setIsFilter] = useState(false);
  const token = localStorage.getItem("token");
  const initialFilters = {
    topic: "",
    theme: "",
    level: "",
    creditPoint: "",
  };

  const [selectedFilters, setSelectedFilters] = useState(initialFilters);

  const handleFilterChange = (category, value) => {
    setSelectedFilters({ ...selectedFilters, [category]: value });
  };

  const resetFilters = () => {
    setSelectedFilters(initialFilters);
  };
  const filtersData = [
    {
      title: "Topik",
      key: "topic",
      options: ["CLO 3D Designer", "Marvelous Designer", "Style3D Designer"],
    },
    {
      title: "Tema",
      key: "theme",
      options: ["Baju", "Celana"],
    },
    {
      title: "Level",
      key: "level",
      options: ["Beginner", "Intermediate", "Expert"],
    },
    {
      title: "Credit Poin",
      key: "creditPoint",
      options: ["Credit Poin"],
    },
  ];



  // const navigate = useNavigate();

  // AbortController untuk membatalkan request lama jika ada yang baru
  const controller = useMemo(() => new AbortController(), []);

  // Fetch Data Kelas
  const serviceGetAllKelas = useCallback(
    async (page = 1, search = "") => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await axios.get(
          `${config.APIURL}/kelas/siswa?page=${page}&nama_kelas=${search}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal, // Gunakan AbortController
          }
        );
        dispatch({ type: "SET_DATA", payload: response.data.data });
        dispatch({ type: "SET_TOTAL_PAGE", payload: response.data.pagination.totalPages });
        dispatch({ type: "SET_PAGE", payload: response.data.pagination.currentPage });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Error fetching data:", error);
          if (error.response?.status === 401) errorNotify("Access Denied");
          if (error.response?.status === 404) errorNotify("Data not found");
        }
      }
      dispatch({ type: "SET_LOADING", payload: false });
    },
    [token]
  );

  // Fetch data saat search berubah dengan debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      serviceGetAllKelas(1, searchTerm);
    }, 500); // Delay 500ms untuk debounce

    return () => clearTimeout(delayDebounce); // Cleanup timeout
  }, [searchTerm, serviceGetAllKelas]);

  return (
    <motion.div
      className=" flex-grow-1 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        overflow: "auto"
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >

      <ToastContainer />
      <div
        className=" bg-white shadow-lg d-flex flex-column"
        style={{
          minWidth: "98%",
          minHeight: "98vh",
          // height: "auto",
          borderRadius: "10px",
          padding: "10px",
          marginTop: "60px",

        }}
      >
        <div className="mb-2 d-flex justify-content-start mt-2">
          <button
            className="d-flex align-items-center justify-content-center btn"
            style={{
              padding: "4px",
              width: "80px",
              height: "30px",
              border: `2px solid ${colors.primary}`,
              color: "white",
              backgroundColor: colors.primary,
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
              fontSize: "14px",
              fontWeight: "normal",
              marginLeft: "40px",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onClick={(e) => { setIsFilter(!isFilter) }}
          >
            <img
              src={filter}
              alt="Dashboard Icon"
              width="20px"
              height="20px"
              className="me-2"
              style={{
                filter: "grayscale(100%) invert(1) brightness(2)",
              }}
            />
            Filter
          </button>
          <button
            className="d-flex align-items-center justify-content-center btn"
            style={{
              padding: "4px",
              width: "80px",
              height: "30px",
              border: `2px solid ${colors.primary}`, // Border sesuai warna primary
              color: colors.primary, // Teks sesuai warna primary
              fontWeight: "bold",
              backgroundColor: "white", // Background putih
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
              fontSize: "14px",
              // fontWeight: "normal",
              marginLeft: "10px",
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "none";
              e.target.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.95)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onClick={resetFilters}
          >
            Reset
          </button>
          <form className="d-flex position-relative" style={{ marginLeft: "40px" }}>
            <input
              className="form-control rounded-pill ps-5"
              type="search"
              placeholder="Search anything..."
              aria-label="Search"
              style={{
                height: "28px",
                width: "280px",
                border: `1.5px solid ${colors.primary}`,

              }}
            />
            <span className="position-absolute start-0 ms-3 text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.615.656a5 5 0 1 1 3.536-1.464A5 5 0 0 1 6.127 11z" />
              </svg>
            </span>
          </form>
        </div>


        <div className="d-flex " style={{ width: "100%", minHeight: "700px" }}>
          {/* Sidebar Filter (20%) */}
          {isFilter && (
            <div
              className="p-2 border rounded bg-light"
              style={{
                width: "100%",
                maxWidth: "230px", // Sesuaikan ukuran agar pas
                fontSize: "13px", // Sedikit lebih kecil agar lebih proporsional
                overflowY: "auto", // Jika filter panjang, bisa di-scroll
              }}
            >
              <div className="accordion accordion-flush" id="filterAccordion">
                {filtersData.map((filter, index) => (
                  <div className="accordion-item border-0" key={filter.key}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed p-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${filter.key}`}
                        style={{
                          fontSize: "13px", // Biar lebih proporsional
                          backgroundColor: "#f8f9fa",
                          padding: "6px 10px", // Padding lebih kecil agar lebih rapi
                        }}
                      >
                        {filter.title}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${filter.key}`}
                      className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                    >
                      <div className="accordion-body p-2">
                        {filter.options.map((option, i) => (
                          <div key={i} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={filter.key}
                              id={`${filter.key}-${i}`}
                              onChange={() => handleFilterChange(filter.key, option)}
                              checked={selectedFilters[filter.key] === option}
                            />
                            <label
                              className="form-check-label ms-1"
                              htmlFor={`${filter.key}-${i}`}
                              style={{ fontSize: "12px" }} // Label lebih kecil agar lebih rapi
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Course List (80%) */}
          <div style={{ width: "100%", padding: "2px" }}>
            <CourseList dataKelas={dataKelas} />
          </div>
        </div>

        <div className="mt-2 " >
          <div className="mt-4 flex-shrink-0" style={{ height: "30px" }}>
            <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={(page) => serviceGetAllKelas(page)} disableButton={isLoading} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Course;
