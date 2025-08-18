import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { checkAuth } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { 
  FaPlus, 
  FaTrash, 
  FaHeading, 
  FaListUl, 
  FaListOl, 
  FaCode, 
  FaTable, 
  FaSave,
  FaImage,
  FaYoutube,
  FaBook,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaCopy,
  FaQuoteLeft,
  FaFileAlt,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaToggleOn,
  FaToggleOff,
  FaExpand,
  FaCompress,
  FaTextHeight,
  FaAlignJustify
} from "react-icons/fa";
import "./CourseTutorialEditor.css";

const CourseTutorialEditor = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [tutorialTitle, setTutorialTitle] = useState("");
  const [content, setContent] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('course'); // 'course' or 'tutorial'
  const [showPreview, setShowPreview] = useState(true);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isCreatingTutorial, setIsCreatingTutorial] = useState(false);
  const [useQuill, setUseQuill] = useState(false);
  const [quillContent, setQuillContent] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Preview UX controls
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [previewFontSize, setPreviewFontSize] = useState(16); // px
  const [narrowReaderWidth, setNarrowReaderWidth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkAuth();
      if (!userData) {
        navigate("/signup");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios.get(`/courses`)
      .then((response) => {
      if (response.data.success) {
        setCourses(response.data.courses);
      }
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const fetchTutorials = (courseSlug) => {
    if (!courseSlug) return;
    axios.get(`/tutorials/${courseSlug}`)
      .then((response) => {
        if (response.data.success) {
          setTutorials(response.data.tutorials);
        }
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  };

  const createCourse = async () => {
    if (!courseTitle.trim()) {
      alert("Course title is required!");
      return;
    }

    setIsCreatingCourse(true);
    const courseData = {
        title: courseTitle,
        description: courseDescription,
    };

    try {
      const response = await axios.post(`/courses`, courseData);
      if (response.data.success) {
        setCourses([...courses, response.data.course]);
        setCourseTitle("");
        setCourseDescription("");
        setActiveTab('tutorial');
        alert("Course created successfully! 🎉");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course. Please try again.");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const convertYoutubeUrl = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url;
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
    if (type === "image") {
      let newBlock = { id: uuidv4(), type: "image", src: "", alt: "" };
      setContent([...content, newBlock]);
      return;
    }
    if (type === "youtube") {
      let newBlock = { id: uuidv4(), type: "youtube", url: "" };
      setContent([...content, newBlock]);
      return;
    }
    if (type === "quote") {
      let newBlock = { id: uuidv4(), type: "quote", text: "", author: "" };
      setContent([...content, newBlock]);
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

  const updateImageBlock = (id, newSrc) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, src: newSrc } : block
      )
    );
  };

  const updateImageAlt = (id, newAlt) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, alt: newAlt } : block
      )
    );
  };

  const updateYoutubeBlock = (id, newUrl) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, url: newUrl } : block
      )
    );
  };

  const updateQuoteBlock = (id, field, value) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
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

  const createTutorial = async () => {
    if (!selectedCourse) {
      alert("Select a course first!");
      return;
    }
    if (!tutorialTitle.trim()) {
      alert("Tutorial title is required!");
      return;
    }

    setIsCreatingTutorial(true);
    let tutorialData;
    
    if (useQuill) {
      // Use ReactQuill content
      tutorialData = {
        title: tutorialTitle,
        content: { html: quillContent },
        courseSlug: selectedCourse.slug,
      };
    } else {
      // Use block-based content
      tutorialData = {
        title: tutorialTitle,
        content: JSON.stringify(content),
        courseSlug: selectedCourse.slug,
      };
    }

    try {
      const response = await axios.post(`/tutorials`, tutorialData);
      if (response.data.success) {
        setTutorials([...tutorials, response.data.tutorial]);
        setTutorialTitle("");
        setContent([]);
        setQuillContent("");
        alert("Tutorial created successfully! 🎉");
      }
    } catch (error) {
      console.error("Error creating tutorial:", error);
      alert("Error creating tutorial. Please try again.");
    } finally {
      setIsCreatingTutorial(false);
    }
  };

  const duplicateBlock = (blockId) => {
    const blockToDuplicate = content.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock = { ...blockToDuplicate, id: uuidv4() };
      setContent([...content, newBlock]);
    }
  };

  const moveBlock = (blockId, direction) => {
    const currentIndex = content.findIndex(block => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.length) return;

    const newContent = [...content];
    [newContent[currentIndex], newContent[newIndex]] = [newContent[newIndex], newContent[currentIndex]];
    setContent(newContent);
  };

  const handlePreviewScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setShowScrollTop(scrollTop > 300);
  };

  const scrollToTop = () => {
    const previewContent = document.querySelector('.preview-content');
    if (previewContent) {
      previewContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const increaseFont = () => setPreviewFontSize((s) => Math.min(22, s + 1));
  const decreaseFont = () => setPreviewFontSize((s) => Math.max(12, s - 1));

  const getArticleLength = () => {
    if (useQuill) {
      return quillContent.length;
    } else {
      return content.reduce((total, block) => total + (block.text?.length || 0), 0);
    }
  };

  const getLengthIndicator = () => {
    const length = getArticleLength();
    if (length > 5000) return { text: 'Very Long', class: 'very-long' };
    if (length > 2000) return { text: 'Long', class: 'long' };
    return { text: 'Good Length', class: '' };
  };

  return (
    <div className="admin-editor-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <FaChalkboardTeacher className="header-icon" />
            <h1>Admin Course & Tutorial Editor</h1>
          </div>
          <div className="header-right">
            <button 
              className="preview-toggle"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <FaEyeSlash /> : <FaEye />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'course' ? 'active' : ''}`}
          onClick={() => setActiveTab('course')}
        >
          <FaGraduationCap />
          Course Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'tutorial' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutorial')}
        >
          <FaBook />
          Tutorial Editor
        </button>
      </div>

      <div className="admin-content">
        {/* Course Management Tab */}
        {activeTab === 'course' && (
          <div className="course-management">
            <div className="section-card">
              <div className="section-header">
                <h2><FaPlus /> Create New Course</h2>
                <p>Add a new course to your platform</p>
              </div>
              
              <div className="form-group">
                <label>Course Title *</label>
      <input
        type="text"
                  placeholder="Enter course title..."
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
                  className="form-input"
      />
              </div>
              
              <div className="form-group">
                <label>Course Description</label>
      <textarea
                  placeholder="Describe what students will learn..."
        value={courseDescription}
        onChange={(e) => setCourseDescription(e.target.value)}
                  className="form-textarea"
                  rows="4"
                />
              </div>
              
              <button 
                onClick={createCourse} 
                disabled={isCreatingCourse || !courseTitle.trim()}
                className="primary-button"
              >
                {isCreatingCourse ? (
                  <>
                    <div className="spinner"></div>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <FaSave />
        Create Course
                  </>
                )}
              </button>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h2><FaBook /> Existing Courses</h2>
                <p>Select a course to add tutorials</p>
              </div>
              
              <div className="courses-grid">
                {courses.map((course) => (
                  <div 
                    key={course.id} 
                    className={`course-card ${selectedCourse?.id === course.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCourse(course);
                      fetchTutorials(course.slug);
                      setActiveTab('tutorial');
                    }}
                  >
                    <div className="course-card-header">
                      <FaBook className="course-icon" />
                      <h3>{course.title}</h3>
                    </div>
                    <p>{course.description}</p>
                    <div className="course-stats">
                      <span>{tutorials.filter(t => t.courseId === course.id).length} tutorials</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {courses.length === 0 && (
                <div className="empty-state">
                  <FaBook className="empty-icon" />
                  <h3>No courses yet</h3>
                  <p>Create your first course to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tutorial Editor Tab */}
        {activeTab === 'tutorial' && (
          <div className="tutorial-editor">
            {!selectedCourse ? (
              <div className="no-course-selected">
                <FaBook className="no-course-icon" />
                <h2>No Course Selected</h2>
                <p>Please select a course from the Course Management tab to start creating tutorials.</p>
                <button 
                  onClick={() => setActiveTab('course')}
                  className="secondary-button"
                >
                  <FaArrowLeft />
                  Back to Course Management
                </button>
              </div>
            ) : (
              <>
                {/* Course Info */}
                <div className="course-info-banner">
                  <div className="course-info">
                    <FaBook className="course-icon" />
                    <div>
                      <h3>{selectedCourse.title}</h3>
                      <p>{selectedCourse.description}</p>
                    </div>
                  </div>
                  <div className="course-actions">
                    <span className="tutorial-count">
                      {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''}
                    </span>
                    <button 
                      onClick={() => setActiveTab('course')}
                      className="secondary-button small"
                    >
                      <FaArrowLeft />
                      Change Course
      </button>
                  </div>
                </div>

                <div className="editor-layout">
                  {/* Editor Panel */}
                  <div className="editor-panel">
                    <div className="section-card">
                      <div className="section-header">
                        <h2><FaEdit /> Create New Tutorial</h2>
                        <p>Build engaging content for your students</p>
                      </div>
                      
                      <div className="form-group">
                        <label>Tutorial Title *</label>
      <input
        type="text"
                          placeholder="Enter tutorial title..."
        value={tutorialTitle}
        onChange={(e) => setTutorialTitle(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      {/* Editor Toggle */}
                      <div className="editor-toggle">
                        <label className="toggle-label">
                          <span>Editor Type:</span>
                          <button
                            type="button"
                            className={`toggle-button ${useQuill ? 'quill' : 'blocks'}`}
                            onClick={() => setUseQuill(!useQuill)}
                          >
                            {useQuill ? (
                              <>
                                <FaToggleOn />
                                <span>Rich Text Editor</span>
                              </>
                            ) : (
                              <>
                                <FaToggleOff />
                                <span>Block Editor</span>
                              </>
                            )}
                          </button>
                        </label>
                        <p className="toggle-description">
                          {useQuill 
                            ? "Use the rich text editor for traditional article writing with formatting options."
                            : "Use the block editor for structured content with different content types."
                          }
                        </p>
                      </div>

                      {/* Content Editor */}
                      {useQuill ? (
                        <div className="quill-editor">
                          <div className="editor-header">
                            <h3>Rich Text Editor</h3>
                            <span className="editor-type">ReactQuill</span>
                          </div>
      <ReactQuill
        theme="snow"
                            value={quillContent}
                            onChange={setQuillContent}
                            placeholder="Write your tutorial content here..."
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'align': [] }],
                                ['link', 'image', 'video'],
                                ['code-block', 'blockquote'],
                                ['clean']
                              ],
                            }}
                                                         style={{ height: '500px', marginBottom: '20px' }}
                          />
                        </div>
                      ) : (
                        <div className="content-blocks">
                          <div className="blocks-header">
                            <h3>Content Blocks</h3>
                            <span className="block-count">{content.length} block{content.length !== 1 ? 's' : ''}</span>
                          </div>
                        
                        <div className="blocks-list">
                          {content.map((block, index) => (
                            <div key={block.id} className="content-block">
                              <div className="block-header">
                                <div className="block-info">
                                  <span className="block-type">{block.type.toUpperCase()}</span>
                                  <span className="block-number">#{index + 1}</span>
                                </div>
                                <div className="block-actions">
                                  <button 
                                    onClick={() => moveBlock(block.id, 'up')}
                                    disabled={index === 0}
                                    className="action-btn small"
                                    title="Move Up"
                                  >
                                    <FaArrowLeft />
                                  </button>
                                  <button 
                                    onClick={() => moveBlock(block.id, 'down')}
                                    disabled={index === content.length - 1}
                                    className="action-btn small"
                                    title="Move Down"
                                  >
                                    <FaArrowRight />
                                  </button>
                                  <button 
                                    onClick={() => duplicateBlock(block.id)}
                                    className="action-btn small"
                                    title="Duplicate"
                                  >
                                    <FaCopy />
                                  </button>
                                  <button 
                                    onClick={() => removeBlock(block.id)}
                                    className="action-btn small danger"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="block-content">
                                {block.type === "table" ? (
                                  <div className="table-editor">
                                    <div className="table-controls">
                                      <button onClick={() => addTableRow(block.id)} className="control-btn">
                                        <FaPlus /> Add Row
                                      </button>
                                      <button onClick={() => addTableColumn(block.id)} className="control-btn">
                                        <FaPlus /> Add Column
                                      </button>
                                      <label className="checkbox-label">
                                        <input
                                          type="checkbox"
                                          checked={block.headerRow}
                                          onChange={() => toggleHeaderRow(block.id)}
                                        />
                                        Header Row
                                      </label>
                                    </div>
                                    <table className="table-grid">
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
                                                    placeholder="Header"
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
                                                    placeholder="Cell"
                                                  />
                                                </td>
                                              )
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : block.type === "image" ? (
                                  <div className="image-editor">
                                    <input 
                                      type="text"
                                      value={block.src}
                                      onChange={(e) => updateImageBlock(block.id, e.target.value)}
                                      placeholder="Enter image URL..."
                                      className="form-input"
                                    />
                                    <input 
                                      type="text"
                                      value={block.alt}
                                      onChange={(e) => updateImageAlt(block.id, e.target.value)}
                                      placeholder="Enter alt text for accessibility..."
                                      className="form-input"
                                    />
                                  </div>
                                ) : block.type === "youtube" ? (
                                  <div className="youtube-editor">
                                    <input 
                                      type="text"
                                      value={block.url}
                                      onChange={(e) => updateYoutubeBlock(block.id, e.target.value)}
                                      placeholder="Enter YouTube video URL..."
                                      className="form-input"
                                    />
                                  </div>
                                ) : block.type === "quote" ? (
                                  <div className="quote-editor">
                                    <textarea
                                      value={block.text}
                                      onChange={(e) => updateQuoteBlock(block.id, 'text', e.target.value)}
                                      placeholder="Enter quote text..."
                                      className="form-textarea"
                                      rows="3"
                                    />
                                    <input
                                      type="text"
                                      value={block.author}
                                      onChange={(e) => updateQuoteBlock(block.id, 'author', e.target.value)}
                                      placeholder="Quote author (optional)"
                                      className="form-input"
                                    />
                                  </div>
                                ) : (
                                  <textarea
                                    value={block.text}
                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                    placeholder={`Enter ${block.type} content...`}
                                    className="form-textarea"
                                    rows="4"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {content.length === 0 && (
                          <div className="empty-blocks">
                            <FaFileAlt className="empty-icon" />
                            <p>No content blocks yet. Add some content to get started!</p>
                          </div>
                        )}
                      </div>
                    )}

                      {/* Block Type Buttons - Only show when using block editor */}
                      {!useQuill && (
                        <div className="block-type-buttons">
                          <h3>Add Content Block</h3>
                          <div className="button-grid">
                            <button onClick={() => addBlock("h1")} className="block-btn">
                              <FaHeading /> H1 Heading
                            </button>
                            <button onClick={() => addBlock("h2")} className="block-btn">
                              <FaHeading /> H2 Heading
                            </button>
                            <button onClick={() => addBlock("h3")} className="block-btn">
                              <FaHeading /> H3 Heading
                            </button>
                            <button onClick={() => addBlock("p")} className="block-btn">
                              <FaFileAlt /> Paragraph
                            </button>
                            <button onClick={() => addBlock("ul")} className="block-btn">
                              <FaListUl /> Unordered List
                            </button>
                            <button onClick={() => addBlock("ol")} className="block-btn">
                              <FaListOl /> Ordered List
                            </button>
                            <button onClick={() => addBlock("code")} className="block-btn">
                              <FaCode /> Code Block
                            </button>
                            <button onClick={() => addBlock("table")} className="block-btn">
                              <FaTable /> Table
                            </button>
                            <button onClick={() => addBlock("image")} className="block-btn">
                              <FaImage /> Image
                            </button>
                            <button onClick={() => addBlock("youtube")} className="block-btn">
                              <FaYoutube /> YouTube Video
                            </button>
                            <button onClick={() => addBlock("quote")} className="block-btn">
                              <FaQuoteLeft /> Quote
                            </button>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={createTutorial} 
                        disabled={isCreatingTutorial || !tutorialTitle.trim() || (useQuill ? !quillContent.trim() : content.length === 0)}
                        className="primary-button large"
                      >
                        {isCreatingTutorial ? (
                          <>
                            <div className="spinner"></div>
                            Creating Tutorial...
                          </>
                        ) : (
                          <>
                            <FaSave />
        Create Tutorial
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  {showPreview && (
                    <div className={`preview-panel ${isPreviewFullscreen ? 'fullscreen' : ''}`}>
                      <div className="section-card">
                        <div className="section-header">
                          <h2><FaEye /> Live Preview</h2>
                          <p>See how your tutorial will look to students</p>
                          <div className={`article-length-indicator ${getLengthIndicator().class}`}>
                            {getLengthIndicator().text} ({getArticleLength()} chars)
                          </div>
                          <div className="preview-controls">
                            <button 
                              className="secondary-button small"
                              onClick={() => setNarrowReaderWidth(!narrowReaderWidth)}
                              title="Toggle reader width"
                            >
                              <FaAlignJustify /> {narrowReaderWidth ? 'Wide' : 'Narrow'}
                            </button>
                            <div className="font-controls">
                              <button className="secondary-button small" onClick={decreaseFont} title="Decrease font size">
                                <FaTextHeight /> -
                              </button>
                              <span className="font-size-display">{previewFontSize}px</span>
                              <button className="secondary-button small" onClick={increaseFont} title="Increase font size">
                                <FaTextHeight /> +
                              </button>
                            </div>
                            <button 
                              className="secondary-button small"
                              onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                              title={isPreviewFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                              {isPreviewFullscreen ? <FaCompress /> : <FaExpand />} {isPreviewFullscreen ? 'Exit' : 'Full'}
      </button>
                          </div>
                        </div>
                        
                        <div 
                          className={`preview-content ${narrowReaderWidth ? 'narrow' : 'wide'}`}
                          onScroll={handlePreviewScroll}
                          style={{ fontSize: `${previewFontSize}px` }}
                        >
                          {useQuill ? (
                            // ReactQuill content preview
                            quillContent.trim() ? (
                              <div 
                                className="quill-preview"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quillContent) }}
                              />
                            ) : (
                              <div className="empty-preview">
                                <FaEye className="empty-icon" />
                                <p>Add content to the rich text editor to see the preview</p>
                              </div>
                            )
                          ) : (
                            // Block-based content preview
                            content.length > 0 ? (
                              content.map((block) => (
                              <div key={block.id} className="content-preview">
                                {block.type === "table" ? (
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
                                ) : block.type === "image" ? (
                                  <div className="preview-image">
                                    {block.src ? (
                                      <img 
                                        src={block.src} 
                                        alt={block.alt || "Image"} 
                                        className="image-preview"
                                      />
                                    ) : (
                                      <div className="image-placeholder">
                                        <FaImage />
                                        <p>Image placeholder</p>
                                      </div>
                                    )}
                                  </div>
                                ) : block.type === "youtube" ? (
                                  <div className="preview-video">
                                    {block.url ? (
                                      <div className="video-responsive">
                                        <iframe
                                          width="560"
                                          height="315"
                                          src={convertYoutubeUrl(block.url)}
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                          title="YouTube video"
                                        ></iframe>
                                      </div>
                                    ) : (
                                      <div className="video-placeholder">
                                        <FaYoutube />
                                        <p>YouTube video placeholder</p>
                                      </div>
                                    )}
                                  </div>
                                ) : block.type === "quote" ? (
                                  <blockquote className="preview-quote">
                                    <p>"{block.text}"</p>
                                    {block.author && <cite>— {block.author}</cite>}
                                  </blockquote>
                                ) : (
                                  React.createElement(
                                    block.type === "ul" || block.type === "ol" ? block.type : "div",
                                    {
                                      className: `preview-${block.type}`,
                                      dangerouslySetInnerHTML: {
                                        __html: DOMPurify.sanitize(block.text)
                                      }
                                    }
                                  )
                                )}
                                                             </div>
                             ))
                           ) : (
                             <div className="empty-preview">
                               <FaEye className="empty-icon" />
                               <p>Add content blocks to see the preview</p>
                             </div>
                           )
                          )}
                        </div>
                      </div>
                    </div>
                                     )}
                 </div>
               </>
             )}
           </div>
         )}
       </div>

       {/* Scroll to Top Button */}
       {showScrollTop && (
         <button 
           className="scroll-to-top-btn"
           onClick={scrollToTop}
           title="Scroll to top"
         >
           <FaArrowLeft style={{ transform: 'rotate(90deg)' }} />
         </button>
       )}
    </div>
  );
};

export default CourseTutorialEditor;
