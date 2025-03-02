import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { FaPlay, FaDownload, FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import "./MonacoEditor.css";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_KEY = "f8eabb09fbmsh10211bcfd0fc041p1c71ffjsn4b7b09598998"; // Replace with your API key if required

const MonacoEditor = () => {
  const [code, setCode] = useState("// Write your JavaScript code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");

  // Auto-save to localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedCode", code);
  }, [code]);

  // Language options mapping
  const languageOptions = {
    javascript: 63,
    python: 71,
    c: 50,
    cpp: 54,
  };

  const handleRun = async () => {
    setOutput("🚀 Running your code...");

    try {
      const response = await axios.post(
        `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageOptions[language],
          stdin: "",
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      setOutput(result.stdout || result.stderr || "⚠️ No output");
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("❌ Error executing code");
    }
  };

  // Download Code as File
  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="code-container">
      {/* Left Side - Question */}
      <div className="question-container">
        <h2>📝 Question: Reverse a String</h2>
        <p>
          Write a function <code>reverseString(str)</code> that takes a string
          as input and returns the reversed string.
        </p>

        <h3>✅ Example Test Cases:</h3>
        <ul>
          <li>
            <code>reverseString("hello")</code> → <code>"olleh"</code>
          </li>
          <li>
            <code>reverseString("world")</code> → <code>"dlrow"</code>
          </li>
        </ul>
      </div>

      {/* Right Side - Code Editor */}
      <div className="editor-container">
        {/* Top Bar with Icons */}
        <div className="top-bar">
          {/* Language Selector */}
          <select
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>

          {/* Theme Toggle Icon */}
          <FaSun
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
          />
        </div>

        {/* Monaco Editor */}
        <Editor
          height="350px"
          theme={theme}
          defaultLanguage="javascript"
          value={code}
          onChange={setCode}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />

        {/* Action Icons */}
        <div className="icon-container">
          <FaPlay className="icon-btn run-btn" onClick={handleRun} />
          <FaDownload className="icon-btn download-btn" onClick={downloadCode} />
        </div>

        {/* Output Terminal */}
        <div className="output-box">
          <h3>📜 Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;
