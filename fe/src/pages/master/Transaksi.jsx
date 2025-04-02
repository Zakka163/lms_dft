import { useCallback, useEffect, useState } from "react";
import colors from "../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { Pagination } from "../../components/Pagination";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Loading";
import { config } from "../../config";
import axios from "axios";
import { errorNotify } from "../../helper/toast";


const TransaksiTable = ({ dataTransaksi, currentPage }) => {
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(price);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-warning text-dark";
            case "paid":
                return "bg-success";
            case "failed":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    const formatStatus = (status) => {
        if (typeof status !== "string") return "Unknown";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="mt-2">
                <div className="p-2 row fw-bold border-bottom align-items-center">
                    <div className="text-center" style={{ width: "6%" }}>No</div>
                    <div style={{ width: "25%" }}>Order ID</div>
                    <div style={{ width: "15%" }}>User</div>
                    <div style={{ width: "15%" }}>Harga</div>
                    <div className="text-center" style={{ width: "14%" }}>Tanggal</div>
                    <div className="text-center" style={{ width: "15%" }}>Status</div>
                    <div className="text-center" style={{ width: "5%" }}>Opsi</div>
                </div>

                {dataTransaksi.map((transaksi, index) => (
                    <div key={transaksi.order_id} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: index % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}>
                        <div className="text-center" style={{ width: "6%" }}>
                            {(currentPage - 1) * 10 + index + 1}
                        </div>
                        <div style={{ width: "25%" }}>{transaksi.order_id}</div>
                        <div style={{ width: "15%" }}>{transaksi.user}</div>
                        <div style={{ width: "15%" }}>{formatPrice(transaksi.harga)}</div>
                        <div className="text-center" style={{ width: "14%" }}>
                            {new Date(transaksi.tanggal_pembayaran).toLocaleDateString()}
                        </div>
                        <div className="text-center" style={{ width: "15%" }}>
                            <span className={`badge ${getStatusBadge(transaksi.status)}`}>
                                {formatStatus(transaksi.status)}
                            </span>
                        </div>
                        <div className=" align-items-center" style={{ width: "5%", padding: "0px" }}>
                            <button
                                className=" btn btn-primary btn-sm"
                                style={{ fontSize: "12px" }}
                                onClick={() => navigate(`/admin/transaksi/${transaksi.order_id}`)}>
                                Detail
                            </button>

                        </div>
                    </div>
                ))}
                {[...Array(Math.max(0, 10 - dataTransaksi.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: i % 2 !== 0 ? colors.bg_4 : colors.bg_3 }}>
                    </div>
                ))}
            </div>
        </div>
    );

};

TransaksiTable.propTypes = {
    dataTransaksi: PropTypes.arrayOf(
        PropTypes.shape({
            order_id: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            harga: PropTypes.number.isRequired,
            status: PropTypes.bool.isRequired,
            tanggal: PropTypes.string.isRequired,
        })
    ).isRequired,
    currentPage: PropTypes.number.isRequired,
};


const Transaksi = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTab, setSelectedTab] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [dataTransaksi, setDataTransaksi] = useState([]);

    const serviceGetTransaksi = useCallback(async (page = 1, type = "all") => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${config.APIURL}/transaksi?page=${page}&type=${type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDataTransaksi(response.data.data)
            setCurrentPage(response.data.pagination.currentPage);
            setTotalPages(response.data.pagination.totalPages);
            setIsLoading(false)
            console.log("🚀 ~ serviceGetTransaksi ~ response.data.totalPages:", response.pagination.totalPages)
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
        serviceGetTransaksi(1);
    }, [serviceGetTransaksi]);

    const renderTab = (label) => {
        const isActive = selectedTab === label.toLowerCase();
        return (
            <div
                className={`rounded-pill d-flex justify-content-center align-items-center ms-2`}
                style={{
                    width: "80px",
                    height: "25px",
                    border: `1.5px solid ${colors.primary}`,
                    color: isActive ? "white" : colors.primary,
                    fontWeight: "bold",
                    backgroundColor: isActive ? colors.primary : "transparent",
                    cursor: "pointer",
                    transition: "0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onClick={() => {
                    serviceGetTransaksi(1,label.toLowerCase())
                    setSelectedTab(label.toLowerCase())
                }}
            >
                {label}
            </div>
        );
    };

    return (
        <motion.div
            className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: colors.background }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <ToastContainer />
            <div
                className=" bg-white shadow-lg d-flex flex-column"
                style={{ width: "95%", height: "95%", borderRadius: "10px" }}
            >
                <div className=" p-3 d-flex flex-row flex-shrink-0 align-items-center flex-wrap justify-content-between" style={{ padding: "10px", gap: "10px" }}>
                    <div className="d-flex flex-row ">
                        {renderTab("All")}
                        {renderTab("Kelas")}
                        {renderTab("Poin")}
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <div className="position-relative">
                            <input
                                type="date"
                                className="form-control px-2"
                                style={{
                                    width: "140px",
                                    minWidth: "120px",
                                    borderRadius: "6px",
                                    padding: "6px 6px 6px 40px",
                                    fontSize: "12px",
                                    height: "32px",
                                    border: `1.5px solid ${colors.primary}`,
                                    color: colors.primary,
                                }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            {/* <span className="position-absolute text-muted fw-bold"
                                style={{ left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: colors.primary }}>
                                Dari
                            </span> */}
                        </div>

                        <div className="position-relative">
                            <input
                                type="date"
                                className="form-control px-2"
                                style={{
                                    width: "140px",
                                    minWidth: "120px",
                                    borderRadius: "6px",
                                    padding: "6px 6px 6px 40px",
                                    fontSize: "12px",
                                    height: "32px",
                                    border: `1.5px solid ${colors.primary}`,
                                    color: colors.primary,
                                }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            {/* <span className="position-absolute text-muted fw-bold"
                                style={{ left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: colors.primary }}>
                                Sampai
                            </span> */}
                        </div>
                    </div>

                </div>



                {/* Konten Utama */}
                <div className=" flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className=" flex-grow-1 d-flex justify-content-center">
                        {isLoading ? <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-50"><LoadingSpinner /></div> : <TransaksiTable dataTransaksi={dataTransaksi} currentPage={currentPage} />}
                    </div>
                    {/* {selectedTab === "kelas" && <span>Data Kelas</span>}
                    {selectedTab === "poin" && <span>Data Poin</span>}
                    {selectedTab === "all" && <span>Semua Data</span>} */}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0" >
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => serviceGetTransaksi(page,selectedTab)} disableButton={isLoading} />
                </div>
            </div>
        </motion.div>
    );
};

export default Transaksi;
