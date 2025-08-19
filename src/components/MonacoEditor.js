import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { 
  FaPlay, 
  FaDownload, 
  FaSun, 
  FaMoon, 
  FaCrown, 
  FaLock, 
  FaCode, 
  FaTerminal, 
  FaLightbulb,
  FaRocket,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaSave,
  FaUndo,
  FaRedo,
  FaLongArrowAltRight
} from "react-icons/fa";
import axios from "axios";
import "./MonacoEditor.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../services/authService";
import MembershipApi from "../api/membershipApi";
import { toast } from "react-toastify";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const API_KEY = "f8eabb09fbmsh10211bcfd0fc041p1c71ffjsn4b7b09598998";

const MonacoEditor = () => {
  const [code, setCode] = useState(`// Welcome to Schoolabe Code Editor! 🚀
// Write your JavaScript code here...

function reverseString(str) {
  // Your code here
  return str.split('').reverse().join('');
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"
console.log(reverseString("world")); // Should output: "dlrow"`);

  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [codeHistory, setCodeHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const userData = await checkAuth();
        if (!userData) {
          navigate("/signup");
          return;
        }

        const accessResponse = await MembershipApi.checkPremiumAccess();
        if (accessResponse.success) {
          setHasPremiumAccess(accessResponse.hasPremiumAccess);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasPremiumAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("savedCode", code);
    // Add to history
    setCodeHistory(prev => [...prev.slice(0, historyIndex + 1), code]);
    setHistoryIndex(prev => prev + 1);
  }, [code]);

  const languageOptions = {
    javascript: { id: 63, name: "JavaScript", icon: "⚡" },
    python: { id: 71, name: "Python", icon: "🐍" },
    c: { id: 50, name: "C", icon: "🔧" },
    cpp: { id: 54, name: "C++", icon: "⚙️" },
    java: { id: 62, name: "Java", icon: "☕" },
    go: { id: 60, name: "Go", icon: "🐹" }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("🚀 Running your code...");

    try {
      const response = await axios.post(
        `${JUDGE0_API_URL}?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageOptions[language].id,
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
      if (result.stdout) {
        setOutput(`✅ Output:\n${result.stdout}`);
        toast.success("Code executed successfully!");
      } else if (result.stderr) {
        setOutput(`❌ Error:\n${result.stderr}`);
        toast.error("Code execution failed!");
      } else {
        setOutput("⚠️ No output");
        toast.warning("Code executed but no output generated");
      }
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("❌ Error executing code");
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Code downloaded successfully!");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const saveCode = () => {
    localStorage.setItem(`savedCode_${language}`, code);
    toast.success("Code saved locally!");
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(codeHistory[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  if (loading) {
    return (
      <div className="code-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Checking Premium Access...</h3>
          <p>Please wait while we verify your subscription</p>
        </div>
      </div>
    );
  }

  if (!hasPremiumAccess) {
    return (
      <div className="code-container">
        <div className="premium-access-container">
          <div className="premium-access-content">
            <div className="premium-header">
              <FaLock className="lock-icon" />
              <h2>🚀 Premium Code Editor</h2>
              <p>Unlock the power of advanced coding with our premium Monaco Editor</p>
            </div>
            
            <div className="premium-features-grid">
              <div className="feature-card">
                <FaCode className="feature-icon" />
                <h4>Advanced Monaco Editor</h4>
                <p>Professional-grade code editor with IntelliSense</p>
              </div>
              <div className="feature-card">
                <FaTerminal className="feature-icon" />
                <h4>Real-time Execution</h4>
                <p>Run code instantly with multiple language support</p>
              </div>
              <div className="feature-card">
                <FaLightbulb className="feature-icon" />
                <h4>Smart Autocomplete</h4>
                <p>AI-powered code suggestions and error detection</p>
              </div>
              <div className="feature-card">
                <FaRocket className="feature-icon" />
                <h4>Performance Optimized</h4>
                <p>Lightning-fast editor with smooth performance</p>
              </div>
            </div>

            <div className="premium-stats">
              <div className="stat">
                <span className="stat-number">6+</span>
                <span className="stat-label">Languages</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Executions</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Access</span>
              </div>
            </div>

            <button 
              className="upgrade-btn"
              onClick={() => navigate('/membership')}
            >
              <FaCrown />
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="code-container">
      {/* Header */}
      <div className="code-header">
        <div className="header-left">
          <FaCode className="header-icon" />
          <h1>Schoolabe Code Editor</h1>
          <span className="premium-badge">
            <FaCrown />
            Premium
          </span>
        </div>
        <div className="header-right">
          <button 
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
          >
            {theme === "vs-dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <div className="main-content">
        {/* Left Side - Problem & Hints */}
        <div className="left-panel">
          <div className="problem-section">
            <h2>📝 Coding Challenge</h2>
            <div className="problem-card">
              <h3>Reverse a String</h3>
              <p>Write a function that takes a string and returns it reversed.</p>
              
              <div className="example-section">
                <h4>Example Test Cases:</h4>
                <div className="test-cases">
                  <div className="test-case">
                    <span className="input">Input:</span>
                    <code>"hello"</code>
                    <FaLongArrowAltRight className="arrow" />
                    <span className="output">Output:</span>
                    <code>"olleh"</code>
                    <FaCheckCircle className="check" />
                  </div>
                  <div className="test-case">
                    <span className="input">Input:</span>
                    <code>"world"</code>
                    <FaLongArrowAltRight className="arrow" />
                    <span className="output">Output:</span>
                    <code>"dlrow"</code>
                    <FaCheckCircle className="check" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showHints && (
            <div className="hints-section">
              <h3>💡 Hints</h3>
              <div className="hint-card">
                <ul>
                  <li>Use string methods like <code>split()</code> and <code>join()</code></li>
                  <li>Consider using the <code>reverse()</code> array method</li>
                  <li>Don't forget to handle edge cases</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Editor & Output */}
        <div className="right-panel">
          <div className="editor-section">
            <div className="editor-header">
              <div className="language-selector">
                <select
                  onChange={(e) => setLanguage(e.target.value)}
                  value={language}
                >
                  {Object.entries(languageOptions).map(([key, lang]) => (
                    <option key={key} value={key}>
                      {lang.icon} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="editor-actions">
                <button 
                  className="action-btn undo-btn" 
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <FaUndo />
                </button>
                <button 
                  className="action-btn redo-btn" 
                  onClick={redo}
                  disabled={historyIndex >= codeHistory.length - 1}
                >
                  <FaRedo />
                </button>
                <button className="action-btn save-btn" onClick={saveCode}>
                  <FaSave />
                </button>
                <button className="action-btn copy-btn" onClick={copyCode}>
                  <FaCopy />
                </button>
                <button className="action-btn download-btn" onClick={downloadCode}>
                  <FaDownload />
                </button>
              </div>
            </div>

            <div className="editor-wrapper">
              <Editor
                height="400px"
                theme={theme}
                defaultLanguage="javascript"
                value={code}
                onChange={setCode}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible"
                  },
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  parameterHints: {
                    enabled: true
                  }
                }}
              />
            </div>

            <div className="run-section">
              <button 
                className={`run-btn ${isRunning ? 'running' : ''}`}
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <div className="spinner"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <FaPlay />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="output-section">
            <div className="output-header">
              <h3>📜 Output</h3>
              <button className="clear-btn" onClick={clearOutput}>
                <FaTimesCircle />
                Clear
              </button>
            </div>
            <div className="output-terminal">
              <pre>{output || "// Your code output will appear here..."}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;