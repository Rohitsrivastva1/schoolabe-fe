import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-[#0d1117] text-white shadow-md fixed top-0 left-0  z-50">
    <div className="w-full h-16 flex items-center justify-between px-0 sm:px-2 md:px-4">
      <Link to="/" className="text-xl font-bold text-white hover:text-gray-300">
        Schoolabe
      </Link>
  
      <div className="flex items-center space-x-6">
        {["Home", "About", "Courses", "Contact", "Practise code"].map((item, index) => (
          <Link
            key={index}
            to={`/${item.toLowerCase().replace(" ", "")}`}
            className="text-sm hover:text-gray-300 transition"
          >
            {item}
          </Link>
        ))}
        
        {/* Cart Icon */}
        <Link to="/cart" className="relative text-sm hover:text-gray-300 transition">
          <FaShoppingCart className="text-xl" />
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartCount()}
            </span>
          )}
        </Link>
  
        {user ? (
          <div className="relative">
            <div
              className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer select-none"
              onClick={toggleDropdown}
            >
              {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
                <Link to="/edit-profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Edit Profile</Link>
                <Link to="/progress" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Progress</Link>
                <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Forgot Password</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signup"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  </nav>
    
  );
};

export default Navbar;
