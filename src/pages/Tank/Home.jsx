import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API_URL = "http://localhost:8000/api/orders/"; // Django API URL

const HomeApp = () => {
  const [level, setLevel] = useState(0);
  const [toast, setToast] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false); // Prevent multiple requests
  const userStationId = localStorage.getItem('station');
  const useremail = localStorage.getItem('email');

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_level");
        setLevel(response.data.level || 0);
      } catch (error) {
        console.error("Error fetching water level:", error);
      }
    };

    fetchLevel();

    socket.on("update_level", (data) => {
      setLevel(data.level);
      
      if (data.level > 90) {
        showToast("Tank is nearly full!", "info");
      } else if (data.level < 10) {
        showToast("Tank is almost empty!", "warning");
      } else if (data.level === 20 && !orderCreated) {
        createOrder();  // Call order creation when level is 30%
      }
    });

    return () => {
      socket.off("update_level");
    };
  }, [orderCreated]); // Ensure `orderCreated` prevents multiple calls

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const createOrder = async () => {
    try {
      const orderData = {
        name: "Auto Generated Order",
        oil_type: "Diesel",
        station: userStationId, 
        email: useremail,
      };

      const response = await axios.post(API_URL, orderData, {
        headers: { "Content-Type": "application/json" },
      });

      const Orderresponse = await fetch(`${API_URL}/send-Order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: useremail }),
      });


      if (response.status === 201) {
        showToast("Order created successfully!", "success");
        setOrderCreated(true);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      showToast("Failed to create order", "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl" style={{ textAlign: "center" }}>Welcome to Fuel Tank Level Monitor</h1>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>

        <Chart
          className="text-xl"
          chartType="Gauge"
          width="500px"
          height="350px"
          font-size="10px"
          data={[["Label", "Value"], ["Water Level", level]]}
          options={{
            width: 600,
            height: 350,
            redFrom: 0,
            redTo: 30,
            yellowFrom: 30,
            yellowTo: 60,
            greenFrom: 60,
            greenTo: 100,
            minorTicks: 5,
          }}
        />

        <div style={{ position: "relative", width: "160px", height: "400px", background: "#ddd", borderRadius: "10px", border: "2px solid #000", overflow: "hidden" }}>
          <div style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: `${level}%`,
            backgroundColor: level > 60 ? "#0000FF" : level > 30 ? "#1E90FF" : "#87CEFA",
            transition: "height 0.3s, background-color 0.3s",
          }} />
        </div>
      </div>

      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px",
          background: toast.type === "info" ? "#17a2b8" : toast.type === "warning" ? "#ffc107" : "#dc3545",
          color: "#fff",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default HomeApp;
