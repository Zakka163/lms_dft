
import search from "../../../assets/search-interface-symbol.png";
import colors from "../../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import { useCallback, useEffect, useState } from "react";
import { errorNotify } from "../../../helper/toast";
import { Pagination } from "../../../components/Pagination";
import LoadingSpinner from "../../../components/Loading";

const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(price);
};
const colorsKategory = ["bg-primary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-secondary"];


const KelasTable = ({ dataKelas, currentPage }) => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <div className="mt-2">
                <div className="p-2 row fw-bold border-bottom align-items-center">
                    <div style={{ width: "5%" }}>No</div>
                    <div style={{ width: "30%" }}>Nama Kelas</div>
                    <div style={{ width: "30%" }}>Kategori</div>
                    <div style={{ width: "15%" }}>Harga</div>
                    <div style={{ width: "10%" }}>Status</div>
                    <div style={{ width: "10%" }}>Opsi</div>
                </div>

                {dataKelas.map((kelas, index) => (
                    <div key={kelas.kelas_id} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: index % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}>

                        {/* Nomor */}
                        <div className="text-center" style={{ width: "5%", paddingRight: "10px" }}>
                            <div>{(currentPage - 1) * 10 + index + 1}</div>
                        </div>

                        {/* Nama Kelas */}
                        <div className="" style={{ width: "30%" }}>{kelas.nama_kelas}</div>

                        {/* Kategori */}




                        <div className="d-flex flex-wrap" style={{ width: "30%" }}>
                            {kelas.kategori.map((kat, i) => (
                                <span key={i} className={`badge ${colorsKategory[kat.id % colorsKategory.length]} me-1 mb-1`} style={{ fontSize: "12px" }}>
                                    {kat.nama}
                                </span>
                            ))}
                        </div>



                        {/* Harga */}
                        <div className="" style={{ width: "15%" }}>{formatPrice(kelas.harga)}</div>

                        {/* Status */}
                        <div className="" style={{ width: "10%" }}>
                            <span className={`badge ${kelas.status ? "bg-success" : "bg-danger"}`}>
                                {kelas.status ? "aktif" : "non-aktif"}
                            </span>
                        </div>

                        {/* Opsi */}
                        <div className="" style={{ width: "10%" }}>
                            <button className="btn btn-danger btn-sm" onClick={() => navigate(`/admin/master/kelas/edit/${kelas.kelas_id}`)}>
                                Detail
                            </button>
                        </div>
                    </div>
                ))}

                {/* Baris Kosong */}
                {[...Array(Math.max(0, 10 - dataKelas.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: i % 2 == 0 ? colors.bg_4 : colors.bg_3 }}>
                    </div>
                ))}

            </div>
        </div>
    );
};

KelasTable.propTypes = {
    dataKelas: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
};


export const KelasList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(1);
    const navigate = useNavigate()
    const [dataKelas, setDataKelas] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const token = localStorage.getItem("token");

    const serviceGetAllKelas = useCallback(async (page = 1, search = "") => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${config.APIURL}/kelas/list?page=${page}&nama_kelas=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("🚀 ~ serviceGetAllPoin ~ response:", response.data);
            setDataKelas(response.data.data);
            setTotalPages(response.data.pagination.totalPages)
            setCurrentPage(response.data.pagination.currentPage)
            setIsLoading(false)
        } catch (error) {
            console.log("Error fetching poin", error);
            if (error.response?.status === 401) {
                errorNotify("Access Denied");
            }
            if (error.response?.status === 404) {
                errorNotify("Data not found");
            }
        }
    }, [token]);
    useEffect(() => {
        serviceGetAllKelas(1, searchTerm);
    }, [serviceGetAllKelas, searchTerm]);


    return (
        <motion.div className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: colors.background }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <ToastContainer />
            <div className="bg-white shadow-lg d-flex flex-column" style={{ width: "95%", height: "95%", borderRadius: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
                <div className="p-2 flex-shrink-0 d-flex flex-rpw" style={{ backgroundColor: colors.bg_2, marginBottom: "5px" }}>
                    <div
                        className="border border-danger d-flex align-items-center px-2"
                        style={{
                            border: "2px solid red",
                            borderRadius: "20px",
                            width: "274px",
                            height: "29px",
                            marginLeft: "20px"
                        }}
                    >
                        <img
                            src={search}
                            alt="Search"
                            style={{ width: "18px", height: "18px", marginRight: "4px" }}

                        />
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Search for Anything"
                            style={{
                                fontSize: "14px",
                                color: "gray",
                                height: "100%",
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="d-flex align-items-center justify-content-center btn btn-danger rounded-pill"
                        style={{
                            marginLeft: "690px",
                            width: "80px",
                            height: "30px",
                            border: `1px solid ${colors.primary}`,
                            color: "white",
                            backgroundColor: colors.primary,
                            cursor: "pointer",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease",
                            fontSize: "14px",
                            fontWeight: "normal"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = colors.bg_2;
                            e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = "white";
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
                        onClick={() => {
                            navigate("/admin/master/kelas/add");
                        }}
                    >
                        Tambah
                    </button>

                </div>

                <div className="flex-grow-1 d-flex justify-content-center">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        {!isLoading ?
                            (
                                <KelasTable dataKelas={dataKelas} currentPage={currentPage} />
                            ) :
                            (
                                <div className="container position-relative">
                                    <div className="mt-2">
                                        <div className="p-2 row fw-bold border-bottom align-items-center">
                                            <div style={{ width: "5%" }}>No</div>
                                            <div style={{ width: "30%" }}>Nama Kelas</div>
                                            <div style={{ width: "30%" }}>Kategori</div>
                                            <div style={{ width: "15%" }}>Harga</div>
                                            <div style={{ width: "10%" }}>Status</div>
                                            <div style={{ width: "10%" }}>Opsi</div>
                                        </div>

                                        {[...Array(10)].map((_, i) => (
                                            <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center"
                                                style={{ height: "60px", backgroundColor: i % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50">
                                        <LoadingSpinner />
                                    </div>
                                </div>
                            )

                        }
                    </div>

                </div>


                <div className=" flex-shrink-0" style={{ height: "70px" }}>
                    <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={(page) => serviceGetAllKelas(page)} disableButton={isLoading} />
                </div>
            </div>
        </motion.div>
    );
}