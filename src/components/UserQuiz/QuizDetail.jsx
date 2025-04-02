import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import '../quizStyles.css';
import axios from "../../api/axiosInstance"; // Ensure this is correctly set up

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${id}`);
        
        const { success, quiz } = response.data; // ✅ Correct way to extract data
        if (success) {
          setQuiz(quiz);
        } else {
          setError("Failed to load quiz");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Quiz not found");
      }
    };

    fetchQuizDetails();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!quiz) return <div>Loading quiz...</div>;

  return (
    <div className="quiz-detail">
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>

      <div className="content-blocks">
        {quiz.contentBlocks?.map((block, index) => (
          <div key={index} className="content-block">
            {block.type === 'heading' && <h3>{block.content}</h3>}
            {block.type === 'paragraph' && <p>{block.content}</p>}
            {block.type === 'list' && (
              <ul>
                {block.items?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="quiz-navigation">
        <Link to={`/quizzes/${id}/attempt`} className="btn">
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizDetail;
