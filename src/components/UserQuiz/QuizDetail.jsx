import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QuestionForm from "../AdminQuiz/QuestionForm";
import '../quizStyles.css';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(`/api/quizzes/${id}`);
        if (!response.ok) throw new Error('Quiz not found');
        const { success, quiz } = await response.json();
        if (success) setQuiz(quiz);
        else setError('Failed to load quiz');
      } catch (err) {
        setError(err.message);
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