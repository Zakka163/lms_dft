import { useEffect, useState } from "react";
import colors from "../../helper/colors";
import { config } from "../../config";
import axios from "axios";
import { errorNotify, successNotify } from "../../helper/toast";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
function Jadwal() {
  const [daySelected, setDaySelected] = useState("Senin");
  const [dataJadwal, setDataJadwal] = useState([]);
  let token = localStorage.getItem("token");
  useEffect(() => {

  }, [])
  const servicefetchAll = async () => {
    if (!token) {
      errorNotify("Token not found");
      return;
    }

    try {
      const response = await axios.get(
        `${config.APIURL}/ms_schedule/list?hari=${daySelected}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      setDataJadwal(response.data.data);
    } catch (error) {
      console.log("Error fetching schedule", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      }
    }
  };
  const serviceUpdate = async (value) => {
    console.log(value);

    const token = localStorage.getItem("token");

    if (!token) {
      errorNotify("Token not found");
      return;
    }

    try {
      const response = await axios.post(
        `${config.APIURL}/ms_schedule/update/${value.ms_schedule_id}`,
        {
          status: !value.status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      successNotify("Berhasil Ubah status")
      servicefetchAll(); // Re-fetch data after update
    } catch (error) {
      console.log("Error updating schedule", error);
      if (error.response?.status === 401) {
        errorNotify("Access Denied");
      }
      if (error.response?.status === 404) {
        errorNotify("Data not found");
      } else {
        errorNotify("An error occurred while updating the schedule");
      }
    }
  };


  const handleDaySelected = (valueDay) => {
    console.log(valueDay);
    setDaySelected(valueDay);
  };
  const handleSwitch = (value) => {
    serviceUpdate(value)
  };

  useEffect(() => {
    servicefetchAll();
  }, [daySelected]);

  return (
    <motion.div
      className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: colors.background }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      // className="dropdown-menu show position-absolute end-0 mt-2 shadow bg-white rounded d-grid"
      // style={{ width: "400px", position: "relative" }}
    >
      <ToastContainer />
      <div
        className="bg-white shadow-lg d-flex flex-column"
        style={{
          width: "95%",
          height: "95%",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        {/* Container Tombol Hari */}
        <div
          className="d-flex justify-content-center align-items-center flex-wrap"
          style={{
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(
            (item, index) => (
              <div
                key={index}
                className="rounded-pill d-flex justify-content-center align-items-center"
                style={{
                  width: "100px",
                  height: "40px",
                  border: `2px solid ${colors.primary}`,
                  color: item === daySelected ? "white" : colors.primary,
                  fontWeight: "bold",
                  backgroundColor: item === daySelected ? colors.primary : "transparent",
                  cursor: "pointer",
                  transition: "0.3s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => handleDaySelected(item)}
              >
                {item}
              </div>
            )
          )}
        </div>
        <div
          className="flex-grow-1 p-4 overflow-auto"
          style={{
            borderRadius: "10px",
            backgroundColor: colors.bg_2,
            padding: "20px",
          }}
        >
          {dataJadwal.map((i, j) => (
            <div
              key={j}
              className="d-flex justify-content-between align-items-center mb-3 p-3 rounded shadow-sm"
              style={{
                backgroundColor: "white",
                color: "#333",
                fontWeight: "bold",
                transition: "0.3s",
                border: "1px solid #ddd",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)")
              }
            >
              <span style={{ marginLeft: "20px" }}>
                {`${i.jam_awal} - ${i.jam_akhir}`}
              </span>
              <label className="switch" style={{ marginRight: "20px" }}>
                <input type="checkbox" checked={i.status} onChange={() => { handleSwitch(i) }} />
                <span className="slider"></span>
              </label>
            </div>
          ))}

          <style>
            {`
              .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
              }
              .switch input {
                opacity: 0;
                width: 0;
                height: 0;
              }
              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.3s;
                border-radius: 20px;
              }
              .slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
              }
              input:checked + .slider {
                background-color: #4CAF50;
              }
              input:checked + .slider:before {
                transform: translateX(20px);
              }
            `}
          </style>
        </div>
      </div>
    </motion.div>
  );
}

export default Jadwal;
