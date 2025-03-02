import React from "react";
import { Link } from "react-router-dom";
import courseData from "../data/courses.json";
import "./courseStyles.css"; // Import CSS

const Sidebar = ({ course }) => {
  const topics = courseData[course] || {};

  return (
    <div className="sidebar">
      <h2>{course.toUpperCase()} Course</h2>
      <ul>
        {Object.keys(topics).map((topicId) => (
          <li key={topicId}>
            <Link to={`/courses/${course}/${topicId}`}>{topics[topicId].title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
