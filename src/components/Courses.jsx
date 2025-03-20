import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Courses.css";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Use react-helmet-async
import axiosInstance from "../api/axiosInstance";

const BASE_URL = ""; // Update with your actual API URL

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance.get(`${BASE_URL}/courses`)
      .then(response => {
        if (Array.isArray(response.data.courses)) {
          setCourses(response.data.courses);
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
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <Link to={`/courses/${course.slug}`} className="btn secondary-btn">
                View Course
              </Link>
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
