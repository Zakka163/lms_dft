import { useState, useEffect } from "react";
import axios from "axios";
import colors from "../../../helper/colors";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../../../config";
import { successNotify, errorNotify } from "../../../helper/toast";

export const PoinEdit = () => {
  const [formData, setFormData] = useState({
    nama: "",
    jumlahPoin: "",
    hargaNormal: "",
    hargaDiskon: "",
    deskripsi: "",
    status: "aktif",
  });

  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const fetchPoin = async () => {
      try {
        const response = await axios.get(`${config.APIURL}/poin/${id}`);
        console.log("🚀 ~ fetchPoin ~ response:", response.data.data.nama_poin)
        setFormData({
          nama: response.data.data.nama_poin || "",
          jumlahPoin: response.data.data.jumlah_poin || "",
          hargaNormal: response.data.data.harga_normal || "",
          hargaDiskon: response.data.data.harga_diskon || "",
          deskripsi: response.data.data.deskripsi || "",
          status: response.data.data.status == true ? "aktif" : "non-aktif",
        });
      } catch (error) {
        console.log("🚀 ~ fetchPoin ~ error:", error)
        errorNotify("Gagal mengambil data poin");
      }
    };
    fetchPoin()


  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.APIURL}/poin/${id}`, {
        nama_poin: formData.nama,
        jumlah_poin: formData.jumlahPoin,
        harga_normal: formData.hargaNormal,
        harga_diskon: formData.hargaDiskon,
        deskripsi: formData.deskripsi,
        status: formData.status == "aktif" ? true : false,
      });
      successNotify("Poin berhasil diperbarui", () => navigate("/admin/master/poin"));
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error)
      errorNotify("Gagal memperbarui poin");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus poin ini?")) {
      try {
        await axios.delete(`${config.APIURL}/poin/${id}`);
        successNotify("Poin berhasil dihapus", () => navigate("/admin/master/poin"));
      } catch (error) {
        console.log("🚀 ~ handleDelete ~ error:", error)
        errorNotify("Gagal menghapus poin");
      }
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
        className="bg-white shadow-lg d-flex flex-column"
        style={{ width: "95%", height: "95%", borderRadius: "10px", padding: "10px" }}
      >
        <h4 className="mb-3 text-center mt-4">Edit Poin</h4>
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
              placeholder="Masukkan Jumlah Poin"
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
            <button type="button" className="btn btn-outline-danger" onClick={() => navigate("/admin/master/poin")}>Batal</button>
            <button type="submit" className="btn btn-danger">Simpan</button>
            <button type="button" className="btn btn-warning" onClick={handleDelete}>Hapus</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};