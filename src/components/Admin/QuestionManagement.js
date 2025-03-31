import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const QuestionManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes");
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchQuestions = async (slug) => {
    try {
      const response = await axios.get(`/api/quizzes/${slug}`);
      setQuestions(response.data.quiz.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const addQuestion = async () => {
    try {
      await axios.post(`/api/quizzes/${selectedQuiz}/questions`, {
        questionText,
        options,
        correctAnswers,
      });
      fetchQuestions(selectedQuiz);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <div>
      <h2>Question Management</h2>

      <select onChange={(e) => setSelectedQuiz(e.target.value)}>
        <option value="">Select Quiz</option>
        {quizzes.map((quiz) => (
          <option key={quiz.id} value={quiz.slug}>
            {quiz.title}
          </option>
        ))}
      </select>

      <button onClick={() => fetchQuestions(selectedQuiz)}>Load Questions</button>

      <input value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Question Text" />

      {options.map((option, index) => (
        <input
          key={index}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${index + 1}`}
        />
      ))}

      <button onClick={addQuestion}>Add Question</button>

      <ul>
        {questions.map((q) => (
          <li key={q.id}>{q.questionText}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManagement;
