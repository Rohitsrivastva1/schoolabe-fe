import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";
import "./TutorialEditor.css"; // Styling

const TutorialEditor = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);

  // Add new content block
  const addBlock = (type) => {
    setContent([...content, { id: uuidv4(), type, text: "" }]);
  };

  // Update text in content block
  const updateBlock = (id, newText) => {
    setContent(content.map(block => block.id === id ? { ...block, text: newText } : block));
  };

  // Remove content block
  const removeBlock = (id) => {
    setContent(content.filter(block => block.id !== id));
  };

  // Save tutorial
  const handleSave = () => {
    const tutorialData = { title, content };
    console.log(tutorialData);
    
    // onSave(tutorialData); // Pass data to parent (or API)
  };

  return (
    <div className="editor-container">
    <br></br>
  
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
        <button onClick={() => addBlock("h1")}>Add Heading</button>
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
