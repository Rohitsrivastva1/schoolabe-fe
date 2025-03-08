import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./CourseTutorialEditor.css";

const BASE_URL = "http://localhost:5000";

const CourseTutorialEditor = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // Initialize as null
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [tutorials, setTutorials] = useState([]);
  const [tutorialTitle, setTutorialTitle] = useState("");
  const [content, setContent] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/courses`)
      .then((response) => {
        console.log("Courses API Response:", response.data);
        if (response.data.success && Array.isArray(response.data.courses)) {
          setCourses(response.data.courses);
          console.log("Courses:", response.data.courses);
        } else {
          console.error("Unexpected API response format:", response.data);
          setCourses([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
      });
  }, []);

  const fetchTutorials = (courseSlug) => {
    if (!courseSlug) return;
    console.log("Fetching tutorials for course:", courseSlug);

    axios
      .get(`${BASE_URL}/tutorials/${courseSlug}`)
      .then((response) => {
        console.log("Tutorials API Response:", response.data);
        if (response.data.success && Array.isArray(response.data.tutorials)) {
          setTutorials(response.data.tutorials);
        } else {
          setTutorials([]);
        }
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  };

  const createCourse = () => {
    if (!courseTitle.trim()) return alert("Course title is required!");
    axios
      .post(`${BASE_URL}/courses`, {
        title: courseTitle,
        description: courseDescription,
      })
      .then((response) => {
        console.log("Course Created:", response.data);
        if (response.data.success && response.data.course) {
          setCourses([...courses, response.data.course]);
        }
        setCourseTitle("");
        setCourseDescription("");
      })
      .catch((error) => console.error("Error creating course:", error));
  };

  const createTutorial = () => {
    if (!selectedCourse) return alert("Select a course first!");
    if (!tutorialTitle.trim()) return alert("Tutorial title is required!");

    const tutorialData = {
      title: tutorialTitle,
      content: JSON.stringify(content),
      courseSlug: selectedCourse.slug, // Send courseSlug
    };

    axios
      .post(`${BASE_URL}/tutorials`, tutorialData)
      .then((response) => {
        console.log("Tutorial Created:", response.data);
        if (response.data.success && response.data.tutorial) {
          setTutorials([...tutorials, response.data.tutorial]);
        }
        setTutorialTitle("");
        setContent([]);
      })
      .catch((error) => console.error("Error creating tutorial:", error));
  };

  const addBlock = (type) => {
    setContent([...content, { id: uuidv4(), type, text: "" }]);
  };

  const updateBlock = (id, newText) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const removeBlock = (id) => {
    setContent(content.filter((block) => block.id !== id));
  };

  return (
    <div className="editor-container">
      <h2>Course & Tutorial Editor</h2>

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

      <div className="course-section">
        <h3>Select Existing Course</h3>
        <select
          onChange={(e) => {
            const selectedCourseObj = courses.find(
              (course) => course.id === parseInt(e.target.value)
            );
            setSelectedCourse(selectedCourseObj); // Set the whole course object
            if (selectedCourseObj) {
              fetchTutorials(selectedCourseObj.slug);
            }
          }}
        >
          <option value="">Select a course</option>
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))
          ) : (
            <option disabled>Loading courses...</option>
          )}
        </select>
      </div>

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