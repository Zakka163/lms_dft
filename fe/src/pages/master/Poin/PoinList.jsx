
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


const PointTable = ({ dataPoin, currentPage, totalBarisYangDibutuhkan }) => {
    const tinggiBaris = 60; // px
    const jumlahBarisKosong = Math.max(0, totalBarisYangDibutuhkan - dataPoin.length);
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(price);
    };

    return (
        <div className="w-100 h-100 flex-grow-1 overflow-auto">
            <div className="mt-2">
                {/* Header */}
                <div className="d-flex fw-bold border-bottom align-items-center w-100">
                    <div className="text-center" style={{ width: "6%" }}>No</div>
                    <div style={{ width: "35%" }}>Nama Poin</div>
                    <div style={{ width: "29%" }}>Harga</div>
                    <div className="text-center" style={{ width: "20%" }}>Status</div>
                    <div className="text-center" style={{ width: "10%" }}>Opsi</div>
                </div>

                {/* Data Rows */}
                {dataPoin.map((point, index) => (
                    <div
                        key={point.poin_id}
                        className="d-flex py-2 border-bottom align-items-center w-100"
                        style={{ height: `${tinggiBaris}px`, backgroundColor: index % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}
                    >
                        <div className="text-center" style={{ width: "6%" }}>
                            {(currentPage - 1) * 10 + index + 1}
                        </div>
                        <div style={{ width: "35%" }}>{point.nama_poin}</div>
                        <div style={{ width: "29%" }}>{formatPrice(point.harga_diskon)}</div>
                        <div className="text-center" style={{ width: "20%" }}>
                            <span className={`badge ${point.status ? "bg-success" : "bg-danger"}`}>
                                {point.status ? "aktif" : "non-aktif"}
                            </span>
                        </div>
                        <div className="d-flex justify-content-center" style={{ width: "10%" }}>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => navigate(`/admin/master/poin/edit/${point.poin_id}`)}
                            >
                                Detail
                            </button>
                        </div>
                    </div>
                ))}

                {/* Placeholder Rows */}
                {[...Array(jumlahBarisKosong)].map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="d-flex py-2 border-bottom align-items-center w-100"
                        style={{ height: `${tinggiBaris}px`, backgroundColor: i % 2 == 0 ? colors.bg_4 : colors.bg_3 }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

PointTable.propTypes = {
    dataPoin: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
};


export const PoinList = () => {
    const tinggiBaris = 60; // px
    const tinggiTarget = window.innerHeight * 0.8; // 80% dari tinggi layar
    const totalBarisYangDibutuhkan = Math.floor(tinggiTarget / tinggiBaris);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(1);
    const navigate = useNavigate()
    const [dataPoin, setDataPoin] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    // const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const token = localStorage.getItem("token");

    const serviceGetAllPoin = useCallback(async (page = 1, search = "") => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${config.APIURL}/poin?page=${page}&search=${search}&limit=${totalBarisYangDibutuhkan}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("🚀 ~ serviceGetAllPoin ~ response:", response.data);
            setDataPoin(response.data.data);
            setTotalPages(response.data.totalPages)
            setCurrentPage(response.data.currentPage)
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
    }, [token]); // Hanya bergantung pada token
    useEffect(() => {
        serviceGetAllPoin(1, searchTerm);
    }, [serviceGetAllPoin, searchTerm]);
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
                <div className=" p-3 d-flex flex-row flex-shrink-0 align-items-center flex-wrap justify-content-between" style={{ padding: "10px", gap: "10px" }}>
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
                            fontSize: "14px", // Ukuran teks lebih kecil
                            fontWeight: "normal" // Hapus efek bold
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
                            navigate("/admin/master/poin/add");
                        }}
                    >
                        Tambah
                    </button>

                </div>

                <div className=" flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className="flex-grow-1 d-flex justify-content-center">
                        {!isLoading ? (
                            <PointTable dataPoin={dataPoin} currentPage={currentPage} totalBarisYangDibutuhkan={totalBarisYangDibutuhkan} />
                        ) : (
                            <div className="container-fluid position-relative">
                                <div className="mt-2">
                                    {/* Header */}
                                    <div className="p-2 row fw-bold border-bottom align-items-center">
                                        <div className="text-center" style={{ width: "6%" }}>No</div>
                                        <div style={{ width: "35%" }}>Nama Poin</div>
                                        <div style={{ width: "29%" }}>Harga</div>
                                        <div className="text-center" style={{ width: "20%" }}>Status</div>
                                        <div className="text-center" style={{ width: "10%" }}>Opsi</div>
                                    </div>

                                    {/* Placeholder Baris Kosong (10 Baris) */}
                                    {[...Array(10)].map((_, i) => (
                                        <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center"
                                            style={{ height: "60px", backgroundColor: i % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}>
                                        </div>
                                    ))}
                                </div>

                                {/* Overlay Loading */}
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50">
                                    <LoadingSpinner />
                                </div>
                            </div>

                        )}
                    </div>

                </div>


                <div className=" flex-shrink-0" style={{ height: "70px" }}>
                    <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={(page) => serviceGetAllPoin(page)} disableButton={isLoading} />
                </div>
            </div>
        </motion.div>
    );
}