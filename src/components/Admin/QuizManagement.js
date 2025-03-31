import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes",);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const createQuiz = async () => {
    try {
      await axios.post("/api/quizzes", { title, description, category });
      fetchQuizzes();
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const deleteQuiz = async (slug) => {
    try {
      await axios.delete(`/api/quizzes/${slug}`);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div>
      <h2>Quiz Management</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <button onClick={createQuiz}>Create Quiz</button>

      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title} - {quiz.slug} <button onClick={() => deleteQuiz(quiz.slug)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizManagement;
