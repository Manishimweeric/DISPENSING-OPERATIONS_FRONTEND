import React, { useState } from 'react';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';


const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
          {/* Enhanced Navigation */}
          <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex-shrink-0">
                  <div className="text-green-500 text-2xl font-bold tracking-tight">Source Oil</div>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-gray-600 hover:text-green-500 hover:bg-gray-100"
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                  <a href="#" className="text-gray-600 hover:text-green-500 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
                    Home
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-green-500 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
                    About
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-green-500 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
                    Contact us
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </a>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-lg">
                    Login
                  </button>
                </div>
              </div>
              
              {/* Mobile Navigation */}
              <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                  <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-500 hover:bg-gray-50 rounded-md">
                    Home
                  </a>
                  <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-500 hover:bg-gray-50 rounded-md">
                    About
                  </a>
                  <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-500 hover:bg-gray-50 rounded-md">
                    Contact us
                  </a>
                  <button className="w-full mt-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200">
                    Login
                  </button>
                </div>
              </div>
            </div>
          </nav>
    
            {/* Spacer */}
      <div className="h-20"></div>

{/* Modified Hero Section with side-by-side layout */}
<section className="bg-green-50 px-4 py-12 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
      {/* Left side - Text content */}
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
        <button className="bg-green-500 text-white px-8 py-3 text-lg rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg">
          Register →
        </button>
      </div>

      {/* Right side - Image */}
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
      <section className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Let's talk with us</h2>
          <p className="text-gray-600">
            Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-purple-500" />
              <span>1055 Arthur ave Elk Grove, 67. Kigali City Remera Sector.</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-purple-500" />
              <span>+250 678 9108 99</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-purple-500" />
              <span>Contact@moralizer.com</span>
            </div>
          </div>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="John"
              className="border p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border p-2 rounded-md"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded-md w-full"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="border p-2 rounded-md w-full"
          />
          <textarea
            placeholder="Your Message..."
            className="border p-2 rounded-md w-full h-32"
          />
          <button className="bg-green-500 text-white w-full py-3 rounded-md hover:bg-green-600">
            Send Message
          </button>
        </form>
      </section>

      {/* Footer - Unchanged */}
      <footer className="bg-gray-900 text-white p-8 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Source Oil</h3>
            <p className="text-gray-400">
              Leading the way in fuel operations management and distribution.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Fuel Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Distribution</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Logistics</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Kigali, Rwanda</li>
              <li>+250 678 9108 99</li>
              <li>contact@moralizer.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Source Oil. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;