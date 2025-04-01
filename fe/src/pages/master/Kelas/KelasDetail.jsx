import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import colors from "../../../helper/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import { useParams } from "react-router-dom";
import uploadImg from "../../../assets/upload.png";
import KategoriForm from "./KategoriForm";
import { successNotify } from "../../../helper/toast";
import MateriForm from "./Materi";
import user_default from "../../../assets/sidebar/user_default.png";
const pesertaData = Array.from({ length: 28 }, (_, index) => ({
    id: index + 1,
    name: `Peserta ${index + 1}`,
    photo: (index % 2) == 0 ? user_default : `https://thispersondoesnotexist.com/`
}));


const KelasDetail = () => {
    const { id } = useParams();
    const [kelas, setKelas] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [coverImage, setCoverImage] = useState("");

    const [isOther, setIsOther] = useState(false);
    const [fileCoverImage, setFileCoverImage] = useState(null);
    const token = localStorage.getItem("token");
    const [dataKelas, setDataKelas] = useState(null)
    const [forceRender, setForceRender] = useState(false);
    const fetchKelasDetail = async () => {
        try {
            const response = await axios.get(`${config.APIURL}/kelas/id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            const dataMateri = [];

            if (response.data.data?.materi && Array.isArray(response.data.data.materi)) {
                for (let i = 0; i < response.data.data.materi.length; i++) {
                    dataMateri.push({
                        id: (response.data.data.materi[i].materi_id).toString(),
                        name: response.data.data.materi[i].nama_materi,
                        isEditing: false,
                        subcategories: response.data.data.materi[i].sub_materi || [], // Hindari undefined
                        showSub: false,
                        order: response.data.data.materi[i].urutan
                    });
                }
            } else {
                console.error("Error: response.data.data.materi is not an array", response.data.data);
            }

            setKelas({ ...response.data.data, categories: response.data.data.kategori, materi: dataMateri });
            setDataKelas({ ...response.data.data, categories: response.data.data.kategori, materi: dataMateri })
            setCoverImage(null)
        } catch (error) {
            console.error("Error fetching kelas detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKelasDetail();
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setKelas(dataKelas);
        setIsEditing(false);
        setCoverImage("");
        setFileCoverImage(null);
        setForceRender(prev => !prev);
    };

    const handleSaveClick = async () => {
        const token = localStorage.getItem("token");
        const data = new FormData();
        data.append("nama_kelas", kelas.nama_kelas);
        data.append("poin_reward", kelas.poin_reward);
        data.append("harga_kelas", kelas.harga_kelas);
        data.append("harga_diskon_kelas", kelas.harga_diskon_kelas);
        data.append("deskripsi_kelas", kelas.deskripsi_kelas);
        data.append("status_kelas", kelas.status_kelas);
        data.append("pengajar", "tes");
        data.append("kategori", JSON.stringify(kelas.categories));
        data.append("pembelajaran_kelas", kelas.pembelajaran_kelas);
        data.append("materi", JSON.stringify(kelas.materi));
        if (fileCoverImage) {
            data.append("gambar", fileCoverImage);
        }
        try {
            setIsLoading(true)
            await axios.put(`${config.APIURL}/kelas/edit/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setIsLoading(false)
            setDataKelas(kelas)
            successNotify("Berhasil Edit Kelas", () => {
                setCoverImage(null)
                setFileCoverImage(null)
                setIsEditing(false)
            })

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Gagal mengirim data.");
            setIsLoading(false)
        } finally {
            fetchKelasDetail()
        }

    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileCoverImage(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("🚀 ~ handleFileChange ~ reader.result:", reader.result)
                setCoverImage(reader.result);
            };

            reader.readAsDataURL(file);
        }
        setForceRender(prev => !prev);
    };


    const handleSelectChange = (event) => {
        const value = event.target.value;
        if (value === "other") {
            setIsOther(true);
        } else {
            setIsOther(false);
            setKelas({ ...kelas, poin_reward: Number(event.target.value) })
        };
    }
    useEffect(() => {
        console.log("🚀 ~ coverImage:", coverImage)
        console.log("🚀 ~ fileCoverImage:", fileCoverImage)
        console.log("🚀 ~ isEditing:", isEditing)
    }, [forceRender])

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
                    {kelas && <div key={forceRender} className=""
                        style={{
                            height: "200px",
                            backgroundColor: colors.bg_1,
                            backgroundImage: isEditing && coverImage ? `url(${coverImage})` : kelas.background_kelas ? `url(${config.APIURL}/uploads/${kelas.background_kelas})` : "none",
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
                                opacity: !isEditing ? 0.5 : 1,
                                pointerEvents: !isEditing ? "none" : "auto",
                            }}
                        >
                            {isEditing && <motion.img
                                src={uploadImg}
                                alt="Upload Icon"
                                style={{ width: "30px", height: "30px" }}
                                initial={{ scale: 1 }}
                                animate={{
                                    scale: isClicked ? 1.2 : 1,
                                    rotate: isClicked ? 45 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                onClick={() => isEditing && setIsClicked(true)}
                            />}
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
                    </div>}


                    {/* Konten Form */}
                    <div className="p-3">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nama *</label>
                            <input
                                type="text"
                                className="form-control border-danger"
                                placeholder="Masukkan Nama"
                                value={kelas?.nama_kelas || ""} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                disabled={!isEditing} // Jika isEditing true, input akan disable
                                onChange={(e) => setKelas({ ...kelas, nama_kelas: e.target.value })} // Update state saat diketik
                            />
                        </div>


                        <div className="mb-3">
                            <label className="form-label fw-bold">Deskripsi *</label>
                            <textarea
                                className="form-control border-danger"
                                rows="3"
                                placeholder="Masukkan Deskripsi"
                                value={kelas?.deskripsi_kelas || ""} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                disabled={!isEditing} // Jika isEditing true, input akan disable
                                onChange={(e) => setKelas({ ...kelas, deskripsi_kelas: e.target.value })} // Update state saat diketik
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Jumlah Poin *</label>
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select border-danger"
                                    style={{ width: "auto" }}
                                    value={isOther ? "other" : kelas?.poin_reward} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                    disabled={!isEditing} // Jika isEditing true, input akan disable
                                    onChange={handleSelectChange} // Update state saat diketik
                                >
                                    <option value="" disabled={true} >Pilih Jumlah</option>
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
                                        value={kelas?.poin_reward || 0}
                                        onChange={(e) => { setKelas({ ...kelas, poin_reward: Number(e.target.value) }) }}
                                        disabled={!isEditing}
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
                                    value={kelas?.harga_kelas || 0} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                    disabled={!isEditing} // Jika isEditing true, input akan disable
                                    onChange={(e) => setKelas({ ...kelas, harga_kelas: e.target.value })} // Update state saat diketik
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Harga Diskon</label>
                                <input
                                    type="number"
                                    className="form-control border-danger"
                                    placeholder="Masukkan Harga"
                                    value={kelas?.harga_diskon_kelas || 0} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                    disabled={!isEditing} // Jika isEditing true, input akan disable
                                    onChange={(e) => setKelas({ ...kelas, harga_diskon_kelas: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Pastikan MateriForm bisa bertambah tinggi */}
                        {kelas && <div className="mb-3">
                            <MateriForm isEditing={isEditing} formData={kelas} setFormData={setKelas} />
                        </div>}

                    </div>
                </div>

                <div className="d-flex flex-column" style={{ width: "45%", borderRadius: "10px", }}>
                    {kelas && <div
                        className="shadow-sm card p-3 position-relative mb-2"
                        style={{
                            width: "100%",
                            borderRadius: "10px",
                            minHeight: "300px"
                        }}>
                        <KategoriForm key={dataKelas.categories.length} isEditing={isEditing} formData={kelas} setFormData={setKelas} />
                    </div>
                    }
                    <div className="mb-2 shadow-sm card" style={{
                        width: "100%",
                        minHeight: "300px",
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: "white"
                    }}>
                        <div className="mb-3 d-flex flex-column">
                            <label className="form-label fw-bold">Pembelajaran *</label>
                            <textarea
                                placeholder="Apa yang akan kamu pelajari"
                                className="w-full border border-red-500 rounded p-2"
                                style={{ minHeight: "120px" }}
                                value={kelas?.pembelajaran_kelas || 0} // Ambil dari kelas.nama_kelas, jika undefined kosongkan
                                disabled={!isEditing} // Jika isEditing true, input akan disable
                                onChange={(e) => setKelas({ ...kelas, pembelajaran_kelas: e.target.value })}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Status *</label>
                            <div className="d-flex gap-2">
                                {!isEditing ? (
                                    <div
                                        className={`btn ${kelas?.status_kelas === "aktif" ? "btn-danger" : "btn-outline-danger"}`}
                                    >
                                        {kelas?.status_kelas === "aktif" ? "Aktif" : "nonaktif"}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={`btn ${kelas?.status_kelas === "aktif" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => setKelas({ ...kelas, status_kelas: "aktif" })}
                                        >
                                            Aktif
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${kelas?.status_kelas === "nonaktif" ? "btn-danger" : "btn-outline-danger"}`}
                                            onClick={() => setKelas({ ...kelas, status_kelas: "nonaktif" })}
                                        >
                                            Non-Aktif
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                        <div className="d-flex justify-content-end mt-3 gap-2">
                            {!isEditing ? (
                                <div>
                                    <button
                                        // onClick={handleEditClick}
                                        className="btn btn-info"

                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleEditClick}
                                        className="btn btn-success"
                                        style={{
                                            marginLeft: '4px'
                                        }}
                                    >
                                        Edit Kelas
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelClick}
                                        type="button"
                                        className="btn btn-outline-danger"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSaveClick}
                                        type="submit"
                                        className="btn btn-danger"
                                        // onClick={onSubmit} 
                                        disabled={isLoading}
                                    >
                                        Simpan
                                    </button>
                                </>
                            )}
                        </div>

                    </div>

                    <div className="shadow-sm card" style={{
                        width: "100%",
                        minHeight: "200px",
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: "white"
                    }}>
                        {/* Header */}
                        <div className="mb-3 d-flex align-items-center">
                            <label className="form-label fw-bold">Peserta *</label>
                        </div>

                        {/* Jika pesertaData kosong */}
                        {pesertaData.length === 0 ? (
                            <div className="text-center text-muted align-items-center justify-content-center" style={{ fontSize: "14px",marginTop:"40px" }}>
                                Tidak ada peserta
                            </div>
                        ) : (
                            <div style={{
                                display: "flex",
                                overflowX: "auto",
                                paddingBottom: "10px",
                                whiteSpace: "nowrap"
                            }}>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(10, 1fr)", // 10 kolom per baris
                                    gap: "20px",
                                    paddingBottom: "10px"
                                }}>
                                    {pesertaData.map((peserta) => (
                                        <div key={peserta.id} className="d-flex flex-column align-items-center">
                                            <img
                                                src={peserta.photo}
                                                alt={peserta.name}
                                                className="rounded-circle border"
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                            />
                                            <span className="mt-2" style={{ fontWeight: "bold", fontSize: "14px" }}>
                                                {peserta.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                </div>

            </div>
            <div>
            </div>

        </motion.div >

    );
};

export default KelasDetail;
