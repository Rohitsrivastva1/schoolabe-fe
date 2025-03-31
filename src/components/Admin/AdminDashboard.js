import React, { useEffect, useState } from "react";
import { getQuizzes, deleteQuiz } from "../../api/quizApi";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const response = await getQuizzes();
    if (response.success) {
      setQuizzes(response.quizzes);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      const response = await deleteQuiz(slug);
      if (response.success) {
        fetchQuizzes();
      }
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate("/admin/create-quiz")}>Create Quiz</button>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title} 
            <button onClick={() => navigate(`/admin/edit-quiz/${quiz.slug}`)}>Edit</button>
            <button onClick={() => navigate(`/admin/manage-questions/${quiz.slug}`)}>Manage Questions</button>
            <button onClick={() => handleDelete(quiz.slug)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
