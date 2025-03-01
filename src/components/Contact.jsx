import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-us">
      <h1>📩 Contact Us</h1>
      <p>Have questions or feedback? We'd love to hear from you! Fill out the form below, and we’ll get back to you as soon as possible.</p>

      {/* Contact Form */}
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" placeholder="Enter your name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Message</label>
          <textarea id="message" rows="4" placeholder="Type your message here..." required></textarea>
        </div>

        <button type="submit" className="btn primary-btn">Send Message</button>
      </form>

      {/* Contact Details */}
      <div className="contact-details">
        <h2>📞 Get in Touch</h2>
        <p><strong>Email:</strong> supportschoolabe.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Follow Us:</strong></p>
        <div className="social-links">
          <a href="#" className="social-icon">🌐 Website</a>
          <a href="#" className="social-icon">📘 Facebook</a>
          <a href="#" className="social-icon">🐦 Twitter</a>
          <a href="#" className="social-icon">📷 Instagram</a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
