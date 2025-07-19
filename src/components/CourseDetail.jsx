import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from 'dompurify'; // --- FIX: Import DOMPurify for security
import "./CourseDetail.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const CourseDetail = () => {
  const { courseSlug, tutorialSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [cleanHtml, setCleanHtml] = useState(""); // --- FIX: State for sanitized HTML
  const [fadeIn, setFadeIn] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Handle Sidebar Visibility Based on Screen Size
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Helper: Slugify text for URLs
  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-"); // Replace multiple - with single -
  };

  // Helper: Convert YouTube URL to a valid embed URL
  const convertYoutubeUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    // --- FIX: Use correct YouTube embed URL format
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Fetch Course & Tutorials Data
  useEffect(() => {
    if (!courseSlug) return;
    
    axios.get(`${BASE_URL}/courses/${courseSlug}`)
      .then((response) => {
        if (response.data.success) setCourse(response.data.course);
      })
      .catch((error) => console.error("Error fetching course:", error));

    axios.get(`${BASE_URL}/tutorials/${courseSlug}`)
      .then((response) => {
        if (response.data.success) setTutorials(response.data.tutorials);
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  }, [courseSlug]);

  // Logic to select the tutorial and sanitize its content
  useEffect(() => {
    if (tutorials.length === 0) return;

    const tutorial = tutorials.find((t) => slugify(t.title) === tutorialSlug) || tutorials[0];

    if (tutorial) {
      setSelectedTutorial(tutorial);

      if (tutorial.content && tutorial.content.html) {
        // --- FIX: Sanitize HTML before rendering and extracting headings
        const sanitizedHtml = DOMPurify.sanitize(tutorial.content.html);
        setCleanHtml(sanitizedHtml);
        extractHeadings(sanitizedHtml);
      } else {
        setCleanHtml("");
        setHeadings([]);
      }
      
      const newSlug = slugify(tutorial.title);
      if (tutorialSlug !== newSlug) {
        navigate(`/courses/${courseSlug}/${newSlug}`, { replace: true });
      }

      setFadeIn(true);
    }
  }, [tutorials, tutorialSlug, courseSlug, navigate]);

  // Extracts H1 and H2 tags from sanitized HTML for the "On This Page" sidebar
  const extractHeadings = (htmlContent) => {
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent; // Safe because content is pre-sanitized
      
      const foundHeadings = Array.from(tempDiv.querySelectorAll("h1, h2")).map((el) => ({
        text: el.textContent,
        id: slugify(el.textContent),
      }));
      setHeadings(foundHeadings);
    } catch (error) {
      console.error("Error extracting headings:", error);
      setHeadings([]);
    }
  };
  
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle clicking a new tutorial from the sidebar
  const handleTutorialClick = (tutorial) => {
    setFadeIn(false);
    setTimeout(() => {
      // Navigate to the new tutorial URL, which will trigger the main useEffect
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    }, 200); // Timeout allows for fade-out animation
  };

  // Close mobile sidebar when clicking on the main content
  useEffect(() => {
    const handleClickOutsideContent = (event) => {
      if (
        window.innerWidth <= 768 &&
        sidebarOpen &&
        contentRef.current &&
        contentRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideContent);
    return () => document.removeEventListener("mousedown", handleClickOutsideContent);
  }, [sidebarOpen]);

  return (
    <div className="course-detail-container">
      {/* Left Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>{course?.title?.toUpperCase() || "Loading..."}</h2>
        <p className="course-description">{course?.description || ""}</p>
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
            <li>No tutorials available.</li>
          )}
        </ul>
      </aside>

      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        {/* --- FIX: More intuitive icons */}
        {sidebarOpen ? "❌" : "☰"}
      </button>

      {/* Main Content */}
      <main ref={contentRef} className={`main-content-area ${fadeIn ? "fade-in" : ""}`}>
        {selectedTutorial ? (
          <div>
            <h1>{selectedTutorial.title}</h1>
            <div
              className="tutorial-body"
              // --- FIX: Render the pre-sanitized HTML
              dangerouslySetInnerHTML={{ __html: cleanHtml }} 
            />
          </div>
        ) : (
          <p>Loading tutorial...</p>
        )}
      </main>

      {/* Right Sidebar (Table of Contents) */}
      <aside className="right-sidebar">
        <h3>On This Page</h3>
        {headings.length > 0 ? (
          <ul>
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-headings-message">No sections on this page.</p>
        )}
      </aside>
    </div>
  );
};

export default CourseDetail;