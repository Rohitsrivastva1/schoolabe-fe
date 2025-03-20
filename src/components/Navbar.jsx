import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Schoolabe</Link>

        <div className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>

        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)}>Courses</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/code" onClick={() => setMenuOpen(false)}>Code Editor</Link>
        </div>

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
                  <Link to="/change-password" onClick={() => setDropdownOpen(false)}>Forgot Password</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loginButtonPlaceholder}>
              <Link to="/signup" className={styles.loginButton}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;