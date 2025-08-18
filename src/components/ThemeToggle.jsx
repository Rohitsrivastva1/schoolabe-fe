import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="toggle-container">
        <div className={`toggle-icon ${isDark ? 'moon' : 'sun'}`}>
          {isDark ? (
            <FaMoon className="icon" />
          ) : (
            <FaSun className="icon" />
          )}
        </div>
        <div className="toggle-track">
          <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`} />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
