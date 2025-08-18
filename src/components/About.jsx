import React from "react";
import "./About.css";
import { Helmet } from "react-helmet-async"; // Use react-helmet-async
// Removed unused heroImg import

const About = () => {
  return (

    
    <div className="aboutUs">


      <Helmet>
        <title>About Us - Schoolabe Python Learning Platform</title>
        <meta name="description" content="Learn about Schoolabe, our mission to teach Python programming, data science, and web development with expert-led courses." />
        <meta name="keywords" content="Schoolabe, Python, data science, Django, FastAPI, machine learning, programming, learn Python" />
        <meta name="robots" content="index, follow" />
      </Helmet>


    {/* Hero Section */}
    <section className="aboutHero">
      <h1>Empowering Python Developers Worldwide</h1>
      <p>
        At <strong>Schoolabe</strong>, we believe Python is the future of programming. Our mission is to transform beginners into confident Python developers, data scientists, and AI engineers through comprehensive, hands-on learning experiences.
      </p>
    </section>

    {/* Mission Section */}
    <section className="aboutSection">
      <h2>Our Mission</h2>
      <p>
        We're dedicated to making Python programming accessible to everyone. Whether you're a complete beginner or an experienced developer looking to specialize in data science, machine learning, or web development, we provide the structured learning path you need to succeed in the Python ecosystem.
      </p>
    </section>

    {/* Why Choose Us */}
    <section className="aboutSection">
      <h2>Why Choose Schoolabe for Python?</h2>
      <p>
        We make Python programming <strong>simple, structured, and career-focused</strong>.
        Our curriculum is designed by industry experts who understand what it takes to succeed in Python development, data science, and AI roles.
      </p>
    </section>

    {/* What We Offer */}
    <section className="offerings">
      <h2>💡 What We Offer</h2>
      <div className="offerList">
        {[
          { 
            title: "🐍 Complete Python Mastery", 
            text: "From Python basics to advanced concepts like decorators, generators, async programming, and design patterns. Master the language that powers AI, data science, and modern web applications." 
          },
          { 
            title: "📊 Data Science & Machine Learning", 
            text: "Learn pandas, numpy, matplotlib, seaborn, scikit-learn, and TensorFlow. Build real-world data analysis projects and machine learning models from scratch." 
          },
          { 
            title: "🌐 Modern Web Development", 
            text: "Master Django and FastAPI frameworks. Build REST APIs, full-stack applications, and deploy them to production. Learn database integration with PostgreSQL and MongoDB." 
          },
          { 
            title: "🤖 AI & Deep Learning", 
            text: "Explore TensorFlow, PyTorch, and advanced AI concepts. Build neural networks, computer vision models, and natural language processing applications." 
          },
          { 
            title: "🛠️ DevOps & Deployment", 
            text: "Learn Docker, CI/CD pipelines, cloud deployment (AWS, Azure, GCP), and production-ready Python applications with best practices." 
          },
          { 
            title: "💼 Career Support", 
            text: "Get interview preparation, resume building, portfolio development, and job placement assistance. Connect with our network of Python professionals." 
          }
        ].map((item, index) => (
          <div key={index} className="offerCard">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Learning Paths */}
    <section className="aboutSection">
      <h2>Python Learning Paths</h2>
      <div className="learningPaths">
        <div className="pathCard">
          <h3>Python Developer Path</h3>
          <ul>
            <li>Python Fundamentals & OOP</li>
            <li>Web Development with Django/FastAPI</li>
            <li>Database Design & ORM</li>
            <li>Testing & Debugging</li>
            <li>Deployment & DevOps</li>
          </ul>
        </div>
        <div className="pathCard">
          <h3>Data Scientist Path</h3>
          <ul>
            <li>Python for Data Analysis</li>
            <li>Statistical Analysis & Visualization</li>
            <li>Machine Learning Fundamentals</li>
            <li>Deep Learning & Neural Networks</li>
            <li>Big Data & Cloud Computing</li>
          </ul>
        </div>
        <div className="pathCard">
          <h3>AI Engineer Path</h3>
          <ul>
            <li>Advanced Python Programming</li>
            <li>Mathematics for AI</li>
            <li>Computer Vision & NLP</li>
            <li>Model Deployment & MLOps</li>
            <li>Research & Innovation</li>
          </ul>
        </div>
      </div>
    </section>

    {/* Success Stories */}
    <section className="aboutSection">
      <h2>Success Stories</h2>
      <p>
        Join <strong>15,000+ Python developers</strong> who have transformed their careers with Schoolabe. 
        Our graduates work at top companies like Google, Microsoft, Amazon, and innovative startups worldwide.
      </p>
    </section>

    {/* Call to Action */}
    <section className="cta">
      <h2>🎯 Ready to Master Python Programming?</h2>
      <p>Start your Python journey today and join the community of developers building the future with Python's power.</p>
      <a href="/join-us" className="primaryBtn">Start Learning Python</a>
    </section>
  </div>
  );
};

export default About;
