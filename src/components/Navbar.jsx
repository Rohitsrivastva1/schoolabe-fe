import React, { useState } from "react";
import styles from "./Navbar.module.css"; // Use CSS module
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="/" className={styles.logo}>
          Schoolabe
        </a>

        {/* Hamburger Icon (Visible on Mobile) */}
        <div
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
        >
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
      </div>
    </nav>
  );
};

export default Navbar;
