import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';


const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col mt-20">
      <section className="bg-green-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="w-full md:w-1/2 space-y-6 text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Welcome to FuelOps Pro
              </h1>
              <p className="text-green-500 text-xl">Efficient. Reliable. Innovative.</p>
              <div className="space-y-4 text-gray-600">
                <p>
                  Transform your fuel operations with our cutting-edge software solution, designed to revolutionize
                  how Source Oil Limited manages fuel dispensing in Rwanda.
                </p>
                <p>
                  From real-time monitoring to advanced analytics, FuelOps Pro ensures seamless operation of your
                  fuel distribution network. Experience enhanced control, reduced waste, and optimized delivery
                  schedules all in one comprehensive platform.
                </p>
              </div>
              <Link to="/login">
                <button className="bg-yellow-600 mt-5 text-white px-8 py-3 text-lg rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg">
                  Login →
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                <img
                  src="image/home.png"
                  alt="Fuel dispenser"
                  className="relative w-full h-auto transform hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Improved About Section with Responsive Heights */}
      <section className="bg-gray-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-500 mb-12">WHO WE ARE</h2>
          <p className="text-center max-w-4xl mx-auto mb-12 text-lg text-gray-600">
            FuelOps is a leading solution for managing fuel operations, streamlining inventory
            control, fuel distribution, and logistics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🚀",
                title: "Innovation in Motion",
                description: "Leading the industry with cutting-edge fuel management technology. Our innovative solutions optimize every aspect of fuel operations."
              },
              {
                icon: "☀️",
                title: "Operational Excellence",
                description: "Transform your fuel operations with our comprehensive management solutions. We provide real-time monitoring and automated inventory management."
              },
              {
                icon: "360°",
                title: "Complete Solution",
                description: "Experience comprehensive fuel management with our 360-degree approach. From supply chain optimization to demand forecasting."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6 sm:p-8 h-[250px] md:h-[300px] lg:h-[350px] flex flex-col">
                  <div className="flex justify-center mb-4">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-800">{item.title}</h3>
                  <p className="text-center text-gray-600 flex-grow">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Unchanged */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Let's talk with us</h2>
                <p className="text-gray-600">
                  Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MapPin className="text-green-500 w-5 h-5" />
                    </div>
                    <span className="text-gray-700">1055 Arthur ave Elk Grove, 67. Kigali City Remera Sector.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="text-green-500 w-5 h-5" />
                    </div>
                    <span className="text-gray-700">+250 678 9108 99</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Mail className="text-green-500 w-5 h-5" />
                    </div>
                    <span className="text-gray-700">Contact@moralizer.com</span>
                  </div>
                </div>
              </div>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
                <textarea
                  placeholder="Your Message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all h-32 resize-none"
                />
                <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default App;