import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./QuizDetail.dark.css"; // Import the dark theme CSS
import axios from "../../api/axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'; // Example icon

const QuizDetail = () => {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/quizzes/${id}`);

        if (response.data.success && response.data.quiz) {
          setQuizzes(response.data.quiz.quizzes || []);
        } else {
          setError("Failed to load quizzes.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Quizzes not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [id]);

  if (isLoading) return <div className="quiz-detail-container"><h2>Loading quizzes...</h2></div>;
  if (error) return <div className="quiz-detail-container"><div className="error-message">{error}</div></div>;
  if (quizzes.length === 0) return <div className="quiz-detail-container"><div className="error-message">No quizzes available for this category.</div></div>;

  return (
    <div className="quiz-detail-container">
      <h2 className="quiz-detail-title">Available Quizzes</h2>
      <div className="quiz-list-detail">
        {quizzes.map((quiz, index) => (
          <div key={quiz.id} className="quiz-card-detail" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
            <h3 className="quiz-card-title">{quiz.title}</h3>
            <p className="quiz-card-description">{quiz.description || "No description available."}</p>

            <Link to={`/quizzes/${id}/attempt/${quiz.id}`} className="quiz-card-button">
              <FontAwesomeIcon icon={faPlayCircle} /> Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDetail;