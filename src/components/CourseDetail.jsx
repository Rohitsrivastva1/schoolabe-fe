import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetail.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const CourseDetail = () => {
  const { courseSlug, tutorialSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [headings, setHeadings] = useState([]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);

  // Handle Sidebar Visibility Based on Screen Size
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }

    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  // Helper: Convert YouTube URL to embed URL
  const convertYoutubeUrl = (url) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Fetch Course & Tutorials Data
  useEffect(() => {
    if (!courseSlug) return;

    axios
      .get(`${BASE_URL}/courses/${courseSlug}`)
      .then((response) => {
        if (response.data.success) {
          setCourse(response.data.course);
        }
      })
      .catch((error) => console.error("Error fetching course:", error));

    axios
      .get(`${BASE_URL}/tutorials/${courseSlug}`)
      .then((response) => {
        if (response.data.success) {
          setTutorials(response.data.tutorials);
        }
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  }, [courseSlug]);

  // Select the Right Tutorial
  useEffect(() => {
    if (tutorials.length === 0) return;

    let tutorial =
      tutorials.find((t) => slugify(t.title) === tutorialSlug) || tutorials[0];

    setSelectedTutorial(tutorial);
    setFadeIn(true);

    if (!tutorialSlug || tutorialSlug !== slugify(tutorial.title)) {
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`, {
        replace: true,
      });
    }

    if (tutorial) {
      extractHeadings(tutorial.content);
    }
  }, [tutorials, tutorialSlug, navigate, courseSlug]);

  // Extract Headings for Table of Contents
  const extractHeadings = (content) => {
    try {
      const parsedContent =
        typeof content === "string" ? JSON.parse(content) : content;
      const headings = parsedContent.filter(
        (block) => block.type === "h1" || block.type === "h2"
      );
      setHeadings(headings);
    } catch (error) {
      console.error("Error parsing content:", error);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleTutorialClick = (tutorial) => {
    setFadeIn(false);
    setTimeout(() => {
      setSelectedTutorial(tutorial);
      setFadeIn(true);
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    }, 200);
  };

  // Close Sidebar When Clicking Outside
  useEffect(() => {
    const handleClickOutsideContent = (event) => {
      if (
        window.innerWidth <= 768 &&
        sidebarOpen &&
        contentRef.current &&
        contentRef.current.contains(event.target) &&
        !event.target.classList.contains("sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideContent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideContent);
    };
  }, [sidebarOpen]);

  return (
    <div className="course-detail-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>{course?.title?.toUpperCase() || "Loading..."}</h2>
        <p className="course-description">
          {course?.description || "No description available."}
        </p>
        <ul>
          {tutorials.length > 0 ? (
            tutorials.map((tutorial) => (
              <li
                key={tutorial.id}
                className={
                  selectedTutorial?.id === tutorial.id ? "active-tutorial" : ""
                }
                onClick={() => handleTutorialClick(tutorial)}
              >
                {tutorial.title}
              </li>
            ))
          ) : (
            <p>No tutorials available.</p>
          )}
        </ul>
      </aside>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? "❌" : "➡️"}
      </button>

      {/* Main Content */}
      <main
        ref={contentRef}
        className={`tutorial-content ${fadeIn ? "fade-in" : ""}`}
      >
        {selectedTutorial && selectedTutorial.content ? (
          <div>
            <h2>{selectedTutorial.title}</h2>
            {selectedTutorial.content.map((block, index) => {
              const blockText = block.text || "";
              const blockId = slugify(blockText) || `block-${index}`;

              return (
                <div key={index} id={blockId} className={`block-${block.type}`}>
                  {/* Text and Heading Blocks */}
                  {block.type === "text" && <p>{blockText}</p>}
                  {block.type === "h1" && <h1>{blockText}</h1>}
                  {block.type === "h2" && <h2>{blockText}</h2>}
                  {block.type === "p" && <p>{blockText}</p>}

                  {/* List Blocks */}
                  {block.type === "ul" && blockText && (
                    <ul className="custom-ul">
                      {blockText.split("\n").map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  )}
                  {block.type === "ol" && blockText && (
                    <ol className="custom-ol">
                      {blockText.split("\n").map((item, i) => (
                        <li key={i}>{item.trim()}</li>
                      ))}
                    </ol>
                  )}

                  {/* Code Block */}
                  {block.type === "code" && (
                    <div className="code-container1">
                      <pre>
                        <code>{blockText}</code>
                      </pre>
                    </div>
                  )}

                  {/* Output Block */}
                  {block.type === "output" && (
                    <div className="output-box1">
                      <strong>Output:</strong> {blockText}
                    </div>
                  )}

                  {/* Table Block */}
                  {block.type === "table" && block.data && (
                    <div className="block-table">
                      <table>
                        <tbody>
                          {block.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) =>
                                block.headerRow && rowIndex === 0 ? (
                                  <th key={cellIndex}>{cell || ""}</th>
                                ) : (
                                  <td key={cellIndex}>{cell || ""}</td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* New: Image Block */}
                  {block.type === "image" && (
                    <div className="block-image-container">
                      <img
                        src={block.src}
                        alt={block.alt || "Image"}
                        className="block-image"
                      />
                    </div>
                  )}

                  {/* New: YouTube Video Block */}
                  {block.type === "youtube" && (
                    <div className="block-youtube-container">
                      <div className="video-responsive">
                        <iframe
                          src={convertYoutubeUrl(block.url)}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="YouTube video"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Loading tutorial...</p>
        )}
      </main>

      {/* Table of Contents */}
      <aside className="right-sidebar">
        <h3>On This Page</h3>
        <ul>
          {headings.map((heading) => (
            <li key={slugify(heading.text)}>
              <a
                href={`#${slugify(heading.text)}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(slugify(heading.text))
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default CourseDetail;
