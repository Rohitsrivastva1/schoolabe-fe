// DSAQuestionSolve.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import "./DSAQuestionSolve.css";

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
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionRes, testCaseRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/dsa/questions/${questionId}`),
          axios.get(`${BASE_URL}/api/dsa/testcases/all/${questionId}`),
        ]);
        const q = questionRes.data;
        try {
          const parsedDesc = JSON.parse(q.description);
          q.description = parsedDesc.content;
        } catch (e) {
          console.error("Failed to parse question description");
        }
        setQuestion(q);
        setTestCases(testCaseRes.data);
      } catch {
        toast.error("⚠️ Failed to load question or test cases.");
      }
    };
    fetchData();
  }, [questionId]);

  useEffect(() => {
    setCode(defaultTemplates[language]);
  }, [language]);

  const runCode = async (isSubmission = false) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/dsa/submissions/run`, {
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
    } catch {
      setOutput("⚠️ Error running code.");
      toast.error("Something went wrong while running the code.");
    }
    setLoading(false);
    document.querySelector(".output-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const getEmbeddedYouTubeUrl = (url) => {
    if (!url) return "";
    const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const handleTabClick = (tab) => {
    if (tab === "problem") return setActiveTab("problem");
    if (!hasSubmitted) {
      toast.error("🚫 Submit your solution to unlock this tab.");
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white mt-[55px]">
      {question && (
        <>
          {/* LEFT PANEL */}
          <div className="w-1/2 border-r border-gray-700 overflow-auto p-6">
            <div className="flex space-x-4 mb-4">
              {["problem", "explanation", "solution"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-1 rounded ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
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

            <div className="space-y-4">
              {activeTab === "problem" && (
                <>
                  <h2 className="text-xl font-bold">{question.title}</h2>
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: question.description }}
                  />
                </>
              )}
              {activeTab === "explanation" &&
                (question.explanationVideo ? (
                  <iframe
                    width="100%"
                    height="315"
                    src={getEmbeddedYouTubeUrl(question.explanationVideo)}
                    title="Explanation Video"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p>📽️ No explanation video available.</p>
                ))}
              {activeTab === "solution" && (
                <div dangerouslySetInnerHTML={{ __html: question.solution }} />
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-1/2 flex flex-col p-4 space-y-4">
  {/* Fixed Header */}
  <div className="flex justify-between items-center">
    <label className="text-sm">
      Language:&nbsp;
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 text-white px-2 py-1 rounded"
      >
        {Object.keys(defaultTemplates).map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
    <div className="space-x-2">
      <button
        className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
        onClick={() => runCode(false)}
      >
        🚀 Run
      </button>
      <button
        className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded"
        onClick={() => runCode(true)}
      >
        🏁 Submit
      </button>
    </div>
  </div>

  {/* Scrollable Content */}
  <div className="overflow-y-auto space-y-4 flex-1">
    {/* 🧠 Editor (Resizable below) */}
    <div className="resizable-editor">
      <Editor
        height="300px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{ fontSize: 13 }}
      />
    </div>

    {/* 🔍 Sample Test Cases & Custom Input */}
    <div className="flex gap-4">
      <div className="w-1/2">
        <h4 className="font-bold">🧪 Sample Test Cases</h4>
        {testCases.filter((tc) => tc.isPublic).map((tc, idx) => (
          <div key={idx} className="bg-gray-800 p-2 my-2 rounded">
            <p><strong>Input:</strong> {tc.input}</p>
            <p><strong>Expected:</strong> {tc.expectedOutput}</p>
          </div>
        ))}
      </div>
      <div className="w-1/2">
        <h4 className="font-bold">✍️ Custom Input</h4>
        <textarea
          className="w-full bg-gray-800 text-white p-2 rounded h-28"
          placeholder="Enter custom input..."
          value={customTestCase}
          onChange={(e) => setCustomTestCase(e.target.value)}
        />
      </div>
    </div>

    {/* 📤 Output */}
    <div className="output-section">
      <h4 className="text-lg font-semibold">📤 Output</h4>
      {loading ? (
        <div className="flex items-center space-x-4">
          <ThreeDots height="50" width="50" color="#00BFFF" visible={true} />
          <span>Running your code...</span>
        </div>
      ) : (
        <pre className="bg-black text-green-400 p-4 mt-2 rounded max-h-48 overflow-y-auto">
          {output}
        </pre>
      )}
    </div>
  </div>
</div>

        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default DSAQuestionSolve;
