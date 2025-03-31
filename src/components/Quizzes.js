import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import "./Quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("/api/quizzes");
        setQuizzes(response.data.quizzes);
      } catch (err) {
        setError("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="quiz-list">
      <h2>Available Quizzes</h2>
      <div className="quiz-cards">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} to={`/quizzes/${quiz.slug}`} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
