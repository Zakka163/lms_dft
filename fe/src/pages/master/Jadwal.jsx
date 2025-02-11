import { useState } from "react";
import colors from "../../helper/colors";

function Jadwal({ title = "Jadwal" }) {
  const [daySelected, setDaySelected] = useState(null);
  const [schedule, setSchedule] = useState(Array(10).fill(false));

  const handleDaySelected = (valueDay) => {
    setDaySelected(valueDay);
  };

  const toggleSchedule = (index) => {
    setSchedule((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div
      className="vh-100 flex-grow-1 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className=" bg-white shadow-lg d-flex flex-column"
        style={{
          width: "95%",
          height: "95%",
          borderRadius: "15px",
          padding: "20px",
        }}
      >
        {/* ✅ Container Tombol Hari */}
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
                  backgroundColor:
                    item === daySelected ? colors.primary : "transparent",
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

        {/* ✅ Container List Jadwal */}
        <div
          className="flex-grow-1 p-4 overflow-auto"
          style={{
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
            padding: "20px",
          }}
        >
          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-3 p-3 rounded shadow-sm"
              style={{
                backgroundColor: "white",
                color: "#333",
                fontWeight: "bold",
                transition: "0.3s",
                border: "1px solid #ddd",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)")
              }
            >
              <span style={{ marginLeft: "20px" }}>
                {`${hour}:00 - ${hour + 1}:00`}
              </span>
              <label className="switch" style={{ marginRight: "20px" }}>
                <input
                  type="checkbox"
                  checked={schedule[index]}
                  onChange={() => toggleSchedule(index)}
                />
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
    </div>
  );
}

export default Jadwal;
