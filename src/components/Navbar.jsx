import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Simulating API call to check if user is logged in
  useEffect(() => {
    axios.get("http://localhost:5000/auth/me")
      .then((response) => {
        console.log(response);
        
        if (response.data.success) {
          console.log(response.data.user.name);
          setUser(response.data.user); // { name: "Rohit Srivastava", email: "rohit@example.com" }
        }
      })
      .catch(() => setUser(null));
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleLogout = () => {
    axios.post("http://localhost:5000/auth/logout").then(() => {
      setUser(null);
      setDropdownOpen(false);
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Schoolabe</Link>

        {/* Hamburger Icon (Mobile) */}
        <div className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>

        {/* Navigation Links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/code" onClick={() => setMenuOpen(false)}>Code Editor</Link>
        </div>

        {/* Profile / Login Button */}
        <div className={styles.profileSection}>
          {user ? (
            <div className={styles.profileContainer} onClick={toggleDropdown}>
              <div className={styles.profileIcon}>
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/edit-profile" onClick={() => setDropdownOpen(false)}>Edit Profile</Link>
                  <Link to="/progress" onClick={() => setDropdownOpen(false)}>Progress</Link>
                  <Link to="/forgot-password" onClick={() => setDropdownOpen(false)}>Forgot Password</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup" className={styles.loginButton}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
