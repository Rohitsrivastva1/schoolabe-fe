import React, { useState } from "react";
import axios from "axios";

const CreateCourse = ({ onCourseCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateCourse = async () => {
    if (!title) return alert("Enter course title!");
    if (!description) return alert("Enter course description!");

    try {
      const response = await axios.post("/courses", {
        title,
        description,
      });

      if (response.data.success) {
        alert("Course Created!");
        setTitle("");
        setDescription("");
        onCourseCreated(response.data.course); // Pass the course object
      } else {
        alert("Failed to create course. API returned failure.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Check console for details.");
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
      <textarea
        placeholder="Course Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="description-input"
      />
      <button className="save-btn" onClick={handleCreateCourse}>
        Create Course
      </button>
    </div>
  );
};

export default CreateCourse;