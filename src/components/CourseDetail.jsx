import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CourseDetail.css";

const BASE_URL = "http://localhost:5000";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    axios.get(`${BASE_URL}/courses/${courseId}`)
      .then(response => {
        if (response.data.success) {
          setCourse(response.data.course);
        }
      })
      .catch(error => console.error("Error fetching course:", error));

    axios.get(`${BASE_URL}/tutorials/${courseId}`)
      .then(response => {
        if (response.data.success) {
          setTutorials(response.data.tutorials);
        }
      })
      .catch(error => console.error("Error fetching tutorials:", error));
  }, [courseId]);

  // Automatically select the first tutorial when tutorials are fetched
  useEffect(() => {
    if (tutorials.length > 0) {
      setSelectedTutorial(tutorials[0]); // Select first tutorial
      setFadeIn(true);
    }
  }, [tutorials]); // Runs when tutorials change

  const handleTutorialClick = (tutorial) => {
    setFadeIn(false);
    setTimeout(() => {
      setSelectedTutorial(tutorial);
      setFadeIn(true);
    }, 200);
  };

  return (
    <div className="course-detail-container">
      {/* 🚀 Sidebar Navigation */}
      <aside className="sidebar">
        <h2>{course ? course.title : "Loading..."}</h2>
        <p className="course-description">{course ? course.description : "Loading..."}</p>
        <ul>
          {tutorials.length > 0 ? (
            tutorials.map((tutorial, index) => (
              <li
                key={tutorial.id || index}
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

      {/* 📖 Tutorial Content Section */}
      <main className={`tutorial-content ${fadeIn ? "fade-in" : ""}`}>
        {selectedTutorial ? (
          <div>
            <h2>{selectedTutorial.title}</h2>
            {(() => {
              try {
                const contentBlocks = JSON.parse(selectedTutorial.content);
                return contentBlocks.map((block, index) => (
                  <div key={index} className={`block-${block.type}`}>
                    {block.type === "h1" && <h1>{block.text}</h1>}
                    {block.type === "p" && <p>{block.text}</p>}
                    {block.type === "code" && (
                      <div className="code-container1">
                        <pre><code>{block.text}</code></pre>
                      </div>
                    )}
                    {block.type === "output" && (
                      <div className="output-box1">
                        <strong>Output:</strong> {block.text}
                      </div>
                    )}
                  </div>
                ));
              } catch (error) {
                console.error("Error parsing tutorial content:", error);
                return <p>Error displaying tutorial content.</p>;
              }
            })()}
          </div>
        ) : (
          <p>Loading tutorial...</p>
        )}
      </main>
    </div>
  );
};

export default CourseDetail;
