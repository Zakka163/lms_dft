import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "50%",
        maxWidth: "600px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        cursor: "pointer",
    },
};

const TransaksiDetail = () => {
    const { order_id } = useParams();

    const [transaksi, setTransaksi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const [showModal, setShowModal] = useState(false);

    const handlePay = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        const fetchTransaksiDetail = async () => {
            try {
                console.log("🚀 ~ TransaksiDetail ~ order_id:", order_id);
                const response = await axios.get(`${config.APIURL}/transaksi/${order_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Dummy data untuk testing
                setTransaksi(response.data.data);

            } catch (err) {
                console.log("🚀 ~ fetchTransaksiDetail ~ err:", err);
                setError("Failed to fetch transaction details");
            } finally {
                setLoading(false);
            }
        };

        fetchTransaksiDetail();
    }, [order_id]);

    if (loading) {
        return <div className="text-xl font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    // Fungsi untuk tombol Pay
    // const handlePay = () => {
    //     const paymentWindow = window.open(
    //         transaksi.url_midtrans,
    //         "MidtransPayment",
    //         "width=800,height=600"
    //     );

    //     if (!paymentWindow) {
    //         alert("Popup blocked! Please allow popups for this website.");
    //     }
    // };


    return (
        <div className="ms-4 mt-4">
            <pre>{JSON.stringify(transaksi, null, 2)}</pre>

            {/* Menampilkan tombol Pay jika status transaksi adalah "pending" */}
            {transaksi.status_pembayaran == "pending" && (
                <button
                    onClick={handlePay}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Pay
                </button>
              
           
            )}
             {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button onClick={closeModal} style={styles.closeButton}>
                            ✖
                        </button>
                        <iframe
                            src={transaksi.url_midtrans}
                            width="100%"
                            height="500px"
                            style={{ border: "none", borderRadius: "10px" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransaksiDetail;
