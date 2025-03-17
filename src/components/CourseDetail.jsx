import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetail.css";

const BASE_URL = "";

const CourseDetail = () => {
  const { courseSlug, tutorialSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  // Utility function to convert a title into a slug format
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
          console.log("Tutorials fetched:", response.data.tutorials);
        }
      })
      .catch((error) => console.error("Error fetching tutorials:", error));
  }, [courseSlug]);

  // Select first tutorial when tutorials are loaded
  useEffect(() => {
    if (tutorials.length === 0) return;

    let tutorial =
      tutorials.find((t) => slugify(t.title) === tutorialSlug) || tutorials[0];

    setSelectedTutorial(tutorial);
    setFadeIn(true);

    // Fix: Update URL if tutorialSlug is missing or invalid
    if (!tutorialSlug || tutorialSlug !== slugify(tutorial.title)) {
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`, { replace: true });
    }

    console.log("Selected tutorial:", tutorial);
  }, [tutorials, tutorialSlug, navigate, courseSlug]);

  // Logs selected tutorial when it changes (Fix for delayed state logging)
  useEffect(() => {
    console.log("Updated selected tutorial:", selectedTutorial);
  }, [selectedTutorial]);

  const handleTutorialClick = (tutorial) => {
    console.log("Tutorial clicked:", tutorial);
    setFadeIn(false);
    
    setTimeout(() => {
      setSelectedTutorial(tutorial);
      setFadeIn(true);
      navigate(`/courses/${courseSlug}/${slugify(tutorial.title)}`);
    }, 200);
  };

  return (
    <div className="course-detail-container">
      <aside className="sidebar">
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

      <main className={`tutorial-content ${fadeIn ? "fade-in" : ""}`}>
        {selectedTutorial &&
        selectedTutorial.content &&
        typeof selectedTutorial.content === "string" ? (
          <div>
            <h2>{selectedTutorial.title}</h2>
            {JSON.parse(selectedTutorial.content).map((block, index) => (
              <div key={index} className={`block-${block.type}`}>
                {block.type === "text" && <p>{block.text}</p>}
                {block.type === "h1" && <h1>{block.text}</h1>}
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
    </div>
  );
};

export default CourseDetail;
