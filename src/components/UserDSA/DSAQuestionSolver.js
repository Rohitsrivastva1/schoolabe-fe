import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "./DSAQuestionSolve.css";

const DSAQuestionSolve = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [hasSubmitted, setHasSubmitted] = useState(true); // 🔒 Locking state

  const fetchQuestionDetails = async () => {
    const res = await axios.get(`/api/dsa/questions/${questionId}`);
    setQuestion(res.data);
  };

  const fetchTestCases = async () => {
    const res = await axios.get(`/api/dsa/testcases/all/${questionId}`);
    setTestCases(res.data);
  };

  useEffect(() => {
    fetchQuestionDetails();
    fetchTestCases();
  }, [questionId]);

  useEffect(() => {
    const templates = {
      python: "# Write your code here in Python",
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // your code here\n  return 0;\n}",
      java: "public class Main {\n  public static void main(String[] args) {\n    // your code here\n  }\n}",
      javascript: "// Write your code here in JavaScript",
    };
    setCode(templates[language]);
  }, [language]);

  const runCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/dsa/submissions/run", {
        code,
        language,
        testCases,
      });
      setOutput(res.data.output);

      // ✅ Mark as submitted if backend confirms success
      if (res.data.success) {
        setHasSubmitted(true);
      }
    } catch (err) {
      setOutput("⚠️ Error running code.");
    }
    setLoading(false);
  };

  const getEmbeddedYouTubeUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <div className="dsa-solve-page">
      {question && (
        <>
          {/* LEFT SIDE */}
          <div className="question-section">
            <div className="tabs">
              <button onClick={() => setActiveTab("problem")} className={activeTab === "problem" ? "active" : ""}>🧩 Problem</button>
              <button onClick={() => setActiveTab("explanation")} className={activeTab === "explanation" ? "active" : ""}>📘 Explanation</button>
              <button
  onClick={() => hasSubmitted && setActiveTab("solution")}
  className={activeTab === "solution" ? "active" : ""}
  disabled={!hasSubmitted}
  title={!hasSubmitted ? "Submit code to unlock" : ""}
>
  {!hasSubmitted ? "🔒 Solution" : "🧠 Solution"}
</button>

              <button disabled title="Coming Soon">🔒 🏆 Leaderboard</button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "problem" && (
                <>
                  <h2 className="question-title">{question.title}</h2>
                  <div className="question-description">
                    {typeof question.description === "string" && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(question.description).content,
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              {activeTab === "explanation" && (
                <>
                  {question.explanation && (
                    <div className="explanation-box">
                      <h4>📘 Text Explanation</h4>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                  {question.explanationVideoUrl && (
                    <div className="video-box">
                      <h4>🎥 Explanation Video</h4>
                      <iframe
                        src={getEmbeddedYouTubeUrl(question.explanationVideoUrl)}
                        title="Explanation Video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </>
              )}

              {activeTab === "solution" && (
                hasSubmitted ? (
                  <>
                    {question.solutionText && (
                      <div className="explanation-box">
                        <h4>✅ Solution Explanation</h4>
                        <p>{question.solutionText}</p>
                      </div>
                    )}
                    {question.solutionVideoUrl && (
                      <div className="video-box">
                        <h4>🎥 Solution Video</h4>
                        <iframe
                          src={getEmbeddedYouTubeUrl(question.solutionVideoUrl)}
                          title="Solution Video"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="locked-tab-message">
                    🔒 Submit your solution to unlock the solution tab!
                  </div>
                )
              )}
            </div>

            <div className="language-select">
              <label>🧠 Language:</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="editor-section">
            <Editor
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
            />

            <button className="run-button" onClick={runCode} disabled={loading}>
              {loading ? "Running..." : "🚀 Run Code"}
            </button>

            <div className="output-box">
              <h3>📤 Output:</h3>
              <pre>{output}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DSAQuestionSolve;