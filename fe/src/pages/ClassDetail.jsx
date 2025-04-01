import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import colors from "../helper/colors"; // Assuming this is where you define color constants
import { ToastContainer, toast } from "react-toastify"; // For notifications
import { useParams } from "react-router-dom";
import { config } from "../config";
import logo from "../assets/logo.png"
import lock from "../assets/lock.png"
import play_button from "../assets/play-button.png"


const GenericModal = ({ show, onClose, type, content }) => {
  console.log("🚀 ~ GenericModal ~ content:", content);
  console.log("🚀 ~ GenericModal ~ type:", type)
  console.log("🚀 ~ GenericModal ~ type:", type)
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050, // Ensure modal is on top of other content
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px", // Add padding for better spacing
      }}
      tabIndex="-1"
      aria-labelledby="genericModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "900px", width: "90%" }}>
        <div className="modal-content rounded-3 shadow-lg">
          <div className="modal-header border-bottom-0">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
              style={{ zIndex: 1051 }}
            ></button>
          </div>
          <div className="modal-body p-3" style={{ maxHeight: "600px", overflowY: "auto" }}>
            {type === "link" ? (
              <iframe
                width="100%"
                height="515px"
                src={content}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  borderRadius: "12px", // Slightly larger rounded corners
                }}
              ></iframe>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  backgroundColor: "#f9f9f9", // Soft background color
                  padding: "20px", // Add padding inside the text container
                  borderRadius: "8px", // Rounded corners for the text box
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
                  fontFamily: "'Arial', sans-serif", // Custom font for the text
                  lineHeight: "1.6", // Increase line spacing for better readability
                  color: "#333", // Dark text color for better contrast
                  fontSize: "16px", // Adjust font size for readability
                  maxHeight: "600px", // Limit height
                  overflowY: "auto", // Add vertical scrolling if content overflows
                  wordWrap: "break-word", // Ensure long words wrap properly
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




