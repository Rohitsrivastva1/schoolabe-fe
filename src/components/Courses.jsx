import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Courses.css";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Use react-helmet-async
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaLock, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    axiosInstance.get(`${BASE_URL}/courses`)
      .then(response => {
        if (Array.isArray(response.data.courses)) {
          // Add mock pricing data for demonstration
          const coursesWithPricing = response.data.courses.map(course => ({
            ...course,
            price: Math.floor(Math.random() * 2000) + 500, // Random price between 500-2500
            isPremium: Math.random() > 0.5 // Random premium status
          }));
          setCourses(coursesWithPricing);
        } else {
          console.error("Unexpected API response format:", response.data);
          setCourses([]);
        }
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        setCourses([]);
      });
  }, []);

  const handleAddToCart = (course) => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return;
    }
    
    if (isInCart(course.id)) {
      toast.info('Course already in cart');
      return;
    }
    
    addToCart(course);
    toast.success('Course added to cart!');
  };

  const handleCourseAccess = (course) => {
    if (!user) {
      toast.error('Please login to access this course');
      return;
    }
    
    // Here you would check if user has purchased the course
    // For now, we'll just navigate to the course
    return `/courses/${course.slug}`;
  };

  return (
    <div className="courses">

      <Helmet>
        <title>Our Courses - Schoolabe</title>
        <meta name="description" content="Explore coding courses on Python, JavaScript, and Full-Stack Development at Schoolabe." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h1>Our Courses – Learn Programming & Land Your Dream Job</h1>
      <p>
        Master <strong>Python, JavaScript, Java, Data Structures & Algorithms, Web Development</strong>, and more with expert-led tutorials.
      </p>

      <div className="course-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-header">
                <h2>{course.title}</h2>
                {course.isPremium && (
                  <span className="premium-badge">
                    <FaLock /> Premium
                  </span>
                )}
              </div>
              <p>{course.description}</p>
              <div className="course-price">
                <span className="price">₹{course.price}</span>
                {course.isPremium && (
                  <span className="original-price">₹{course.price + 500}</span>
                )}
              </div>
              <div className="course-actions">
                {isInCart(course.id) ? (
                  <button className="btn success-btn" disabled>
                    <FaCheck /> In Cart
                  </button>
                ) : (
                  <button 
                    className="btn cart-btn"
                    onClick={() => handleAddToCart(course)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                )}
                <Link 
                  to={handleCourseAccess(course)} 
                  className="btn secondary-btn"
                >
                  {course.isPremium ? 'Preview Course' : 'View Course'}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Loading courses...</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
