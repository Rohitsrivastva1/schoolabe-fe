import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { checkAuth } from "../services/authService"; 
import { useNavigate } from "react-router-dom";
import "./CourseTutorialEditor.css";

const BASE_URL =  ""; 

const CourseTutorialEditor = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [tutorialTitle, setTutorialTitle] = useState("");
  const [content, setContent] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkAuth();
      if (!userData) {
        navigate("/signup");
      } else {
        setUser(userData);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios.get(`${BASE_URL}/courses`)
      .then((response) => {
        if (response.data.success) {
          setCourses(response.data.courses);
        }
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const fetchTutorials = (courseSlug) => {
    if (!courseSlug) return;
    axios.get(`${BASE_URL}/tutorials/${courseSlug}`)
      .then((response) => {
        if (response.data.success) {
          setTutorials(response.data.tutorials);
        }
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  };

  const createCourse = () => {
    if (!courseTitle.trim()) return alert("Course title is required!");
    
    const courseData = {
      title: courseTitle,
      description: courseDescription
    };

    axios.post(`${BASE_URL}/courses`, courseData)
      .then((response) => {
        if (response.data.success) {
          setCourses([...courses, response.data.course]);
          setCourseTitle("");
          setCourseDescription("");
        }
      })
      .catch((error) => console.error("Error creating course:", error));
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

  const createTutorial = () => {
    if (!selectedCourse) return alert("Select a course first!");
    if (!tutorialTitle.trim()) return alert("Tutorial title is required!");

    const tutorialData = {
      title: tutorialTitle,
      content: JSON.stringify(content),
      courseSlug: selectedCourse.slug,
    };

    axios
      .post(`${BASE_URL}/tutorials`, tutorialData)
      .then((response) => {
        if (response.data.success) {
          setTutorials([...tutorials, response.data.tutorial]);
        }
        setTutorialTitle("");
        setContent([]);
      })
      .catch((error) => console.error("Error creating tutorial:", error));
  };

  return (
    <div className="editor-container">
      <h2>Course & Tutorial Editor</h2>

      {/* === Course Creation Section === */}
      <div className="course-section">
        <h3>Create a New Course</h3>
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

      {/* === Course Selection Section === */}
      <div className="course-section">
        <h3>Select a Course</h3>
        <select
          onChange={(e) => {
            const selectedCourseObj = courses.find(
              (course) => course.id === parseInt(e.target.value)
            );
            setSelectedCourse(selectedCourseObj);
            if (selectedCourseObj) {
              fetchTutorials(selectedCourseObj.slug);
            }
          }}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div className="editor-preview-wrapper">
          {/* === Tutorial Editor Section === */}
          <div className="editor-section">
            <h3>Create New Tutorial</h3>
            <input
              type="text"
              placeholder="Tutorial Title"
              value={tutorialTitle}
              onChange={(e) => setTutorialTitle(e.target.value)}
            />

            <div className="content-list">
              {content.map((block) => (
                <div key={block.id} className="content-block">
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder={`Enter ${block.type}...`}
                  />
                  <button onClick={() => removeBlock(block.id)}>Delete</button>
                </div>
              ))}
            </div>

            <div className="editor-actions">
              <button onClick={() => addBlock("h1")}>Add Heading</button>
              <button onClick={() => addBlock("p")}>Add Paragraph</button>
              <button onClick={() => addBlock("code")}>Add Code</button>
            </div>

            <button onClick={createTutorial}>Save Tutorial</button>
          </div>

          {/* === Preview Section === */}
          <div className="preview-section">
            <h3>Live Preview</h3>
            <div className="preview-content">
              {content.map((block, index) => (
                <div key={index} className={`block-${block.type}`}>
                  {block.type === "h1" && <h1>{block.text}</h1>}
                  {block.type === "p" && <p>{block.text}</p>}
                  {block.type === "code" && (
                    <pre className="code-block">
                      <code>{block.text}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTutorialEditor;
