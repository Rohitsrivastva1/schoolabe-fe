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

  const extractHeadings = (htmlContent) => {
    try {
      const tempDiv = document.createElement("div");
      console.log(htmlContent);
      tempDiv.innerHTML = htmlContent;
      console.log(tempDiv.innerHTML);
      
      const headings = Array.from(tempDiv.querySelectorAll("h1, h2")).map(
        (el) => ({
          text: el.textContent,
          id: slugify(el.textContent),
        })
      );
      console.log(headings);
      
      setHeadings(headings);
    } catch (error) {
      console.error("Error extracting headings:", error);
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
            <div
        className="tutorial-content"
        dangerouslySetInnerHTML={{ __html: selectedTutorial.content.html }} 
      />
            
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