const Lessons = ({ classData, openModal }) => {
  const [expandedLessons, setExpandedLessons] = useState({});
  const [visibleLessons, setVisibleLessons] = useState(5); // Initially show 5 lessons
  // Helper functions
  function lessonNumberStyle(index) {
    return {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      color: colors.primary,
      fontWeight: "bold",
      fontSize: "14px",
      border: `2px solid ${colors.primary}`,
    };
  }

  function renderSubLesson(subLesson) {
    return subLesson.type === "text" ? (
      <div className="d-flex align-items-center">
        {subLesson.isFree ? (
          <>
            <div className="text-warning">
              <img
                src={lock}
                alt="lock"
                style={iconStyle}
              />
            </div>
            <span
              className="fw-semibold text-dark"

            >
              {subLesson.nama_materi}
            </span>
          </>

        ) : (
          <>
            <div className="text-warning" style={{ marginRight: "26px" }}></div>
            <span
              className="fw-semibold text-dark"
              onClick={() => openModal("text", subLesson.content)}
            >
              {subLesson.nama_materi}
            </span>
          </>

        )}

      </div>
    ) : (
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center">
          {subLesson.isFree ? (
            <img
              src={lock}
              alt="lock"
              style={iconStyle}
            />
          ) : (
            <img
              src={play_button}
              alt="play"
              style={playButtonStyle}
              onClick={() => openModal("link", subLesson.video_url)}
            />
          )}
          <span className="fw-semibold text-dark">{subLesson.nama_materi}</span>
        </div>
        <span className="text-muted">{subLesson.video_duration}</span>
      </div>
    );
  }

  const iconStyle = {
    width: "15px",
    height: "15px",
    objectFit: "cover",
    cursor: "pointer",
    marginBottom: "5px",
    marginRight: "10px",
  };

  const playButtonStyle = {
    width: "15px",
    height: "15px",
    objectFit: "cover",
    cursor: "pointer",
    marginBottom: "3px",
    marginRight: "10px",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  };
  function LoadMoreButton({ onClick }) {
    return (
      <button
        className="btn"
        style={loadMoreButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
      >
        Load More Lessons
      </button>
    );
  }

  const loadMoreButtonStyle = {
    width: "auto",
    height: "35px",
    border: `2px solid ${colors.primary}`,
    color: colors.primary,
    fontWeight: "bold",
    backgroundColor: "white",
    cursor: "pointer",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, color 0.3s ease",
    fontSize: "14px",
    borderRadius: "5px",
  };

  function handleMouseEnter(e) {
    e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
    e.target.style.transform = "scale(1.05)";
    e.target.style.backgroundColor = `${colors.primary}`;
    e.target.style.color = "white";
  }

  function handleMouseLeave(e) {
    e.target.style.boxShadow = "none";
    e.target.style.transform = "scale(1)";
    e.target.style.backgroundColor = "white";
    e.target.style.color = `${colors.primary}`;
  }

  function handleMouseDown(e) {
    e.target.style.transform = "scale(0.95)";
  }

  function handleMouseUp(e) {
    e.target.style.transform = "scale(1)";
  }

  // Toggle function to show or hide sub-lessons for a specific lesson
  const toggleSubLessons = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  // Function to load more lessons
  const loadMoreLessons = () => {
    setVisibleLessons((prev) => prev + 5); // Show 5 more lessons on click
  };

  return (
    <div className="mt-2">
      {/* Check if there are lessons available */}
      {classData.materi?.length > 0 ? (
        <div>
          {/* Loop through each lesson and create a card for each */}
          {classData.materi.slice(0, visibleLessons).map((lesson, index) => (
            <div key={lesson.materi_id} className="mb-2">
              <div className="card shadow-sm rounded p-3">
                {/* Lesson Title with icon */}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex justify-content-center align-items-center me-3"
                      style={lessonNumberStyle(index)}
                    >
                      {index + 1}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <h5 className="d-flex justify-content-center align-items-center mt-2 fw-bold text-dark">
                        {lesson.nama_materi}
                      </h5>
                    </div>
                  </div>

                  {/* Button to toggle visibility of sub-lessons */}
                  <button
                    onClick={() => toggleSubLessons(lesson.materi_id)}
                    className="btn btn-sm btn-outline-info"
                  >
                    {expandedLessons[lesson.materi_id] ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Sub-lessons display logic */}
                {expandedLessons[lesson.materi_id] && lesson.sub_materi.length > 0 ? (
                  <ul className="ms-4 mt-2 list-unstyled">
                    {lesson.sub_materi.map((subLesson, subIndex) => (
                      <li
                        key={subIndex}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom"
                        style={{ marginLeft: "20px" }}
                      >
                        {renderSubLesson(subLesson)}
                      </li>
                    ))}
                  </ul>
                ) : expandedLessons[lesson.materi_id] ? (
                  <p className="text-muted ms-4">No sub-lessons available for this lesson.</p>
                ) : null}
              </div>
            </div>
          ))}

          {/* Load More button */}
          {visibleLessons < classData.materi.length && (
            <div className="text-center mt-3">
              <LoadMoreButton onClick={loadMoreLessons} />
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted">No lesson details available.</p>
      )}
    </div>
  );

}





const ClassDetail = () => {

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "video" or "text"
  const [modalContent, setModalContent] = useState("");

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent("");
  };

  // Example for opening text content modal
  const openModal = (type, content) => {
    setShowModal(true);
    setModalContent(content);
    if (type == "link") {
      const videoId = getYouTubeVideoId(content); // Extract video ID from URL
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        setModalType("link");
        setModalContent(embedUrl);
      } else {
        alert("Invalid YouTube URL");
      }

    } else {
      setModalType("text");
    }



  };
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };
  // Fetch class data from API
  const token = localStorage.getItem("token");
  useEffect(() => {
    console.log("🚀 ~ ClassDetail ~ id:", id)
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`${config.APIURL}/kelas/siswa/detail/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },

          }
        );
        console.log("🚀 ~ fetchClassData ~ response:", response.data)
        setClassData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log("🚀 ~ fetchClassData ~ err:", err)
        setError("Failed to load class details");
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // If no class data or error
  if (!classData) {
    return <div className="text-center">Class not found</div>;
  }

  return (
    <motion.div
      className=" flex-grow-1 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        overflow: "auto"
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ToastContainer />
      <div
        className=" bg-white shadow-lg d-flex flex-column"
        style={{
          minWidth: "98%",
          minHeight: "98vh",
          borderRadius: "10px",
          padding: "10px",
          marginTop: "60px",
        }}
      >
        <div className="container mt-5 d-flex flex-column gap-4">
          <div className="d-flex flex-wrap gap-4">

            {/* kiri */}
            <div className="flex-grow-1">
              {/* Course Details Card */}
              <div className="card p-4 shadow-sm rounded">
                <h2 className="text fw-bold">{classData.nama_kelas}</h2>
                <p className="text-muted">{classData.deskripsi_kelas}</p>

                {/* Additional Course Information */}
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <div className="d-flex align-items-center">
                    <span className="text-primary me-2">🕒</span>
                    <span><strong>{classData.durasi || "0 Hours"}</strong> Total Learning Hours</span>
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="text-success me-2">👨‍🎓</span>
                    <span><strong>{classData.total_siswa || "0 Students"}</strong> Enrolled</span>
                  </div>

                  {/* <div className="d-flex align-items-center">
                    <span className="text-warning me-2">📂</span>
                    {classData.kategori && classData.kategori.length > 0 ? (
                      <span>
                        <strong>{classData.kategori[0].nama_kategori}</strong>
                        {classData.kategori[0].nama_sub_kategori && ` - ${classData.kategori[0].nama_sub_kategori}`}
                      </span>
                    ) : (
                      <span><strong>Uncategorized</strong></span>
                    )}
                  </div> */}
                </div>
              </div>


              {/* What You Will Learn Section */}
              <div className="card mt-4 p-4 shadow-sm rounded">
                <h4 className="text-dark fw-semibold">What You Will Learn</h4>
                <div
                  className="mt-3 text-muted"
                  dangerouslySetInnerHTML={{
                    __html: ` 
                    <div style="padding: 15px; background-color: #f9f9f9; border-radius: 8px; color: #333; font-size: 16px;">
                    <h4 style="color: #d9534f; font-weight: bold;">🚀 Key Learning Outcomes</h4>
                    <ul style="padding-left: 20px; line-height: 1.8;">
                      <li>✅ Deep dive into <strong>React.js</strong>: Components, Props, and State</li>
                      <li>🎨 Create stunning user interfaces with <strong>Styled Components & Tailwind CSS</strong></li>
                      <li>🔄 Manage state effectively using <strong>Context API & Redux Toolkit</strong></li>
                      <li>🌍 Build full-stack apps with <strong>Node.js, Express.js, and MongoDB</strong></li>
                      <li>📡 Fetch and manipulate data from <strong>RESTful APIs & GraphQL</strong></li>
                      <li>💡 Implement authentication using <strong>JWT & OAuth</strong></li>
                      <li>🛠 Optimize app performance with <strong>React.memo & Lazy Loading</strong></li>
                      <li>🔍 Debug and test applications with <strong>Jest & React Testing Library</strong></li>
                      <li>🚀 Deploy your apps to <strong>Vercel, Netlify, and Heroku</strong></li>
                      <li>📱 Build cross-platform apps with <strong>React Native</strong> (Bonus Module!)</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 10px; background-color: #fffbe6; border-left: 4px solid #f39c12;">
                      <strong>🔥 Special Bonus:</strong> Get access to an exclusive React project-based bootcamp!
                    </div>
                  </div>` }}
                />
              </div>
              <div className="card mt-4 p-4 shadow-sm rounded">
                <h4 className="text-dark fw-semibold mb-3">Lessons</h4>
                <Lessons openModal={openModal} classData={{
                  "materi": [
                    {
                      "materi_id": 1,
                      "nama_materi": "Introduction to React",
                      "urutan": 1,
                      "sub_materi": [
                        {
                          "sub_materi_id": 100,
                          "nama_materi": "What is React?",
                          "type": "text",
                          "isFree": true,
                          "content": "<p>React adalah library JavaScript untuk membangun UI interaktif.</p>"
                        },
                        {
                          "sub_materi_id": 101,
                          "nama_materi": "Introduction to React",
                          "type": "text",
                          "isFree": false,
                          "content": "<h2>Pengenalan React</h2><p>React adalah library JavaScript yang digunakan untuk membangun antarmuka pengguna yang dinamis dan responsif.</p><img src='https://example.com/react-diagram.png' alt='Diagram React'><p>React dikembangkan oleh Facebook dan menggunakan konsep <strong>virtual DOM</strong> untuk meningkatkan performa.</p><video controls><source src='https://example.com/react-intro.mp4' type='video/mp4'>Video tidak didukung oleh browser Anda.</video><h3>Kuis</h3><p>Apa kegunaan utama React?</p><ul><li>Mengelola database</li><li><strong>Membangun antarmuka pengguna</strong></li><li>Menjalankan backend server</li></ul>"
                        }
                        ,
                        {
                          "sub_materi_id": 102,
                          "nama_materi": "Setting up React Environment",
                          "type": "link",
                          "video_duration": "10:30",
                          "isFree": false,
                          "video_url": "http://www.youtube.com/watch?v=kRaSBCarcso&list=RDaS_Ma8yVy64&index=13"
                        },
                        {
                          "sub_materi_id": 103,
                          "nama_materi": "First React Component",
                          "type": "link",
                          "video_duration": "15:45",
                          "isFree": true,
                          "video_url": "http://www.youtube.com/watch?v=kRaSBCarcso&list=RDaS_Ma8yVy64&index=13"
                        }
                      ]
                    }
                  ]
                }
                } />
              </div>


              {/* Lessons Section */}


            </div>


            {/* kanan */}
            <div className="d-flex flex-column align-items-center" style={{ minWidth: "300px", maxWidth: "400px" }}>
              {/* gambar  */}
              <div className="card shadow-sm" style={{ width: "100%", borderRadius: "10px" }}>
                <div style={{ height: "180px", overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
                  <img
                    src={classData.background_kelas ? `${config.APIURL}/uploads/${classData.background_kelas}` : logo}
                    alt="Course"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px 10px 0 0",
                      display: "block",
                    }}
                  />
                </div>
                <div className="p-4">
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{ flex: 2 }}
                  >
                    {/* Discounted Price - Pulse Animation & Blinking Effect */}
                    <motion.p
                      className="text-danger text-decoration-line-through m-0"
                      style={{ fontSize: "18px", fontWeight: "500" }}
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.1, 1],  // Animasi pulse
                        opacity: [1, 0.5, 1], // Kedip (berubah dari normal ke setengah transparan dan kembali)
                      }}
                      transition={{
                        duration: 1,  // Durasi satu siklus animasi
                        repeat: Infinity,  // Animasi berulang terus
                        repeatType: "reverse",  // Animasi bolak-balik
                        ease: "easeInOut",  // Transisi halus
                      }}
                    >
                      {formatRupiah(classData.harga_diskon_kelas)}
                    </motion.p>

                    {/* Main Price with a subtler effect */}
                    <motion.h4
                      className="text-dark m-0"
                      style={{ fontSize: "22px", fontWeight: "bold" }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        duration: 0.6,
                      }}
                    >
                      {formatRupiah(classData.harga_kelas)}
                    </motion.h4>
                  </div>


                  <h3 className="text-danger mb-3">{classData.harga}</h3>
                  <div className="d-flex justify-content-center">
                    <button className="btn w-80 mb-3" style={{
                      backgroundColor: colors.primary,
                      color: "white"
                    }}>Buy Now</button>
                  </div>
                  <div className="d-flex flex-column gap-2 rounded shadow-sm bg-light">
                    <div className="d-flex align-items-center p-2 border-bottom">
                      <span className="text-primary me-2">📚</span>
                      <span>{classData.material_count || "0"} Learning Materials</span>
                    </div>
                    <div className="d-flex align-items-center p-2 border-bottom">
                      <span className="text-danger me-2">🎥</span>
                      <span>{classData.video_count || "0"} Video Tutorials</span>
                    </div>
                    <div className="d-flex align-items-center p-2 border-bottom">
                      <span className="text-success me-2">⭐</span>
                      <span>{classData.credit_points || "0"} Credit Points</span>
                    </div>
                    <div className="d-flex align-items-center p-2 border-bottom">
                      <span className="text-warning me-2">🔓</span>
                      <span>Lifetime Access</span>
                    </div>
                    <div className="d-flex align-items-center p-2">
                      <span className="text-info me-2">🏅</span>
                      <span>Certificate</span>
                    </div>
                  </div>


                </div>
              </div>

              <div className="card mt-4 p-4 shadow-sm rounded">
                <h5 className="text-center text-primary mb-3" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Instructor</h5>
                <div className="d-flex flex-column align-items-center text-center">
                  <div
                    className="rounded-circle overflow-hidden mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#f0f0f0',
                      border: '3px solid #ddd',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={classData.instructor_image || "https://via.placeholder.com/80"}
                      alt="Instructor"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <h6 className="text-dark" style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                    {classData.instructor_name || "Instructor Name"}
                  </h6>
                  <p className="text-muted" style={{ fontSize: '1rem' }}>
                    {classData.instructor_position || "Instructor Position"}
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <span
                      className="badge bg-success"
                      style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    >
                      Expert
                    </span>
                    <span
                      className="badge bg-primary"
                      style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    >
                      5+ Years Experience
                    </span>
                  </div>
                </div>
              </div>


            </div>


          </div>
        </div>
        {/* <pre>{JSON.stringify(classData, null, 2)}</pre> */}
        <GenericModal
          show={showModal}
          onClose={closeModal}
          type={modalType}
          content={modalContent}
        />

      </div>

    </motion.div>
  );
};

export default ClassDetail;
