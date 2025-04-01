import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './QuizAttempt.css';
import axios from "../../api/axiosInstance"; // Assuming you have a centralized Axios instance

const QuizAttempt = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${id}`);
        if (!response.ok) throw new Error('Quiz not found');
        const data = await response.json();
        if (data.success) setQuizData(data.quiz);
        else setError('Invalid quiz data');
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: {
        selected: selectedOption,
        isCorrect: selectedOption === quizData.quizzes[questionIndex].correctAnswer
      }
    }));
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!quizData) return <div className="loading-message">Loading quiz...</div>;

  return (
    <div className="quiz-attempt-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{quizData.title}</h1>
        <p className="quiz-description">{quizData.description}</p>
      </div>

      <div className="quiz-body">
        {quizData.quizzes.map((question, index) => {
          const answer = answers[index];
          const hasAnswered = !!answer;
          const correctAnswer = question.correctAnswer;

          return (
            <div key={index} className={`question-card ${hasAnswered ? 'answered' : 'unanswered'}`}>
              <h3 className="question-number">Question {index + 1}</h3>
              <p className="question-text">{question.question}</p>

              <div className="options-grid">
                {question.options.map((option, optionIndex) => {
                  const isSelected = hasAnswered && answer.selected === option;
                  const isCorrectOption = option === correctAnswer;
                  const optionClass = `option ${isSelected ? 'selected' : ''} ${hasAnswered ? (isCorrectOption ? 'correct' : isSelected ? 'incorrect' : 'dimmed') : ''}`;

                  return (
                    <button
                      key={optionIndex}
                      className={optionClass}
                      onClick={() => !hasAnswered && handleAnswer(index, option)}
                      disabled={hasAnswered}
                    >
                      <span className="option-text">{option}</span>
                      {hasAnswered && isCorrectOption && <span className="marker correct-marker">✓</span>}
                      {hasAnswered && isSelected && !isCorrectOption && <span className="marker incorrect-marker">✕</span>}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div className="explanation-container">
                  <div className={`feedback ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                    {answer.isCorrect ? 'Correct!' : 'Incorrect!'}
                  </div>
                  <p className="explanation-text">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizAttempt;