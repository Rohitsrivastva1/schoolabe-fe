import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaDiscord,
  FaClock
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-us">
      <h1>Contact Our Python Experts</h1>
      <p>Have questions about Python programming, data science courses, or need help with your learning journey? Our team of Python professionals is here to help you succeed. Fill out the form below, and we'll get back to you within 24 hours.</p>

      <div className="contact-container">
        {/* Contact Form */}
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input type="text" id="name" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input type="email" id="email" placeholder="Enter your email address" required />
          </div>

          <div className="form-group">
            <label htmlFor="subject">What can we help you with? *</label>
            <select id="subject" required>
              <option value="">Select a topic</option>
              <option value="python-basics">Python Basics Course</option>
              <option value="data-science">Data Science & Machine Learning</option>
              <option value="web-development">Django & FastAPI Web Development</option>
              <option value="ai-deep-learning">AI & Deep Learning</option>
              <option value="devops-deployment">DevOps & Deployment</option>
              <option value="career-guidance">Career Guidance & Job Placement</option>
              <option value="technical-support">Technical Support</option>
              <option value="course-recommendation">Course Recommendation</option>
              <option value="pricing-payment">Pricing & Payment</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message *</label>
            <textarea id="message" rows="4" placeholder="Tell us about your specific questions, challenges, or how we can help you with your Python learning journey..." required></textarea>
          </div>

          <button type="submit" className="primary-btn">Send Message to Python Team</button>
        </form>

        {/* Contact Details */}
        <div className="contact-details">
          <h2>Get in Touch with Python Experts</h2>

          <div className="contact-info">
            <div className="contact-item" style={{"--item-index": "0"}}>
              <h3>
                <FaEnvelope />
                Email Support
              </h3>
              <div className="contact-content">
                <p><strong>Contact:</strong> <a href="mailto:hello@schoolabe.com">hello@schoolabe.com</a></p>
                <p><strong>Support Hours:</strong> Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>

            <div className="contact-item" style={{"--item-index": "1"}}>
              <h3>
                <FaPhone />
                Phone Support
              </h3>
              <div className="contact-content">
                <p><strong>Contact:</strong> <a href="tel:+919876543210">+91 98765 43210</a></p>
                <p><strong>Support Hours:</strong> Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="https://github.com/schoolabe" className="social-icon">
              <FaGithub />
              GitHub
            </a>
            <a href="https://discord.gg/schoolabe" className="social-icon">
              <FaDiscord />
              Discord
            </a>
          </div>

          <div className="response-time">
            <h3>
              <FaClock />
              Response Time
            </h3>
            <p>We typically respond to all inquiries within <strong>24 hours</strong>. For urgent technical support, please mention "URGENT" in your subject line.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
