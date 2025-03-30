import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import colors from "../../../helper/colors";
import { useState } from "react";
import uploadImg from "../../../assets/upload.png";
import MateriForm from "./Materi";
import KategoriForm from "./KategoriForm";
import axios from "axios";
import { config } from "../../../config";
import { useNavigate } from "react-router-dom";
import { successNotify } from "../../../helper/toast";
const KelasAdd = () => {

    const [coverImage, setCoverImage] = useState("");
    const [fileCoverImage, setFileCoverImage] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOther, setIsOther] = useState(false);
    const [customValue, setCustomValue] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [formData, setFormData] = useState({
        nama: "",
        jumlahPoin: "",
        hargaNormal: "",
        hargaDiskon: "",
        deskripsi: "",
        status: "aktif",
        pembelajaran: "",
        categories: [],
        materi: []
    });


    const navigate = useNavigate();
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileCoverImage(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result); // Mengatur gambar latar ke file yang di-upload
            };
            reader.readAsDataURL(file); // Membaca file gambar
        }
        console.log("🚀 ~ KelasAdd ~ fileCoverImage:", coverImage)
        console.log("🚀 ~ KelasAdd ~ fileCoverImage:", fileCoverImage)
    };
    const handleChangeName = (event) => {
        console.log("🚀 ~ handleChangeName ~ event:", event.target.value)
        setFormData({ ...formData, nama: event.target.value })
    }
    const handleChangeDeskripsi = (event) => {
        console.log("🚀 ~ handleChangeName ~ event:", event.target.value)
        setFormData({ ...formData, deskripsi: event.target.value })
    }
    const handleChangeHargaDiskon = (event) => {
        console.log("🚀 ~ handleChangeName ~ event:", event.target.value)
        setFormData({ ...formData, hargaDiskon: event.target.value })
    }
    const handleChangeHargaNormal = (event) => {
        console.log("🚀 ~ handleChangeName ~ event:", event.target.value)
        setFormData({ ...formData, hargaNormal: event.target.value })
    }
    const handleChangePembelajaran = (event) => {
        console.log("🚀 ~ handleChangeName ~ event:", event.target.value)
        setFormData({ ...formData, pembelajaran: event.target.value })
    }
    const handleChangePoin = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setCustomValue(value);
        }
        console.log("🚀 ~ handleChangePoin ~ event:", event.target.value)
        setFormData({ ...formData, jumlahPoin: event.target.value })
    }
    const handleSelectChange = (event) => {
        const value = event.target.value;
        if (value === "other") {
            setIsOther(true);
        } else {
            setIsOther(false);
        }
        setSelectedValue(value); // Update selectedValue saat pilihan berubah
        setFormData({ ...formData, jumlahPoin: value })
    };


    const onSubmit = async () => {
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("nama_kelas", formData.nama);
        data.append("poin_reward", formData.jumlahPoin);
        data.append("harga_kelas", formData.hargaNormal);
        data.append("harga_diskon_kelas", formData.hargaDiskon);
        data.append("deskripsi_kelas", formData.deskripsi);
        data.append("status_kelas", formData.status);
        data.append("pengajar", "tes");
        data.append("kategori", JSON.stringify(formData.categories));
        data.append("materi", JSON.stringify(formData.materi));
        data.append("pembelajaran_kelas", formData.pembelajaran);
        if (fileCoverImage) {
            data.append("gambar", fileCoverImage);
        }
        console.log(formData);
        

        try {
            setIsLoading(true)

            const response = await axios.post(`${config.APIURL}/kelas/add`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });


            console.log("Response:", response.data);
            setIsLoading(false)
            successNotify("Berhasil Tambah Kelas", () => {
                navigate("/admin/master/kelas");
            })
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Gagal mengirim data.");
            setIsLoading(false)
        }
    }
    return (
        <motion.div
            className="flex-grow-1 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: colors.background }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <ToastContainer />
            <div className="d-flex flex-row"
                style={{
                    backgroundColor: colors.background,
                    width: "95%",
                    borderRadius: "10px",
                    paddingBottom: "10px",
                    marginTop: "20px"
                }}>
                <div className="shadow-sm card" style={{
                    width: "56%",
                    borderRadius: "10px",
                    marginRight: "10px",
                }}>
                    <div className=""
                        style={{
                            height: "200px",
                            backgroundColor: colors.bg_1,
                            backgroundImage: `url(${coverImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px"
                        }}
                    >
                        <div className=""
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                                textAlign: "end",
                                height: "30px",
                                width: "30px",
                                color: "white",
                                fontSize: "18px",
                                fontWeight: "bold",
                            }}
                        >
                            <motion.img
                                src={uploadImg}
                                alt="Upload Icon"
                                style={{ width: "30px", height: "30px" }}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: isClicked ? 1.2 : 1,
                                    rotate: isClicked ? 45 : 0, // Rotate when clicked
                                }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setIsClicked(true)}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            />
                        </div>
                    </div>


                    {/* Konten Form */}
                    <div className="p-3">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nama *</label>
                            <input
                                type="text"
                                className="form-control border-danger"
                                placeholder="Masukkan Nama"
                                onChange={handleChangeName}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Deskripsi *</label>
                            <textarea
                                className="form-control border-danger"
                                rows="3"
                                placeholder="Masukkan Deskripsi"
                                onChange={handleChangeDeskripsi}
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Jumlah Poin *</label>
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select border-danger"
                                    style={{ width: "auto" }}
                                    onChange={handleSelectChange}
                                    value={selectedValue}
                                >
                                    <option value="">Pilih Jumlah</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="other">Lainnya</option>
                                </select>

                                {isOther && (
                                    <input
                                        type="number"
                                        className="form-control border-danger ms-2"
                                        placeholder="Masukkan jumlah poin lain"
                                        value={customValue}
                                        onChange={handleChangePoin}
                                        style={{ width: "auto" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Harga Normal *</label>
                                <input
                                    type="number"
                                    className="form-control border-danger"
                                    placeholder="Masukkan Harga"
                                    onChange={handleChangeHargaNormal}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Harga Diskon</label>
                                <input
                                    type="number"
                                    className="form-control border-danger"
                                    placeholder="Masukkan Harga"
                                    onChange={handleChangeHargaDiskon}
                                />
                            </div>
                        </div>

                        {/* Pastikan MateriForm bisa bertambah tinggi */}
                        {formData && < div className="mb-3">
                            <MateriForm  isEditing={true} formData={formData} setFormData={setFormData} />
                        </div>}
                    </div>
                </div>


                <div className="d-flex flex-column" style={{ width: "46%", borderRadius: "10px", }}>
                    {/* First Right Card */}
                    <div
                        className="shadow-sm card p-3 position-relative"
                        style={{
                            width: "100%",
                            borderRadius: "10px",
                            marginBottom: "10px",
                            minHeight: "300px"
                        }}
                    >
                        <KategoriForm isEditing={true} formData={formData} setFormData={setFormData} />

                    </div>

                    <div className="shadow-sm card" style={{
                        width: "100%",
                        minHeight: "300px",
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: "white",
                        zIndex: 9
                    }}>
                        <div className="mb-3 d-flex flex-column">
                            <label className="form-label fw-bold">Pembelajaran *</label>
                            <textarea
                                placeholder="Apa yang akan kamu pelajari"
                                className="w-full border border-red-500 rounded p-2"
                                style={{ minHeight: "120px" }}
                                onChange={handleChangePembelajaran}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Status *</label>
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
                                    onClick={() => setFormData({ ...formData, status: "nonaktif" })}
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
                                    navigate("/admin/master/kelas");
                                }}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger"
                                onClick={onSubmit}
                                disabled={isLoading}
                            >Simpan</button>
                        </div>

                    </div>

                </div>

            </div>

        </motion.div >
    );
};

export default KelasAdd;
