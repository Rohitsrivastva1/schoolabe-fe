import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminDSA.css";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

const QuestionManager = () => {
  const { categoryId } = useParams();
  const [categoryTitle, setCategoryTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    explanation: "",
    questionVideoUrl: "",
    solutionVideoUrl: "",
  });

  const navigate = useNavigate();

  const fetchCategoryTitle = async () => {
    const res = await axios.get(`${BASE_URL}/api/dsa/categories/${categoryId}`);
    setCategoryTitle(res.data.name); // Adjust based on your backend response
  };

  const fetchQuestions = async () => {
    const res = await axios.get(`${BASE_URL}/api/dsa/questions/category/${categoryId}`);
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchCategoryTitle();
    fetchQuestions();
  }, [categoryId]);

  const createQuestion = async () => {
    await axios.post(`${BASE_URL}/api/dsa/questions`, {
      ...form,
      description: JSON.stringify({ type: "rich", content: form.description }),
      DsaCategoryId: categoryId,
    });
    setForm({
      title: "",
      description: "",
      explanation: "",
      questionVideoUrl: "",
      solutionVideoUrl: "",
    });
    fetchQuestions();
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "code"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "code",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="question-manager-container">
      {/* Left: Form Column */}
      <div className="question-form-column">
        <h1>📁 {categoryTitle} - Questions</h1>
        <h2>🧠 Add Question</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label>📝 Problem Description</label>
        <ReactQuill
          theme="snow"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Write your question description here..."
        />

        <label>💡 Explanation</label>
        <ReactQuill
          theme="snow"
          value={form.explanation}
          onChange={(value) => setForm({ ...form, explanation: value })}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Write solution explanation here..."
        />

        <input
          type="text"
          placeholder="Question Video URL"
          value={form.questionVideoUrl}
          onChange={(e) => setForm({ ...form, questionVideoUrl: e.target.value })}
        />
        <input
          type="text"
          placeholder="Solution Video URL"
          value={form.solutionVideoUrl}
          onChange={(e) => setForm({ ...form, solutionVideoUrl: e.target.value })}
        />

        <button onClick={createQuestion}>+ Add Question</button>
      </div>

      {/* Right: Question Cards Column */}
      <div className="question-list-column">
        <h2>📋 Existing Questions</h2>
        <div className="question-cards">
          {questions.map((q) => (
            <div
              key={q.id}
              className="question-card"
              onClick={() => navigate(`/admin/dsa/testcases/${q.id}`)}
            >
              {q.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;
