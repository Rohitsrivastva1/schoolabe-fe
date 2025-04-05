import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminDSA.css";

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
    const res = await axios.get(`/api/dsa/questions/category/${categoryId}`);
    setCategoryTitle(res.data.name); // Adjust based on your backend response
  };

  const fetchQuestions = async () => {
    const res = await axios.get(`/api/dsa/questions/category/${categoryId}`);
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchCategoryTitle();
    fetchQuestions();
  }, [categoryId]);

  const createQuestion = async () => {
    await axios.post("/api/dsa/questions", {
      ...form,
      description: JSON.stringify({ type: "paragraph", content: form.description }),
      DsaCategoryId: categoryId,
    });
    setForm({ title: "", description: "", explanation: "", questionVideoUrl: "", solutionVideoUrl: "" });
    fetchQuestions();
  };

  return (
    <div className="admin-container">
      <h1>📁 {categoryTitle} - Questions</h1>
      <h2>🧠 Add Question</h2>

      <div className="form-column">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description (JSON or simple text)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Explanation"
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
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

      <div className="cards-container">
        {questions.map((q) => (
          <div
            key={q.id}
            className="admin-card"
            onClick={() => navigate(`/admin/dsa/testcases/${q.id}`)}
          >
            {q.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionManager;
