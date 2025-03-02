import React, { useState } from "react";
import styles from "./Navbar.module.css"; // Use CSS module

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
          <a href="/" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="/courses" onClick={() => setMenuOpen(false)}>Courses</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href="/code" onClick={() => setMenuOpen(false)}>Code Editor</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
