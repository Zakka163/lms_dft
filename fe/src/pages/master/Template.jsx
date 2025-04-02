import { useCallback, useEffect, useState } from "react";
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


const Poin = () => {
    return (
        <motion.div className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: colors.background }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }} >
            <ToastContainer />
            <div className="border border-warning  bg-white shadow-lg d-flex flex-column  d-flex flex-column" style={{ width: "95%", height: "95%", borderRadius: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
                <div className="border border-danger p-3 flex-shrink-0">1</div>
                <div className="border border-danger flex-grow-1 d-flex justify-content-center align-items-center">
                    2
                </div>
                <div className="border border-danger p-3 flex-shrink-0">3</div>
            </div>
        </motion.div >
    );
};

export default Poin;
