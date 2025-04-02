import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../quizStyles.css';
import axios from "../../api/axiosInstance"; // Ensure this is correctly set up

const QuizList = () => {
  const [quizCategories, setQuizCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizCategories = async () => {
      try {
        const response = await axios.get("/api/quizzes"); // POST request
        console.log("Response:", response.data); // Correct way to access data

        const { success, quizzes } = response.data; // Axios returns data in `response.data`
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
