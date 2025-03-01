import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import "./MonacoEditor.css";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_KEY = "f8eabb09fbmsh10211bcfd0fc041p1c71ffjsn4b7b09598998"; // Replace with your API key if required

const MonacoEditor = () => {
  const [code, setCode] = useState("// Write your JavaScript code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Mapping languages to Judge0 language IDs
  const languageOptions = {
    javascript: 63,
    python: 71,
    c: 50,
    cpp: 54,
  };

  const handleRun = async () => {
    setOutput("🚀 Running your code...");

    try {
      // Step 1: Send the code to Judge0 API
      const response = await axios.post(
        `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageOptions[language],
          stdin: "", // Standard input if needed
        },
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": API_KEY, // Replace with your actual key
            "Content-Type": "application/json",
          },
        }
      );

      // Step 2: Get the result
      const result = response.data;
      setOutput(result.stdout || result.stderr || "⚠️ No output");
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("❌ Error executing code");
    }
  };

  return (
    
    <div className="code-container">
      {/* Left Side - Code Editor */}
      <div className="editor-container">
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

        {/* Monaco Editor */}
        <Editor
          height="400px"
          theme="vs-dark"
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

        {/* Run Button */}
        <button onClick={handleRun} className="run-button">
          ▶️ Run Code
        </button>

        {/* Output Terminal */}
        <div className="output-box">
          <h3>📜 Output:</h3>
          <pre>{output}</pre>
        </div>
      </div>

      {/* Right Side - Question and Test Cases */}
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
    </div>
  );
};

export default MonacoEditor;
