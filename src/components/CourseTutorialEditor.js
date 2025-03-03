import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./CourseTutorialEditor.css";

const BASE_URL = "http://localhost:5000"; // API Base URL

const CourseTutorialEditor = () => {
  const [courses, setCourses] = useState([]); // Ensure it starts as an empty array
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [tutorials, setTutorials] = useState([]);
  const [tutorialTitle, setTutorialTitle] = useState("");
  const [content, setContent] = useState([]);

  // Fetch all courses from API
  useEffect(() => {
    axios.get(`${BASE_URL}/courses`)
      .then(response => {
        console.log("Courses API Response:", response.data); // Debugging
        if (Array.isArray(response.data.courses)) {
          setCourses(response.data.courses);
          console.log("Courses:", response.data); // Debugging
          
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

  // Fetch tutorials for the selected course
  const fetchTutorials = (courseId) => {
    if (!courseId) return; // Avoid fetching if no course is selected
    console.log("Fetching tutorials for course:", courseId); // Debugging
    axios.get(`${BASE_URL}/tutorials/${courseId}`)
      .then(response => {
        console.log("Tutorials API Response:", response.data); // Debugging
        setTutorials(response.data);
      })
      .catch(error => console.error("Error fetching tutorials:", error));
  };

  // Handle new course creation
  const createCourse = () => {
    if (!courseTitle.trim()) return alert("Course title is required!");
    axios.post(`${BASE_URL}/courses`, { title: courseTitle, description: courseDescription })
      .then(response => {
        console.log("Course Created:", response.data); // Debugging
        setCourses([...courses, response.data]); // Add the new course to the list
        setCourseTitle("");
        setCourseDescription("");
      })
      .catch(error => console.error("Error creating course:", error));
  };

  // Handle new tutorial creation
  const createTutorial = () => {
    if (!selectedCourse) return alert("Select a course first!");
    if (!tutorialTitle.trim()) return alert("Tutorial title is required!");

    const tutorialData = { title: tutorialTitle, content: JSON.stringify(content), courseId: selectedCourse };
    
    axios.post(`${BASE_URL}/tutorials`, tutorialData)
      .then(response => {
        console.log("Tutorial Created:", response.data); // Debugging
        setTutorials([...tutorials, response.data]);
        setTutorialTitle("");
        setContent([]);
      })
      .catch(error => console.error("Error creating tutorial:", error));
  };

  // Add content block
  const addBlock = (type) => {
    setContent([...content, { id: uuidv4(), type, text: "" }]);
  };

  // Update content block text
  const updateBlock = (id, newText) => {
    setContent(content.map(block => block.id === id ? { ...block, text: newText } : block));
  };

  // Remove content block
  const removeBlock = (id) => {
    setContent(content.filter(block => block.id !== id));
  };

  return (
    <div className="editor-container">
      <h2>Course & Tutorial Editor</h2>

      {/* Create New Course */}
      <div className="course-section">
        <h3>Create New Course</h3>
        <input
          type="text"
          placeholder="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
        />
        <textarea
          placeholder="Course Description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        />
        <button onClick={createCourse}>Create Course</button>
      </div>

      {/* Select Existing Course */}
      <div className="course-section">
        <h3>Select Existing Course</h3>
        <select onChange={(e) => {
          setSelectedCourse(e.target.value);
          fetchTutorials(e.target.value);
        }}>
          <option value="">Select a course</option>
          {courses.length > 0 ? (
            courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))
          ) : (
            <option disabled>Loading courses...</option>
          )}
        </select>
      </div>

      {/* Create New Tutorial */}
      {selectedCourse && (
        <div className="tutorial-section">
          <h3>Create New Tutorial</h3>
          <input
            type="text"
            placeholder="Tutorial Title"
            value={tutorialTitle}
            onChange={(e) => setTutorialTitle(e.target.value)}
          />

          <div className="content-list">
            {content.map((block) => (
              <div key={block.id} className={`content-block ${block.type}`}>
                {block.type === "code" ? (
                  <pre>
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder="Enter code..."
                    />
                  </pre>
                ) : (
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder={`Enter ${block.type}...`}
                  />
                )}
                <button onClick={() => removeBlock(block.id)}>Delete</button>
              </div>
            ))}
          </div>

          {/* Add Content Buttons */}
          <div className="editor-actions">
            <button onClick={() => addBlock("h1")}>Add Heading</button>
            <button onClick={() => addBlock("p")}>Add Paragraph</button>
            <button onClick={() => addBlock("code")}>Add Code</button>
            <button onClick={() => addBlock("output")}>Add Output</button>
          </div>

          <button onClick={createTutorial}>Save Tutorial</button>
        </div>
      )}
    </div>
  );
};

export default CourseTutorialEditor;
