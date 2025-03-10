import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, setUser, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [updatedUser, setUpdatedUser] = useState(user);


  useEffect(() => {
    fetchUser(); // Ensure user state updates when Navbar mounts
  }, []);


  // Update local user state when user context changes
  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  // Toggle Mobile Menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Toggle Profile Dropdown
  const toggleProfileMenu = () => setProfileOpen(!profileOpen);

  // Close Profile Dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setUpdatedUser(null); // Ensure UI updates instantly
      navigate("/signup");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Schoolabe</Link>

        <div 
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`} 
          onClick={toggleMenu}
        >
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

        <div className={styles.authSection} ref={profileRef}>
          {updatedUser ? (
            <div className={styles.profileSection} onClick={toggleProfileMenu}>
              <div className={styles.profileIcon}>
                {updatedUser.name.split(" ").map((word) => word.charAt(0).toUpperCase()).join("")}
              </div>
              {profileOpen && (
                <div className={styles.profileDropdown}>
                  <Link to="/profile">Profile</Link>
                  <Link to="/change-password">Change Password</Link>
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
