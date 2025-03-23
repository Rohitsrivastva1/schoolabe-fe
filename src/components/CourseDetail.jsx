
import React, { useEffect, useState,useRef  } from "react";
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
  const contentRef = useRef(null); // Ref for tutorial content

  useEffect(() => {
    // Hide sidebar by default only on mobile
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }

    // Update on window resize
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  // Convert title into a slug format
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  // Fetch Course & Tutorials when courseSlug changes
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

  // Select tutorial & extract headings
  useEffect(() => {
    if (tutorials.length === 0) return;

    let tutorial =
      tutorials.find((t) => slugify(t.title) === tutorialSlug) || tutorials[0];

    setSelectedTutorial(tutorial);
    setFadeIn(true);

    if (!tutorialSlug || tutorialSlug !== slugify(tutorial.title)) {
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`, { replace: true });
    }

    if (tutorial) {
      extractHeadings(tutorial.content);
    }
  }, [tutorials, tutorialSlug, navigate, courseSlug]);

  // Extract headings (h1, h2) for TOC
  const extractHeadings = (content) => {
    try {
      const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
      const headings = parsedContent.filter((block) => block.type === "h1" || block.type === "h2");
      setHeadings(headings);
    } catch (error) {
      console.error("Error parsing content:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Handle tutorial click
  const handleTutorialClick = (tutorial) => {
    setFadeIn(false);
    setTimeout(() => {
      setSelectedTutorial(tutorial);
      setFadeIn(true);
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false); // Close sidebar on mobile
      }
    }, 200);
  };

  useEffect(() => {
    const handleClickOutsideContent = (event) => {
   
      
      if (window.innerWidth <= 768 && sidebarOpen && contentRef.current && contentRef.current.contains(event.target) && !event.target.classList.contains('sidebar-toggle')) {
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
      {/* Left Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>{course?.title ? course.title.toUpperCase() : "Loading..."}</h2>
        <p className="course-description">{course?.description || "No description available."}</p>
        <ul>
          {tutorials.length > 0 ? (
            tutorials.map((tutorial) => (
              <li
                key={tutorial.id}
                className={selectedTutorial?.id === tutorial.id ? "active-tutorial" : ""}
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
      <main  ref={contentRef}  className={`tutorial-content ${fadeIn ? "fade-in" : ""}`}>
        {selectedTutorial && selectedTutorial.content ? (
          <div>
            <h2>{selectedTutorial.title}</h2>
            {(typeof selectedTutorial.content === "string"
              ? JSON.parse(selectedTutorial.content)
              : selectedTutorial.content
            ).map((block, index) => (
              <div key={index} id={slugify(block.text)} className={`block-${block.type}`}>
                {block.type === "text" && <p>{block.text}</p>}
                {block.type === "h1" && <h1>{block.text}</h1>}
                {block.type === "h2" && <h2>{block.text}</h2>}
                {block.type === "p" && <p>{block.text}</p>}
                {block.type === "code" && (
                  <div className="code-container1">
                    <pre>
                      <code>{block.text}</code>
                    </pre>
                  </div>
                )}
                {block.type === "output" && (
                  <div className="output-box1">
                    <strong>Output:</strong> {block.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading tutorial...</p>
        )}
      </main>

      {/* Right Sidebar (Table of Contents) */}
      <aside className="right-sidebar">
        <h3>On This Page</h3>
        <ul>
          {headings.map((heading) => (
            <li key={slugify(heading.text)}>
              <a
                href={`#${slugify(heading.text)}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(slugify(heading.text))?.scrollIntoView({ behavior: "smooth" });
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