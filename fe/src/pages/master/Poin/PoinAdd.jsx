import { useState } from "react";
import colors from "../../../helper/colors";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../../config";
import { successNotify } from "../../../helper/toast";

export const PoinAdd = ({ col }) => {
  const [formData, setFormData] = useState({
    nama: "",
    jumlahPoin: "",
    hargaNormal: "",
    hargaDiskon: "",
    deskripsi: "",
    status: "aktif",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(`${config.APIURL}/poin`, {
        nama_poin: formData.nama,
        jumlah_poin: formData.jumlahPoin,
        harga_normal: formData.hargaNormal,
        harga_diskon: formData.hargaDiskon,
        deskripsi: formData.deskripsi,
        status: formData.status == "aktif" ? true : false,
      });
      console.log("🚀 ~ handleSubmit ~ response:", response)
      successNotify("Berhasil Tambah Poin", () => {
        navigate("/admin/master/poin");
      })

    } catch (error) {
      toast.error("Gagal menambahkan poin: " + error.response?.data?.message || error.message);
    }
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
        style={{ width: "95%", height: "95%", borderRadius: "10px", padding: "10px" }}
      >
        <h4 className="mb-3 text-center mt-4">Tambah Poin</h4>
        <form onSubmit={handleSubmit} className="p-3">
          <div className="mb-3">
            <label className="form-label">Nama *</label>
            <input
              type="text"
              name="nama"
              className="form-control"
              placeholder="Masukkan Nama"
              value={formData.nama}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Jumlah Poin *</label>
            <input
              type="number"
              className="form-control"
              name="jumlahPoin"
              value={formData.jumlahPoin}
              onChange={handleChange}
              placeholder="Masukkan Harga"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Harga Normal *</label>
            <input
              type="number"
              name="hargaNormal"
              className="form-control"
              placeholder="Masukkan Harga"
              value={formData.hargaNormal}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Harga Diskon</label>
            <input
              type="number"
              name="hargaDiskon"
              className="form-control"
              placeholder="Masukkan Harga"
              value={formData.hargaDiskon}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="deskripsi"
              className="form-control"
              rows="3"
              placeholder="Masukkan Deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Status *</label>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn ${formData.status === "aktif" ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => setFormData({ ...formData, status: "aktif" })}
              >
                Aktif
              </button>
              <button
                type="button"
                className={`btn ${formData.status === "non-aktif" ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => setFormData({ ...formData, status: "non-aktif" })}
              >
                Non-Aktif
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3 gap-2">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                navigate("/admin/master/poin");
              }}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-danger">Simpan</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
