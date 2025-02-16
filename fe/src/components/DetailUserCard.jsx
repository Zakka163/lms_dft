import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import colors from "../helper/colors";

export const DetailUserCard = ({ user }) => {
    const handleLogout = () => {
        localStorage.removeItem("token"); 
        sessionStorage.removeItem("token"); 
    
        window.location.href = "/login"; 
    };
    return (
        <motion.div
            className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm bg-white rounded"
            style={{ width: "300px" }}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {/* Header User */}
            <div className="text-center p-3 border-bottom">
                <FaUserCircle size={50} color="#ccc" />
                <h6 className="mt-2 mb-0">{user.name}</h6>
                <small className="text-muted">{user.email}</small>
            </div>

            {/* Akun Section */}
            <div className="p-3 border-bottom">
                <strong className="text-muted d-block mb-2">Akun</strong>
                {user.accounts.map((acc, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                        <FaUserCircle size={24} color="#aaa" className="me-2" />
                        <div>
                            <span className="d-block">{acc.name}</span>
                            <small className="text-muted">{acc.email}</small>
                        </div>
                    </div>
                ))}
                <button className="btn btn-danger btn-sm w-100 mt-2">+ Tambahkan Akun</button>
            </div>

            {/* Menu Lainnya */}
            <div className="p-3">
                <strong className="text-muted d-block mb-2">Lainnya</strong>
                <ul className="list-unstyled mb-0">
                    <li className="py-1 menu-item"><a href="#" className="text-dark text-decoration-none">Pengaturan</a></li>
                    <li className="py-1 menu-item"><a href="#" className="text-dark text-decoration-none">Riwayat Pembelian</a></li>
                    <li className="py-1 menu-item"><a href="#" className="text-dark text-decoration-none">Share ke Teman</a></li>
                    <li className="py-1 menu-item"><a href="#" className="text-dark text-decoration-none">Kebijakan Privasi</a></li>
                    <li className="py-1 border-top mt-2 pt-2 menu-item">
                        <button className="btn text-decoration-none" style={{color:colors.primary}} onClick={handleLogout} >Keluar</button>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
};
