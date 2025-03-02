import search from "../../assets/search-interface-symbol.png";
import colors from "../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
const points = [
    { id: 1, name: "Poin Reward +30 Ketemu Trainer", price: 787000, status: "Aktif" },
    { id: 2, name: "Poin Reward +30 Ketemu Trainer", price: 787000, status: "Aktif" },
    { id: 3, name: "Poin Reward +30 Ketemu Trainer", price: 787000, status: "Nonaktif" },
    { id: 4, name: "Poin Reward +30 Ketemu Trainer", price: 787000, status: "Nonaktif" }
];

const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(price);
};

const PointTable = () => {
    return (
        <div className="container">
            <div className="mt-2">
                <div className="p-2 row fw-bold border-bottom align-items-center">
                    <div style={{ width: "6%" }}>No </div>
                    <div style={{ width: "35%" }}>Nama Poin</div>
                    <div style={{ width: "29%" }}>Harga</div>
                    <div style={{ width: "20%" }}>Status</div>
                    <div style={{ width: "10%" }}>Opsi</div>
                </div>
                {points.map((point, index) => (
                    <div key={point.id} className="row py-2 border-bottom align-items-center" style={{ height: "60px", backgroundColor: index % 2 == 0 ? colors.bg_4 : colors.bg_3 }}>
                        <div className="" style={{ width: "6%" }}><div style={{ marginLeft: "5px" }}>{index + 1}</div></div>
                        <div className="" style={{ width: "35%" }}>{point.name}</div>
                        <div className="" style={{ width: "29%" }}>{formatPrice(point.price)}</div>
                        <div className="" style={{ width: "20%" }}>
                            <span className={`badge ${point.status === "Aktif" ? "bg-success" : "bg-danger"}`}>
                                {point.status}
                            </span>
                        </div>
                        <div className="" style={{ width: "10%" }}>
                            <button className="btn btn-danger btn-sm">detail</button>
                        </div>
                    </div>
                ))}
                {[...Array(10 - points.length)].map((_, i) => (
                    <div key={`empty-${i}`} className="row py-2 border-bottom align-items-center" style={{ height: "60px", backgroundColor: i % 2 != 0 ? colors.bg_4 : colors.bg_3 }}>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(
                    <span
                        key={i}
                        className="mx-2"
                        style={{
                            cursor: "pointer",
                            color: currentPage === i ? colors.primary : "black",
                            fontWeight: currentPage === i ? "bold" : "normal",
                        }}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </span>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push(<span key={i}>.....</span>);
            }
        }
        return pages;
    };

    return (
        <div className=" d-flex justify-content-center align-items-center my-3">
            <button className="d-flex justify-content-center align-items-center"
                style={{
                    marginRight: "10px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    border: "none",
                    color: "white",
                }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <div className="" style={{ marginBottom: "3px" }}> &#8249;</div>
            </button>
            {renderPageNumbers()}
            <button className="d-flex justify-content-center align-items-center"
                style={{
                    marginLeft: "10px",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    border: "none",
                    color: "white",
                }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <div className="" style={{ marginBottom: "3px" }}> &#8250;</div>
            </button>
        </div>
    );
};

// export default Pagination;
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    colors: PropTypes.shape({
        primary: PropTypes.string.isRequired,
    }).isRequired,
};
const Poin = () => {
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
                <div className=" p-2 flex-shrink-0 d-flex flex-rpw" style={{ backgroundColor: colors.bg_2 }}>
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
                        />
                    </div>

                    <button className="d-flex align-items-center justify-content-center btn btn-danger rounded-pill"
                        style={{ marginLeft: "650px", width: "80px", height: "30px", border: `1px solid ${colors.primary}`, color: "white", fontWeight: "bold", backgroundColor: colors.primary, cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease", }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = colors.bg_2;
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

                    >
                        Tambah
                    </button>
                </div>

                <div className="flex-grow-1 d-flex justify-content-center">
                    <PointTable />
                </div>


                <div className=" flex-shrink-0" style={{ height: "70px" }}>
                    <Pagination currentPage={2} totalPages={5} onPageChange={(page) => console.log("Page:", page)} />
                </div>
            </div>


        </motion.div>
    );
};

export default Poin


