import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Swal from "sweetalert2";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CustomerRegistrationForm = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState("");
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData.user.email);
      setCustomers(parsedData.user);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message) {
      Swal.fire("Error", "Message field is required", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/customer-responses/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user,
          message: formData.message,
        }),
      });

      if (response.ok) {
        Swal.fire("Success", "Thank you for your response!", "success").then(() => {
          setFormData({ ...formData, message: "" });
        });
      } else {
        Swal.fire("Error", "Unable to send response", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        {/* Logo */}
        <img src="/image/logo.jpg" alt="Logo" className="h-14 w-auto" />


        <h1 className="text-2xl font-bold text-gray-800">
          Welcome <span className="text-yellow-700 ml-5 mr-4">  {customers?.name || "Guest"} </span> to Source Oil Platform
        </h1>


        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 bg-yellow-700 text-white px-4 py-2 rounded-md hover:bg-yellow-800 transition"
          >
            <span>Customer</span>
            <ChevronDown />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden animate-fadeIn">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-6">
            <MdAdd className="text-2xl mr-2 text-green-600" />
            Submit Your Response
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Message Field */}
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-600">
                Your Response
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Type your message here..."
                rows="7"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Response
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistrationForm;
