  import React from "react";
  import { Link } from "react-router-dom";
  import "./Home.css";
  import { Typewriter } from "react-simple-typewriter";
  import "./Home.css";
  import codeGif from "../assets/code-typing.gif"; 
  import SEO from "../components/SEO";

  const HomePage = () => {
    return (
      <div>
        {/* Hero Section */}
        <SEO
        title="Learn to Code | Schoolabe"
        description="Master programming with interactive courses at Schoolabe."
        keywords="coding, programming, courses, react, javascript"
        url="https://www.schoolabe.com"
      />
        <div className="hero-section">
          <div className="hero-content">
            <h1>
              Write, Run & Master  
              <br></br>
              <span className="typing-effect">
                <Typewriter
                  words={[" JavaScript.", " Python.", " C++.", " DSA.", " Web Dev."]}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </span>
            </h1>
            <p>Code in real-time with our interactive editor. Learn, practice, and ace coding interviews.</p>
            <div className="buttons">
              <Link to="/code" className="btn primary-btn1">
                Try Code Editor
              </Link>
              <Link to="/courses" className="btn secondary-btn1">
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Right Side: GIF or Animation */}
          <div className="hero-image">
            <img src={codeGif} alt="Live Coding" />
          </div>
        </div>

        {/* Other Sections */}
        {/* Keep your existing Features, Categories, Community sections here */}
      {/* </div> */}

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
