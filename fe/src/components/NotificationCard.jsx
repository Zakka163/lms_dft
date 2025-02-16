import { motion } from "framer-motion";
import colors from "../helper/colors";

const NotificationCard = ({ notifications = [] }) => {
    return (
        <div className="position-relative">
            <div className="position-fixed top-0 end-0" style={{ marginTop: "34px", marginRight: "210px" }}>
                <div className="dropdown">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="dropdown-menu show position-absolute end-0 mt-2 shadow bg-white rounded d-grid"
                        style={{ width: "400px", position: "relative" }}
                    >
                        <div className="d-flex align-items-center mt-3" style={{ backgroundColor: colors.bg_1, height: "30px" }}>
                            <h6 className="mb-0" style={{ marginLeft: "15px", color: "black" }}>Hari ini</h6>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="text-center text-muted py-3">
                                <p className="mb-0">Tidak ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.map((notif, index) => (
                                <div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="d-flex align-items-center px-3 py-2 border-bottom"
                                    style={{ backgroundColor: index % 2 === 0 ? colors.bg_2 : colors.bg_3 }}
                                >
                                    {/* Ikon Notifikasi */}
                                    <div className="me-2 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            color: colors.primary,
                                            fontSize: "20px"
                                        }}>
                                        {notif.icon}
                                    </div>

                                    {/* Konten Notifikasi */}
                                    <div className="flex-grow-1">
                                        <strong className="d-block text-dark" style={{ fontSize: "13px" }}>
                                            Pemberitahuan{" "}
                                            {notif.unread && (
                                                <span className="text-danger" style={{ fontSize: "10px" }}>•</span>
                                            )}
                                            <small className="text-muted ms-1" style={{ fontSize: "10px" }}>
                                                {notif.time}
                                            </small>
                                        </strong>
                                        <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                                            Pemberitahuan pembayaran, kelas, progres, dan lainnya.
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="d-flex align-items-center justify-content-center mt-1">
                            <button className="btn" style={{ padding: "0px", color: colors.primary }}>Tampilkan semua</button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;
