import React, { useEffect, useState } from "react";
import { getQuizBySlug, deleteQuestion } from "../../api/quizApi";
import { useNavigate, useParams } from "react-router-dom";

const ManageQuestions = () => {
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    const response = await getQuizBySlug(slug);
    if (response.success) {
      setQuiz(response.quiz);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const response = await deleteQuestion(questionId);
      if (response.success) {
        fetchQuiz();
      }
    }
  };

  return (
    <div>
      <h2>Manage Questions for {quiz?.title}</h2>
      <button onClick={() => navigate(`/admin/add-question/${slug}`)}>Add Question</button>
      <ul>
        {quiz?.questions?.map((q) => (
          <li key={q.id}>
            {q.questionText}
            <button onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuestions;
