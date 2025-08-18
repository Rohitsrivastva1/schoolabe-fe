import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaPlay,
  FaArrowRight,
  FaCheck,
  FaBrain,
  FaHeadset,
  FaPython,
  FaDatabase,
  FaChartLine,
  FaServer
} from "react-icons/fa";
import "./Home.css";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Schoolabe - Master Python Programming & Data Science</title>
        <meta name="description" content="Learn Python programming, data science, web development with Django & FastAPI, machine learning, and AI. Interactive courses with real-world projects." />
        <meta name="keywords" content="python, data science, django, fastapi, machine learning, AI, programming, web development, courses, tutorials" />
      </Helmet>
      
      <div className="homepage">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="hero-badge">
                  <FaPython />
                  <span>🐍 New: Advanced Python Data Science Course</span>
                </div>
                <h1 className="hero-title">
                  Master Python Programming & Data Science
                </h1>
                <p className="hero-description">
                  Learn Python programming, data science, machine learning, and web development with Django & FastAPI. Build real-world projects and become a Python expert.
                </p>
                <div className="hero-features">
                  <div className="hero-feature">
                    <FaCheck />
                    <span>500+ Python Interactive Lessons</span>
                  </div>
                  <div className="hero-feature">
                    <FaCheck />
                    <span>Data Science & ML Projects</span>
                  </div>
                  <div className="hero-feature">
                    <FaCheck />
                    <span>Django & FastAPI Web Development</span>
                  </div>
                </div>
                <div className="hero-buttons">
                  <Link to="/courses" className="btn btn-primary">
                    <FaPlay />
                    Start Learning Python
                  </Link>
                  <Link to="/about" className="btn btn-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hero-visual">
                <div className="code-animation">
                  <div className="code-header">
                    <div className="code-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="code-filename">main.py</div>
                  </div>
                  <div className="code-content">
                    <div className="code-line">
                      <span className="code-keyword">import</span> <span className="code-variable">pandas</span> <span className="code-keyword">as</span> <span className="code-variable">pd</span>
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">from</span> <span className="code-variable">fastapi</span> <span className="code-keyword">import</span> <span className="code-variable">FastAPI</span>
                    </div>
                    <div className="code-line">
                      <span className="code-variable">app</span> = <span className="code-variable">FastAPI</span>()
                    </div>
                    <div className="code-line">
                      <span className="code-keyword">def</span> <span className="code-variable">analyze_data</span>():
                    </div>
                    <div className="code-line">
                      <span className="code-comment">{'# Start your Python journey today!'}</span>
                    </div>
                                         <div className="code-line">
                       <span className="code-keyword">return</span> <span className="code-string">"Success!"</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">15K+</div>
                <div className="stat-label">Python Developers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">300+</div>
                <div className="stat-label">Python Lessons</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">80+</div>
                <div className="stat-label">Data Science Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Why Choose Schoolabe for Python?</h2>
              <p className="section-description">
                Comprehensive Python learning platform designed to take you from beginner to expert Python developer
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaPython />
                </div>
                <h3>Python Fundamentals</h3>
                <p>Master Python syntax, data structures, OOP, and advanced concepts with hands-on exercises</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <h3>Data Science & ML</h3>
                <p>Learn pandas, numpy, scikit-learn, and build machine learning models from scratch</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaServer />
                </div>
                <h3>Web Development</h3>
                <p>Build modern web applications with Django and FastAPI frameworks</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaDatabase />
                </div>
                <h3>Database Integration</h3>
                <p>Work with SQL databases, MongoDB, and Redis in Python applications</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaBrain />
                </div>
                <h3>AI & Deep Learning</h3>
                <p>Explore TensorFlow, PyTorch, and build neural networks for AI applications</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <FaHeadset />
                </div>
                <h3>Expert Python Mentors</h3>
                <p>Learn from industry professionals with years of Python development experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Courses Section */}
        <section className="latest-courses-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Latest Python Courses</h2>
              <p className="section-description">
                Explore our most popular and latest Python programming courses
              </p>
            </div>
            <div className="courses-grid">
              <div className="course-card">
                <div className="course-image">
                  <div className="course-overlay">
                    <FaPython />
                  </div>
                </div>
                <div className="course-content">
                  <div className="course-badge">Popular</div>
                  <h3>Complete Python Programming Bootcamp</h3>
                  <p>Master Python from basics to advanced. Learn data structures, OOP, decorators, generators, and build real-world applications.</p>
                  <div className="course-meta">
                    <span>30 Lessons</span>
                    <span>•</span>
                    <span>15 Hours</span>
                  </div>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image">
                  <div className="course-overlay">
                    <FaChartLine />
                  </div>
                </div>
                <div className="course-content">
                  <div className="course-badge">New</div>
                  <h3>Data Science with Python</h3>
                  <p>Learn pandas, numpy, matplotlib, seaborn, and scikit-learn. Build data analysis and machine learning projects.</p>
                  <div className="course-meta">
                    <span>25 Lessons</span>
                    <span>•</span>
                    <span>12 Hours</span>
                  </div>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image">
                  <div className="course-overlay">
                    <FaServer />
                  </div>
                </div>
                <div className="course-content">
                  <div className="course-badge">Hot</div>
                  <h3>Django & FastAPI Web Development</h3>
                  <p>Build modern web applications with Django and FastAPI. Learn REST APIs, authentication, and deployment.</p>
                  <div className="course-meta">
                    <span>20 Lessons</span>
                    <span>•</span>
                    <span>10 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Master Python Programming?</h2>
              <p>
                Join thousands of developers who have transformed their careers with Python. 
                Start learning today and build the future with Python's power.
              </p>
              <div className="cta-buttons">
                <Link to="/courses" className="btn btn-primary">
                  <FaArrowRight />
                  Explore Python Courses
                </Link>
                <Link to="/signup" className="btn btn-secondary">
                  Get Started Free
                </Link>
              </div>
              <div className="cta-features">
                <div className="cta-feature">
                  <FaCheck />
                  <span>Free Python Trial Available</span>
                </div>
                <div className="cta-feature">
                  <FaCheck />
                  <span>No Credit Card Required</span>
                </div>
                <div className="cta-feature">
                  <FaCheck />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
