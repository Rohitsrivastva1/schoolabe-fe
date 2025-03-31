import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import DOMPurify from "dompurify";
import { checkAuth } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaHeading, FaListUl, FaListOl, FaCode, FaTable, FaSave } from "react-icons/fa";
import "./CourseTutorialEditor.css";

const BASE_URL = ""; // Update with your backend URL

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
  const [isSaving, setIsSaving] = useState(false);

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
      description: courseDescription,
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
    if (type === "table") {
      setContent([
        ...content,
        {
          id: uuidv4(),
          type: "table",
          rows: 2,
          cols: 2,
          headerRow: true,
          data: Array(2)
            .fill(null)
            .map((_, rowIndex) =>
              Array(2).fill(rowIndex === 0 ? "Header" : "")
            ),
        },
      ]);
      return;
    }

    let newBlock = { id: uuidv4(), type, text: "" };
    setContent([...content, newBlock]);
  };

  const updateBlock = (id, newText) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const updateTableCell = (blockId, rowIndex, colIndex, value) => {
    setContent(
      content.map((block) =>
        block.id === blockId
          ? {
              ...block,
              data: block.data.map((row, r) =>
                r === rowIndex
                  ? row.map((cell, c) => (c === colIndex ? value : cell))
                  : row
              ),
            }
          : block
      )
    );
  };

  const addTableRow = (blockId) => {
    setContent(
      content.map((block) => 
        block.id === blockId ? {
          ...block,
          rows: block.rows + 1,
          data: [...block.data, Array(block.cols).fill("")]
        } : block
      )
    );
  };

  const addTableColumn = (blockId) => {
    setContent(
      content.map((block) => 
        block.id === blockId ? {
          ...block,
          cols: block.cols + 1,
          data: block.data.map(row => [...row, ""])
        } : block
      )
    );
  };

  const toggleHeaderRow = (blockId) => {
    setContent(
      content.map((block) => 
        block.id === blockId ? { ...block, headerRow: !block.headerRow } : block
      )
    );
  };

  const removeBlock = (id) => {
    setContent(content.filter((block) => block.id !== id));
  };

  const createTutorial = () => {
    if (!selectedCourse) return alert("Select a course first!");
    if (!tutorialTitle.trim()) return alert("Tutorial title is required!");

    setIsSaving(true);
    const tutorialData = {
      title: tutorialTitle,
      content: JSON.stringify(content),
      courseSlug: selectedCourse.slug,
    };

    axios.post(`${BASE_URL}/tutorials`, tutorialData)
      .then((response) => {
        if (response.data.success) {
          setTutorials([...tutorials, response.data.tutorial]);
          setTutorialTitle("");
          setContent([]);
        }
      })
      .catch((error) => console.error("Error creating tutorial:", error))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="editor-container">
      <h2>Course & Tutorial Editor</h2>

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
        <button onClick={createCourse}>
          <FaSave /> Create Course
        </button>
      </div>

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
                  {block.type === "table" ? (
                    <>
                      <div className="table-controls">
                        <button onClick={() => addTableRow(block.id)}>
                          <FaPlus /> Row
                        </button>
                        <button onClick={() => addTableColumn(block.id)}>
                          <FaPlus /> Column
                        </button>
                        <label>
                          <input
                            type="checkbox"
                            checked={block.headerRow}
                            onChange={() => toggleHeaderRow(block.id)}
                          />
                          Header Row
                        </label>
                      </div>
                      <table className="table-editor">
                        <tbody>
                          {block.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => (
                                block.headerRow && rowIndex === 0 ? (
                                  <th key={colIndex}>
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) =>
                                        updateTableCell(
                                          block.id,
                                          rowIndex,
                                          colIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </th>
                                ) : (
                                  <td key={colIndex}>
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) =>
                                        updateTableCell(
                                          block.id,
                                          rowIndex,
                                          colIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                )
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder={`Enter ${block.type}...`}
                    />
                  )}
                  <button 
                    onClick={() => removeBlock(block.id)}
                    className="delete-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="editor-actions">
              <button onClick={() => addBlock("h1")}><FaHeading /> H1</button>
              <button onClick={() => addBlock("h2")}><FaHeading /> H2</button>
              <button onClick={() => addBlock("h3")}><FaHeading /> H3</button>
              <button onClick={() => addBlock("ul")}><FaListUl /> List</button>
              <button onClick={() => addBlock("ol")}><FaListOl /> Ordered</button>
              <button onClick={() => addBlock("p")}>Paragraph</button>
              <button onClick={() => addBlock("code")}><FaCode /> Code</button>
              <button onClick={() => addBlock("table")}><FaTable /> Table</button>
            </div>

            <div className="preview-section">
              <h3>Live Preview</h3>
              <div className="preview-content">
                {content.map((block) => (
                  <div key={block.id} className="content-preview">
                    {block.type === 'table' ? (
                      <table className="preview-table">
                        <tbody>
                          {block.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                block.headerRow && rowIndex === 0 ? (
                                  <th key={cellIndex}>{cell}</th>
                                ) : (
                                  <td key={cellIndex}>{cell}</td>
                                )
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      React.createElement(
                        block.type === 'ul' || block.type === 'ol' ? block.type : 'div',
                        {
                          className: `preview-${block.type}`,
                          dangerouslySetInnerHTML: {
                            __html: DOMPurify.sanitize(block.text) 
                          }
                        }
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={createTutorial} 
              disabled={isSaving}
              className="save-btn"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <FaSave /> Save Tutorial
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTutorialEditor;