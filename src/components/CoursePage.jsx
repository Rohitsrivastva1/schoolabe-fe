import React from "react";
import { useParams } from "react-router-dom";
import courseData from "../data/courses.json";
import "./courseStyles.css"; // Import CSS

const CoursePage = () => {
  const { course, topicId } = useParams();
  const topic = courseData[course]?.[topicId];

  if (!topic) {
    return <h2 className="not-found">Topic Not Found</h2>;
  }

  return (
    <div className="course-layout">
      <div className="course-content">
        <h1 className="course-title">{topic.title}</h1>

        {topic.content.map((item, index) => {
          if (item.type === "h1") return <h1 key={index}>{item.text}</h1>;
          if (item.type === "p") return <p key={index}>{item.text}</p>;
          if (item.type === "code")
            return (
              <div className="code-container1" key={index}>
                <div className="code-header">💻 Code Example</div>
                <pre className="code-block">
                  <code>{item.text}</code>
                </pre>
              </div>
            );
          if (item.type === "output")
            return (
              <div className="output-box1" key={index}>
                <strong>🔹 Output:</strong> {item.text}
              </div>
            );
          return null;
        })}
      </div>
    </div>
  );
};

export default CoursePage;
