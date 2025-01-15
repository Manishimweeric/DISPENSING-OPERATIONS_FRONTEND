import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="p-4 flex justify-between items-center border-b">
        <div className="text-green-500 text-xl font-semibold">Source Oil.</div>
        <div className="flex gap-4 items-center">
          <a href="#" className="hover:text-green-500">Home</a>
          <a href="#" className="hover:text-green-500">About</a>
          <a href="#" className="hover:text-green-500">Contact us</a>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-green-50 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to FuelOps Pro</h1>
          <p className="text-green-500 mb-4">Efficient. Reliable. Innovative.</p>
          <p className="text-gray-600 mb-6">
            Software solution designed to optimize and streamline fuel dispensing
            operations for Source Oil Limited in Rwanda
          </p>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
            Register →
          </button>
        </div>
        <div className="mt-8 md:mt-0">
          <img 
            src="image/home.png" 
            alt="Fuel dispenser"
            className="w-64 h-64 object-contain"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 p-8 md:p-16">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-12">WHO WE ARE</h2>
        <p className="text-center max-w-3xl mx-auto mb-12">
          FuelOps is a leading solution for managing fuel operations. It streamlines inventory
          control, fuel distribution, and logistics. FuelOps has set the industry standard for
          efficiency and reliability
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {item === 1 && <div className="text-red-500">🚀</div>}
                {item === 2 && <div className="text-red-500">☀️</div>}
                {item === 3 && <div className="text-red-500">360°</div>}
              </div>
              <p className="text-center">
                FuelOps has set the industry standard for efficiency and reliability
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
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

      {/* Footer */}
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