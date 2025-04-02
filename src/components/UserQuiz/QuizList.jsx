import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './QuizList.dark.css'; // Import the dark theme CSS
import axios from "../../api/axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'; // Example icon

const QuizList = () => {
  const [quizCategories, setQuizCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/quizzes");
        const { success, quizzes } = response.data;
        if (success) setQuizCategories(quizzes);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizCategories();
  }, []);

  if (isLoading) return <div className="quiz-list"><h2>Loading quizzes...</h2></div>;

  return (
    <div className="quiz-list">
      <h2>Quiz Categories</h2>
      <div className="quiz-cards">
        {quizCategories.length > 0 ? (
          quizCategories.map((category, index) => (
            <div key={category.id} className="quiz-card" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <Link to={`/quizzes/${category.id}`} className="btn">
                <FontAwesomeIcon icon={faBookOpen} /> Take Quiz
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