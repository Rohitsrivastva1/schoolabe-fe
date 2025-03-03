import React, { useState } from "react";
import axios from "axios";

const CreateCourse = ({ onCourseCreated }) => {
  const [title, setTitle] = useState("");

  const handleCreateCourse = async () => {
    if (!title) return alert("Enter course title!");

    try {
      const response = await axios.post("http://localhost:5000/api/courses", { title });
      alert("Course Created!");
      setTitle(""); // Reset input
      onCourseCreated(response.data.course); // Pass course to parent
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course");
    }
  };

  return (
    <div className="editor-container">
      <h2>Create Course</h2>
      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />
      <button className="save-btn" onClick={handleCreateCourse}>Create Course</button>
    </div>
  );
};

export default CreateCourse;
