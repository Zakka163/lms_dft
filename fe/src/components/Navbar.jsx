import colors from "../helper/colors";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import notif from "../assets/bell.png";
import logo from "../assets/logo.png";
import defaultPicture from "../assets/loginPic.png";
import NotificationCard from "./NotificationCard";
import { FaClock, FaVideo, FaGraduationCap, FaBook } from "react-icons/fa";
import { DetailUserCard } from "./DetailUserCard";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { config } from "../config";
import { errorNotify } from "../helper/toast";
const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showNotif, setShowNotif] = useState(true);
  const [showUser, setShowUser] = useState(true);
  const [picture, setPicture] = useState("");
  const [userProfileData, setUserProfileData] = useState({});
  const [notificationsData, setNotificationsData] = useState([
    { id: 1, icon: <FaClock />, time: "9m", unread: true },
    { id: 2, icon: <FaVideo />, time: "23m", unread: false },
    { id: 3, icon: <FaBook />, time: "12j", unread: true },
    { id: 4, icon: <FaGraduationCap />, time: "12s", unread: false },
  ]);
  const userData = {
    name: "Nama User",
    email: "example@example.com",
    accounts: [
      { name: "Nama Akun", email: "example@example.com" },
      { name: "Nama Akun", email: "example@example.com" }
    ]
  };
  const navigate = useNavigate();
  const handleClick = (i) => {
    navigate(`/${i}`);
    // console.log(i);
  };
  const handleclickNotif = () => {
    setShowUser(true)
    setShowNotif(!showNotif)

  }
  const handleclickProfile = () => {
    setShowNotif(true)
    setShowUser(!showUser)
  }
  const token = localStorage.getItem("token");
  const serviceGetUsery = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `${config.APIURL}/user/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setUserProfileData(response.data.data)
      console.log("🚀 ~ serviceGetUsery ~ response.data.data:", response.data)
      console.log("🚀 ~ serviceGetUsery ~ userProfileData:", userProfileData)

    } catch (error) {
      console.log("Error fetching schedule", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }


  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token:", storedToken);

    if (storedToken) {
      const dataUser = jwtDecode(storedToken);
      console.log("🚀 ~ useEffect ~ dataUser:", dataUser.picture);
      console.log(dataUser);
      serviceGetUsery(dataUser.user_id)
      if (dataUser.picture) {
        setPicture(dataUser.picture);
      }
    }

  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm bg-white border-bottom fixed-top"
      style={{ height: "50px" }}
    >
      {showUser ? <></> : <div className="position-fixed top-0 end-0" style={{ marginTop: "34px", marginRight: "20px" }}> <DetailUserCard user={userProfileData} /></div>}
      {showNotif ? <></> : <NotificationCard notifications={notificationsData} />}
      <div className="container-fluid px-4 d-flex align-items-center">
        <img
          src={logo}
          alt="Profile"
          style={{
            width: "40px",
            height: "30px",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />

        {/* Menu Tengah */}
        <div className="d-flex flex-grow-1 justify-content-center">
          <ul className="navbar-nav d-flex flex-row gap-5">
            {["Home", "Course", "Contact"].map((item, index) => (
              <li className="nav-item" key={index}>
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: activeIndex === index ? "white" : colors.primary,
                    backgroundColor:
                      activeIndex === index ? colors.primary : "transparent",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    transition: "all 0.3s ease-in-out",
                    fontWeight: "600",
                  }}
                  onClick={(e) => {
                    if (item == "Home") {
                      handleClick("");
                      setActiveIndex(index);
                    }else{
                      handleClick(item);
                      setActiveIndex(index);
                    }

                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Search dan Button */}
        <div className="d-flex align-items-center gap-3">


          {/* Tombol Masuk & Daftar */}

          {token ? (
            <>
              
              <img
                src={notif}
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "25px",
                  height: "25px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={handleclickNotif}
              />
              <button
                className="btn d-flex align-items-center  text-white"
                style={{ height: "32px", backgroundColor: colors.primary }}
                onClick={() => handleClick("my-courses")}
              >
                My Course
              </button>
              <img
                src={picture ? picture : defaultPicture}
                alt="Profile"
                className="rounded-circle"
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={handleclickProfile}
              />

            </>
          ) : (<>
            <button
              className="btn d-flex align-items-center rounded-pill text-white px-3"
              style={{ height: "28px", backgroundColor: colors.primary }}
              onClick={(e) => {
                e.preventDefault();
                handleClick("register");
              }}
            >
              Daftar
            </button>
            <button
              className="btn d-flex align-items-center rounded-pill text-white px-3"
              style={{ height: "28px", backgroundColor: colors.primary }}
              onClick={(e) => {
                e.preventDefault();
                handleClick("login");
              }}
            >
              Masuk
            </button></>)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
