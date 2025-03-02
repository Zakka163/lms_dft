import { useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../helper/colors";
import icons_dashboard from "../assets/sidebar/dashboard.png";
import icons_master from "../assets/sidebar/master.png";
import icons_siswa from "../assets/sidebar/siswa.png";
import icons_schedule from "../assets/sidebar/schedule.png";
import icons_transaction from "../assets/sidebar/transaction.png";
import icons_exit from "../assets/sidebar/exit.png";
import user_default from "../assets/sidebar/user_default.png";
import down from "../assets/down.png";
const AdminLayout = () => {
  const [isHovered, setIsHovered] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(null);
  const navigate = useNavigate();

  const handleItemClick = (ismaster, item, ismove) => {
    setIsSelected(item);
    if (ismove) {
      const formattedUrl = item.toLowerCase().replace(/\s+/g, "-");
      navigate(ismaster ? `/admin/master/${formattedUrl}` : `/admin/${formattedUrl}`);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav
      className=" vh-100 d-flex flex-column align-items-start"
      style={{
        margin: 0,
        padding: "10px",
        height: "100%",
        width: isHovered ? "280px" : "50px",
        backgroundColor: colors.primary,
        transition: "width 0.3s ease",
        overflow: "hidden",
        color: "white",
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsSelected(null);
      }}
    >
      <div className=" d-flex flex-row p-2" style={{ width: "250px", marginBottom: "10px" }}>
        <img className=""
          src={user_default}
          alt="Profile"
          style={{
            flexDirection: "row",
            height: "50px",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
        <div className="flex flex-col " style={{ height: "65px", }}>
          <p className="font-bold leading-tight" style={{ fontSize: "14px", marginLeft: "14px", marginTop: "6px", marginBottom: "1px" }}>Nama</p>
          <p className="leading-tight" style={{ fontSize: "12px", marginLeft: "14px", }}>Example@example.com</p>
        </div>
      </div>



      <ul className="nav flex-column w-100">
        {/* Dashboard */}
        <li className="nav-item">
          <a
            className={`nav-link ${isSelected === "Dashboard"
              ? "text-red-500 bg-white rounded"
              : "text-white"
              }`}
            style={{
              backgroundColor: isSelected === "Dashboard" ? colors.primary : "transparent",
              color: isSelected === "Dashboard" ? colors.primary : colors.text,
              textDecoration: "none",
              // color: isSelected === "Dashboard" ? "red" : "white",
            }}

            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Dashboard", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Dashboard", false)}
          >
            <img src={icons_dashboard} alt="Dashboard Icon" width="24" height="24" className="me-2 icon-white" style={{
              filter: isSelected === "Dashboard"
                ? "invert(16%) sepia(94%) saturate(2278%) hue-rotate(-7deg) brightness(88%) contrast(96%)"
                : "invert(1) brightness(2)"
            }} />
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none", marginLeft: "6px" }}
            >
              Dashboard
            </span>
          </a>
        </li>

        {/* Master Dropdown */}
        <li className="nav-item">
          <a
            className="nav-link text-white d-flex  align-items-center"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={icons_master} alt="Dashboard Icon" width="24" height="24" className="me-2 icon-white" style={{
              filter: "invert(1) brightness(2)",
              marginRight: "5px"
            }} />
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none", marginLeft: "6px", marginRight: "120px" }}
            >
              Master
            </span>
            <span style={{ display: isHovered ? "inline" : "none", marginLeft: "6px" }}>
              {<img
                src={down}
                alt="down Icon"
                width="13px"
                height="13px"
                className={`me-2 icon-white ${isDropdownOpen ? "rotate" : ""}`}
                style={{
                  filter: "invert(1) brightness(2)",
                  transition: "transform 0.3s ease-in-out",
                  transform: isDropdownOpen ? "rotate(0deg)" : "rotate(-180deg)",
                }}
              />}
            </span>
          </a>

          {isDropdownOpen && isHovered && (
            <ul className="nav flex-column ps-3">
              {/* Jadwal */}
              <li className="nav-item">
                <a
                  className={`nav-link ${isSelected === "Jadwal"
                    ? "text-red-500 bg-white rounded"
                    : "text-white"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Jadwal", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Jadwal", false)}
                  style={{
                    backgroundColor: isSelected === "Jadwal" ? colors.primary : "transparent",
                    color: isSelected === "Jadwal" ? colors.primary : colors.text,
                    textDecoration: "none",
                    marginLeft: "30px"
                  }}
                >
                  Jadwal
                </a>
              </li>


              {/* Kategori */}
              <li className="nav-item">
                <a
                  className={`nav-link ${isSelected === "Kategori"
                    ? "text-red-500 bg-white rounded"
                    : "text-white"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Kategori", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Kategori", false)}
                  style={{
                    backgroundColor: isSelected === "Kategori" ? colors.primary : "transparent",
                    color: isSelected === "Kategori" ? colors.primary : colors.text,
                    textDecoration: "none",
                    marginLeft: "30px"
                  }}
                >
                  Kategori
                </a>
              </li>

              {/* Kelas */}
              <li className="nav-item">
                <a
                  className={`nav-link ${isSelected === "Kelas"
                    ? "text-red-500 bg-white rounded"
                    : "text-white"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Kelas", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Kelas", false)}
                  style={{
                    backgroundColor: isSelected === "Kelas" ? colors.primary : "transparent",
                    color: isSelected === "Kelas" ? colors.primary : colors.text,
                    textDecoration: "none",
                    marginLeft: "30px"
                  }}
                >
                  Kelas
                </a>
              </li>
              {/* Poin */}
              <li className="nav-item">
                <a
                  className={`nav-link ${isSelected === "Poin"
                    ? "text-red-500 bg-white rounded"
                    : "text-white"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(true, "Poin", true);
                  }}
                  onMouseEnter={() => handleItemClick(true, "Poin", false)}
                  style={{
                    backgroundColor: isSelected === "Poin" ? colors.primary : "transparent",
                    color: isSelected === "Poin" ? colors.primary : colors.text,
                    textDecoration: "none",
                    marginLeft: "30px"
                  }}
                >
                  Poin
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Menu Lainnya */}
        <li className="nav-item">
          <a
            className={`nav-link ${isSelected === "Daftar Siswa"
              ? "text-red-500 bg-white rounded"
              : "text-white"
              }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Daftar Siswa", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Daftar Siswa", false)}
            style={{
              backgroundColor: isSelected === "Daftar Siswa" ? colors.primary : "transparent",
              color: isSelected === "Daftar Siswa" ? colors.primary : colors.text,
              textDecoration: "none",
            }}
          >
            <img src={icons_siswa} alt="Siswa Icon" width="24" height="24" className="me-2 icon-white" style={{
              filter: isSelected === "Daftar Siswa" ? "invert(16%) sepia(94%) saturate(2278%) hue-rotate(-7deg) brightness(88%) contrast(96%)"
                : "invert(1) brightness(2)"
            }} />
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none", marginLeft: "6px" }}
            >
              Daftar Siswa
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${isSelected === "Jadwal Pertemuan"
              ? "text-red-500 bg-white rounded"
              : "text-white"
              }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Jadwal Pertemuan", true);
            }}
            onMouseEnter={() =>
              handleItemClick(false, "Jadwal Pertemuan", false)
            }
            style={{
              backgroundColor: isSelected === "Jadwal Pertemuan" ? colors.primary : "transparent",
              color: isSelected === "Jadwal Pertemuan" ? colors.primary : colors.text,
              textDecoration: "none",
            }}
          >
            <img src={icons_schedule} alt="Schedule Icon" width="24" height="24" className="me-2 icon-white" style={{
              filter: isSelected === "Jadwal Pertemuan" ? "invert(16%) sepia(94%) saturate(2278%) hue-rotate(-7deg) brightness(88%) contrast(96%)"
                : "invert(1) brightness(2)"
            }} />
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none", marginLeft: "6px" }}
            >
              Jadwal Pertemuan
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${isSelected === "Transaksi"
              ? "text-red-500 bg-white rounded"
              : "text-white"
              }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleItemClick(false, "Transaksi", true);
            }}
            onMouseEnter={() => handleItemClick(false, "Transaksi", false)}
            style={{
              backgroundColor: isSelected === "Transaksi" ? colors.primary : "transparent",
              color: isSelected === "Transaksi" ? colors.primary : colors.text,
              textDecoration: "none",
            }}
          >
            <img src={icons_transaction} alt="Transaction Icon" width="24" height="24" className="me-2 icon-white" style={{
              filter: isSelected === "Transaksi" ? "invert(16%) sepia(94%) saturate(2278%) hue-rotate(-7deg) brightness(88%) contrast(96%)"
                : "invert(1) brightness(2)"
            }} />
            <span
              className="nav-text"
              style={{ display: isHovered ? "inline" : "none", marginLeft: "6px" }}
            >
              Transaksi
            </span>
          </a>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="btn btn-danger"
        style={{
          position: "absolute",
          bottom: "10px",
          left: "16px",
          fontWeight: "bold",
          color: "white",
          border: "none",
          borderRadius: "4px",
          display: isHovered ? "inline" : "none",
          marginLeft: "15px",
          marginBottom: "30px"
        }}
      >
        <img
          src={icons_exit}
          alt="exit Icon"
          width="24"
          height="24"
          className="me-2"
          style={{
            filter: "invert(1) brightness(2)"
          }}
        />
        Logout
      </button>

    </nav>
  );
};

export default AdminLayout;
