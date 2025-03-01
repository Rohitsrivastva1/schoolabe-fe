import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Master Programming with Expert-Led Tutorials</h1>
          <p>
            Learn Python, JavaScript, Data Structures & Algorithms, Web
            Development, and more.
          </p>
          <div className="buttons">
            <Link to="/courses" className="btn primary-btn">
              Explore Courses
            </Link>
            <Link to="/join-us" className="btn secondary-btn">
              Join Us
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="features">
        <h2>Why Learn With Us?</h2>
        <div className="feature-list">
          <div className="feature-card">
            <h3>Interactive Coding</h3>
            <p>Write, run, and test your code in real-time with our built-in compiler.</p>
          </div>
          <div className="feature-card">
            <h3>Real-World Projects</h3>
            <p>Build practical projects, from scripts to full-stack apps.</p>
          </div>
          <div className="feature-card">
            <h3>Job-Ready Curriculum</h3>
            <p>Ace coding interviews with structured courses and hands-on problem-solving.</p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="course-categories">
        <h2>Popular Categories</h2>
        <div className="category-list">
          <Link to="/courses/python" className="category-card">
            Python
          </Link>
          <Link to="/courses/javascript" className="category-card">
            JavaScript
          </Link>
          <Link to="/courses/java" className="category-card">
            Java
          </Link>
          <Link to="/courses/dsa" className="category-card">
            Data Structures & Algorithms
          </Link>
          <Link to="/courses/web" className="category-card">
            Web Development
          </Link>
        </div>
      </section>

      {/* Community & Support */}
      <section className="community">
        <h2>Join Our Developer Community</h2>
        <p>Connect with like-minded learners, get support, and grow together.</p>
        <Link to="/contact" className="btn primary-btn">
          Get in Touch
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
