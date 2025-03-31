import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import "./QuizDetail.css";

const QuizDetail = () => {
  const { quizSlug } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizSlug}`);
        setQuiz(response.data.quiz);
      } catch (err) {
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizSlug]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="quiz-detail">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>

      {quiz.paragraphs && (
        <div className="quiz-content">
          {quiz.paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
      )}

      {quiz.bulletPoints && (
        <ul className="quiz-bullets">
          {quiz.bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}

      <h3>Quiz Parts</h3>
      {/* <div className="quiz-parts">
        {quiz.parts.map((part) => (
          <Link key={part.id} to={`/quizzes/${quizSlug}/${part.slug}`} className="quiz-card">
            <h4>{part.title}</h4>
          </Link>
        ))}
      </div> */}
    </div>
  );
};

export default QuizDetail;
