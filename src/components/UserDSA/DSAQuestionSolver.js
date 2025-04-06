import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "./DSAQuestionSolve.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";

const defaultTemplates = {
  python: "# Write your code here in Python",
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // your code here\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    // your code here\n  }\n}`,
  javascript: "// Write your code here in JavaScript",
};

const DSAQuestionSolve = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [customTestCase, setCustomTestCase] = useState("");
  const [code, setCode] = useState(defaultTemplates.python);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [codeTab, setCodeTab] = useState("testcases"); // new state for tabs

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionRes, testCaseRes] = await Promise.all([
          axios.get(`/api/dsa/questions/${questionId}`),
          axios.get(`/api/dsa/testcases/all/${questionId}`),
        ]);
        const q = questionRes.data;
        try {
          const parsedDesc = JSON.parse(q.description);
          q.description = parsedDesc.content; // Extract only the content
        } catch (e) {
          console.error("Failed to parse question description");
        }
        setQuestion(q);
        setTestCases(testCaseRes.data);
      } catch (err) {
        toast.error("⚠️ Failed to load question or test cases.");
      }
    };
    fetchData();
  }, [questionId]);

  useEffect(() => {
    setCode(defaultTemplates[language]);
  }, [language]);

  const getEmbeddedYouTubeUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const runCode = async (isSubmission = false) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/dsa/submissions/run", {
        code,
        language,
        testCases: isSubmission ? testCases : testCases.filter((tc) => tc.isPublic),
        customTestCase: customTestCase.trim() || null,
      });
      setOutput(res.data.output);
      if (isSubmission && res.data.success) {
        setHasSubmitted(true);
        toast.success("🎉 Code submitted successfully!");
      }
    } catch (err) {
      setOutput("⚠️ Error running code.");
      toast.error("Something went wrong while running the code.");
    }
    setLoading(false);
    document.querySelector(".output-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTabClick = (tab) => {
    if (tab === "problem") return setActiveTab("problem");
    if (!hasSubmitted) {
      toast.error("🚫 Submit your solution to unlock this tab.", {
        toastId: `lock-${tab}-tab`,
      });
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="dsa-solve-page">
      {question && (
        <>
          {/* LEFT PANEL */}
          <div className="question-section">
            <div className="tabs">
              {["problem", "explanation", "solution"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab === "problem"
                    ? "🧩 Problem"
                    : tab === "explanation"
                    ? hasSubmitted
                      ? "📘 Explanation"
                      : "🔒 Explanation"
                    : hasSubmitted
                    ? "✅ Solution"
                    : "🔒 Solution"}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === "problem" && (
                <>
                  <h2>{question.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: question.description }} />
                </>
              )}

              {activeTab === "explanation" && (
                question.explanationVideo ? (
                  <iframe
                    width="100%"
                    height="315"
                    src={getEmbeddedYouTubeUrl(question.explanationVideo)}
                    title="Explanation Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : <p>📽️ No explanation video available.</p>
              )}

              {activeTab === "solution" && (
                <div dangerouslySetInnerHTML={{ __html: question.solution }} />
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="editor-section">
            <div className="editor-header">
              <label>
                Language:&nbsp;
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {Object.keys(defaultTemplates).map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </label>
            </div>

            <Editor
              height="300px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />

            <div className="testcases-section">
              <h3>Test Cases</h3>
              <div className="testcase-split-box">
                <div className="public-testcases">
                  <h4>🧪 Sample Test Cases</h4>
                  {testCases.filter(tc => tc.isPublic).map((tc, index) => (
                    <div key={index} className="testcase">
                      <p><strong>Input:</strong> {tc.input}</p>
                      <p><strong>Expected:</strong> {tc.expectedOutput}</p>
                    </div>
                  ))}
                </div>
                <div className="custom-testcase">
                  <h4>✍️ Custom Input</h4>
                  <textarea
                    placeholder="Enter custom input here..."
                    value={customTestCase}
                    onChange={(e) => setCustomTestCase(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => runCode(false)}>🚀 Run Code</button>
              <button onClick={() => runCode(true)}>🏁 Submit</button>
            </div>

            <div className="output-section">
              <h4>📤 Output</h4>
              {loading ? (
                <div className="loader">
                  <ThreeDots height="50" width="50" color="#00BFFF" visible={true} />
                  <p>Running your code...</p>
                </div>
              ) : (
                <pre>{output}</pre>
              )}
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default DSAQuestionSolve;
