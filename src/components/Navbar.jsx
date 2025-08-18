import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="text-gradient">Schoolabe</span>
        </Link>
  
        <div className="navbar-nav">
           {["Home", "About", "Courses", "Contact", "Practise code"].map((item, index) => {
             const path = item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "")}`;
             return (
               <Link
                 key={index}
                 to={path}
                 className="nav-link"
               >
                 {item}
               </Link>
             );
           })}
        </div>

        <div className="navbar-right">
          {/* Cart Icon */}
          <Link to="/cart" className="nav-link cart-link">
            <FaShoppingCart className="cart-icon" />
            {getCartCount() > 0 && (
              <span className="cart-badge">
                {getCartCount()}
              </span>
            )}
          </Link>

          {user ? (
            <div className="user-menu">
              <div
                className="user-avatar"
                onClick={toggleDropdown}
              >
                {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/edit-profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Edit Profile
                  </Link>
                  <Link to="/progress" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Progress
                  </Link>
                  <Link to="/forgot-password" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Forgot Password
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Link to="/signup" className="login-btn">
                Log in
              </Link>
              <Link to="/signup" className="get-started-btn">
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
