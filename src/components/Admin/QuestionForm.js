import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuestionForm = () => {
  const { slug } = useParams(); // Get quiz slug from URL
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Handle option change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // ✅ Handle checkbox selection for correct answers
  const handleCheckboxChange = (option) => {
    if (correctAnswers.includes(option)) {
      setCorrectAnswers(correctAnswers.filter((ans) => ans !== option));
    } else {
      setCorrectAnswers([...correctAnswers, option]);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!questionText || options.some((opt) => opt === "")) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${slug}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, options, correctAnswers, explanation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add question.");
      }

      setSuccess("Question added successfully!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswers([]);
      setExplanation("");

      setTimeout(() => navigate(`/admin/manage-questions/${slug}`), 1000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Add Question</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Question Text:</label>
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />

        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            <input
              type="checkbox"
              checked={correctAnswers.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <span> Mark as Correct</span>
          </div>
        ))}

        <label>Explanation:</label>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} />

        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default QuestionForm;
