import React from "react";
import { Link } from "react-router-dom";
import "./Courses.css";

const Courses = () => {
  return (
    <div className="courses">
      <h1>Our Courses – Learn Programming & Land Your Dream Job</h1>
      <p>
        Master <strong>Python, JavaScript, Java, Data Structures & Algorithms, Web Development</strong>, and more with expert-led tutorials.
      </p>

      <div className="course-list">
        <div className="course-card">
          <h2>🐍 Python for Beginners to Advanced</h2>
          <p>Master Python programming with real-world projects, data science, and automation.</p>
          <Link to="/courses/python" className="btn secondary-btn">
            View Course
          </Link>
        </div>

        <div className="course-card">
          <h2>⚡ JavaScript – Frontend & Backend Development</h2>
          <p>Learn JavaScript, ES6, React, Node.js & full-stack development.</p>
          <Link to="/courses/javascript" className="btn secondary-btn">
            View Course
          </Link>
        </div>

        <div className="course-card">
          <h2>☕ Java Programming & System Design</h2>
          <p>Master Java, OOP, and system design for high-paying software jobs.</p>
          <Link to="/courses/java" className="btn secondary-btn">
            View Course
          </Link>
        </div>

        <div className="course-card">
          <h2>🧩 Data Structures & Algorithms</h2>
          <p>Crack coding interviews with optimized DSA solutions and problem-solving techniques.</p>
          <Link to="/courses/dsa" className="btn secondary-btn">
            View Course
          </Link>
        </div>

        <div className="course-card">
          <h2>🌐 Web Development (HTML, CSS, JavaScript, React, Node.js)</h2>
          <p>Build responsive, full-stack web applications with hands-on projects.</p>
          <Link to="/courses/web" className="btn secondary-btn">
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Courses;
