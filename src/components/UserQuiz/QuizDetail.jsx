import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axiosInstance"; // Assuming you have a centralized Axios instance
import '../quizStyles.css';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`/quizzes/${id}`);
        const { success, quiz } = response.data;
        
        if (success) {
          setQuiz(quiz);
        } else {
          setError('Failed to load quiz data');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader"></div>
        <p>Loading quiz details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Error Loading Quiz</h3>
        <p>{error}</p>
        <Link to="/quizzes" className="btn">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  return (
    <div className="quiz-detail">
      <h2>{quiz.title}</h2>
      <p className="quiz-description">{quiz.description}</p>

      <div className="content-blocks">
        {quiz.contentBlocks?.map((block, index) => (
          <div key={index} className={`content-block ${block.type}`}>
            {block.type === 'heading' && <h3>{block.content}</h3>}
            {block.type === 'paragraph' && <p>{block.content}</p>}
            {block.type === 'list' && (
              <ul>
                {block.items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="quiz-actions">
        <Link to={`/quizzes/${id}/attempt`} className="btn btn-primary">
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizDetail;