// 📂 src/components/TutorialEditor.js
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import "./TutorialEditor.css"; // Import styles
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../services/authService"; // Import checkAuth function
const TutorialEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
        const fetchUser = async () => {
          const userData = await checkAuth();
          if (!userData) {
            navigate("/signup"); // Redirect if not logged in
          } else {
            setUser(userData); // Set user state if logged in
          }
        };
        fetchUser();
      }, [navigate]);
  // Add a new content block
  const addBlock = (type) => {
    setContent([...content, { id: uuidv4(), type, text: "" }]);
  };

  // Update the text of a block
  const updateBlock = (id, newText) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  // Remove a block
  const removeBlock = (id) => {
    setContent(content.filter((block) => block.id !== id));
  };

  // Save the tutorial
  const handleSave = async () => {
    const tutorialData = { title, content };

    try {
      const response = await fetch("http://localhost:5000/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tutorialData),
      });

      if (response.ok) {
        alert("Tutorial saved successfully!");
        setTitle("");
        setContent([]);
      } else {
        alert("Error saving tutorial.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="editor-container">
      <h2>Create Tutorial</h2>

      <input
        type="text"
        placeholder="Tutorial Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      <div className="content-list">
        {content.map((block) => (
          <div key={block.id} className={`content-block ${block.type}`}>
            {block.type === "code" ? (
              <pre>
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Enter code..."
                />
              </pre>
            ) : (
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder={`Enter ${block.type}...`}
              />
            )}
            <button onClick={() => removeBlock(block.id)} className="delete-btn">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Buttons to add new blocks */}
      <div className="editor-actions">
        <button onClick={() => addBlock("h1")}>Add H1</button>
        <button onClick={() => addBlock("h2")}>Add H2</button>
        <button onClick={() => addBlock("p")}>Add Paragraph</button>
        <button onClick={() => addBlock("code")}>Add Code</button>
        <button onClick={() => addBlock("output")}>Add Output</button>
      </div>

      <button className="save-btn" onClick={handleSave}>
        <FaSave /> Save Tutorial
      </button>
    </div>
  );
};

export default TutorialEditor;
