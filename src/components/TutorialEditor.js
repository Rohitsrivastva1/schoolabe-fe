// 📂 src/components/TutorialEditor.js
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaTrash, FaSave, FaCopy } from "react-icons/fa";
import "./TutorialEditor.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../services/authService";

const TutorialEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

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

  const addBlock = (type) => {
    setContent([...content, { id: uuidv4(), type, text: "" }]);
  };

  const updateBlock = (id, newText) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, text: newText } : block
      )
    );
  };

  const removeBlock = (id) => {
    setContent(content.filter((block) => block.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent([...content, { id: uuidv4(), type: "image", src: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const tutorialData = { title, content };
    try {
      const response = await fetch(`${BASE_URL}/tutorials`, {
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

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const handleCreateLink = () => {
    const url = prompt("Enter the URL:");
    if (url) document.execCommand("createLink", false, url);
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
              <div className="code-container">
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(block.text)}>
                  <FaCopy /> Copy
                </button>
                <pre>
                  <textarea
                    value={block.text}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    placeholder="Enter code..."
                  />
                </pre>
              </div>
            ) : block.type === "image" ? (
              <img src={block.src} alt="Uploaded" className="uploaded-image" />
            ) : block.type === "ol" ? (
              <ol contentEditable onInput={(e) => updateBlock(block.id, e.target.innerHTML)}>
                <li>List item</li>
              </ol>
            ) : block.type === "ul" ? (
              <ul contentEditable onInput={(e) => updateBlock(block.id, e.target.innerHTML)}>
                <li>List item</li>
              </ul>
            ) : (
              <p
                contentEditable
                onInput={(e) => updateBlock(block.id, e.target.innerHTML)}
                dangerouslySetInnerHTML={{ __html: block.text }}
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
        <button onClick={() => addBlock("h1")}>H1</button>
        <button onClick={() => addBlock("h2")}>H2</button>
        <button onClick={() => addBlock("h3")}>H3</button>
        <button onClick={() => addBlock("h4")}>H4</button>
        <button onClick={() => addBlock("p")}>Paragraph</button>
        <button onClick={() => addBlock("code")}>Code</button>
        <button onClick={() => addBlock("output")}>Output</button>
        <button onClick={() => addBlock("ol")}>Ordered List</button>
        <button onClick={() => addBlock("ul")}>Unordered List</button>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
      </div>

      {/* Text Formatting Buttons */}
      <div className="format-actions">
        <button onClick={() => handleFormat("bold")}>Bold</button>
        <button onClick={() => handleFormat("underline")}>Underline</button>
        <button onClick={handleCreateLink}>Hyperlink</button>
      </div>

      <button className="save-btn" onClick={handleSave}>
        <FaSave /> Save Tutorial
      </button>
    </div>
  );
};

export default TutorialEditor;
