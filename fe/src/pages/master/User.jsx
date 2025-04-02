import colors from "../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { Pagination } from "../../components/Pagination";
import search from "../../assets/search-interface-symbol.png";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Loading";
import { useCallback, useEffect, useState } from "react";
import { config } from "../../config";
import axios from "axios";
import { errorNotify } from "../../helper/toast";

const UserTable = ({ dataUser, currentPage }) => {
    const navigate = useNavigate();
    const getKelaminBadge = (kelamin) => {
        if (kelamin === "L") {
            return "bg-success"; // Hijau untuk Laki-laki
        } else if (kelamin === "P") {
            return "bg-danger"; // Merah untuk Perempuan
        } else {
            return "bg-secondary"; // Abu-abu jika null atau tidak diketahui
        }
    };

    // Fungsi untuk format status kelamin
    const formatKelamin = (kelamin) => {
        if (kelamin === "L") {
            return "Laki-laki";
        } else if (kelamin === "P") {
            return "Perempuan";
        } else {
            return "Tidak Diketahui";
        }
    };
    return (
        <div className="container">
            <div className="mt-2">
                <div className="p-2 row fw-bold border-bottom align-items-center">
                    <div className="text-center" style={{ width: "6%" }}>No</div>
                    <div style={{ width: "25%" }}>Nama</div>
                    <div style={{ width: "30%" }}>Email</div>
                    <div className="text-center" style={{ width: "14%" }}>Kelamin</div>
                    <div className="text-center" style={{ width: "15%" }}>Poin</div>
                    <div className="text-center" style={{ width: "10%" }}>Opsi</div>
                </div>

                {dataUser.map((user, index) => (
                    <div key={user.id} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: index % 2 !== 0 ? "#f8f9fa" : "#ffffff" }}>
                        <div className="text-center" style={{ width: "6%" }}>
                            {(currentPage - 1) * 10 + index + 1}
                        </div>
                        <div style={{ width: "25%" }}>{user.nama}</div>
                        <div style={{ width: "30%" }}>{user.email}</div>
                        <div className="text-center" style={{ width: "14%" }}>
                            <span className={`badge ${getKelaminBadge(user.kelamin)}`}>
                                {formatKelamin(user.kelamin)}
                            </span></div>
                        <div className="text-center" style={{ width: "15%" }}>{user.poin}</div>
                        <div className="text-center" style={{ width: "10%" }}>
                            <button
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: "12px" }}
                                onClick={() => navigate(`/admin/user/${user.id}`)}>
                                Detail
                            </button>
                        </div>
                    </div>
                ))}

                {[...Array(Math.max(0, 10 - dataUser.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center"
                        style={{ height: "60px", backgroundColor: i % 2 !== 0 ? "#f8f9fa" : "#ffffff" }}>
                    </div>
                ))}
            </div>
        </div>
    );
};

UserTable.propTypes = {
    dataUser: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            nama: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            kelamin: PropTypes.string.isRequired,
            poin: PropTypes.number.isRequired,
        })
    ).isRequired,
    currentPage: PropTypes.number.isRequired,
};



const User = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTab, setSelectedTab] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [dataUser, setDataUser] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const serviceGetUsers = useCallback(async (page = 1) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`${config.APIURL}/user/siswa?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDataUser(response.data.data)
            setCurrentPage(response.data.pagination.currentPage);
            setTotalPages(response.data.pagination.totalPages);
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
        serviceGetUsers(1);
    }, [serviceGetUsers]);

    return (
        <motion.div className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: colors.background }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} >
            <ToastContainer />
            <div className="  bg-white shadow-lg d-flex flex-column  d-flex flex-column" style={{ width: "95%", height: "95%", borderRadius: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
                <div className="p-2 flex-shrink-0 d-flex flex-rpw" style={{ backgroundColor: colors.bg_2, marginBottom: "5px" }}>
                    <div
                        className=" d-flex align-items-center px-2"
                        style={{
                            border: `2px solid ${colors.primary}`,
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
                            // navigate("/admin/master/poin/add");
                        }}
                    >
                        Tambah
                    </button>

                </div>
                <div className=" flex-grow-1 d-flex justify-content-center align-items-center">
                    <div className=" flex-grow-1 d-flex justify-content-center">
                        {false ? <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-50"><LoadingSpinner /></div> : <UserTable dataUser={dataUser} currentPage={1} />}
                    </div>
                </div>
                <div className="">
                    <div className="flex-shrink-0" >
                        <Pagination currentPage={1} totalPages={2} onPageChange={(page) => console.log(page)} disableButton={true} />
                    </div>
                </div>
            </div>
        </motion.div >
    );
};

export default User;
