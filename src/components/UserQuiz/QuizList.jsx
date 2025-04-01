import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../quizStyles.css';

const QuizList = () => {
  const [quizCategories, setQuizCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizCategories = async () => {
      try {
        const response = await fetch("/api/quizzes");
        if (!response.ok) throw new Error('Failed to fetch');
        const { success, quizzes } = await response.json();
        if (success) setQuizCategories(quizzes);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizCategories();
  }, []);

  if (isLoading) return <div>Loading quizzes...</div>;

  return (
    <div className="quiz-list">
      <h2>Quiz Categories</h2>
      <div className="quiz-cards">
        {quizCategories.length > 0 ? (
          quizCategories.map((category) => (
            <div key={category.id} className="quiz-card">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <Link to={`/quizzes/${category.id}`} className="btn">
                Take Quiz
              </Link>
            </div>
          ))
        ) : (
          <p>No quizzes available</p>
        )}
      </div>
    </div>
  );
};

export default QuizList;