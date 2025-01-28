import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // Update this with the correct Flask server URL

const HomeApp = () => {
  const [level, setLevel] = useState(0); // Water level state
  const [toast, setToast] = useState(null); // Toast message state

  useEffect(() => {
    // Fetch the initial level from the Flask server
    const fetchLevel = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_level");
        setLevel(response.data.level || 0);
      } catch (error) {
        console.error("Error fetching water level:", error);
      }
    };

    fetchLevel();

    // Listen to WebSocket for real-time updates
    socket.on("update_level", (data) => {
      setLevel(data.level);
      if (data.level > 90) {
        showToast("Tank is nearly full!", "info");
      } else if (data.level < 10) {
        showToast("Tank is almost empty!", "warning");
      }
    });

    return () => {
      socket.off("update_level");
    };
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const gaugeOptions = {
    width: 600,
    height: 350,
    redFrom: 0,
    redTo: 30,
    yellowFrom: 30,
    yellowTo: 60,
    greenFrom: 60,
    greenTo: 100,
    minorTicks: 5,
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Water Level Monitor</h1>

      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {/* Google Gauge */}
        <Chart
          chartType="Gauge"
          width="600px"
          height="350px"
          data={[
            ["Label", "Value"],
            ["Water Level", level],
          ]}
          options={gaugeOptions}
        />

        {/* Tank Simulation */}
        <div
          style={{
            position: "relative",
            width: "160px",
            height: "400px",
            background: "#ddd",
            borderRadius: "10px",
            border: "2px solid #000",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: `${level}%`,
              backgroundColor: level > 60 ? "#0000FF" : level > 30 ? "#1E90FF" : "#87CEFA",
              transition: "height 0.3s, background-color 0.3s",
            }}
          />
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px",
            background: toast.type === "info" ? "#17a2b8" : toast.type === "warning" ? "#ffc107" : "#dc3545",
            color: "#fff",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default HomeApp;
