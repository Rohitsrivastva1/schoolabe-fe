import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './QuizAttempt.css';
import axios from "../../api/axiosInstance"; // Ensure this is correctly set up

const QuizAttempt = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${id}`);
        
        const { success, quiz } = response.data; // ✅ Correctly accessing response data
        if (success) {
          setQuizData(quiz);
        } else {
          setError("Invalid quiz data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Quiz not found");
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
        {quizData.quizzes?.map((question, index) => (  // ✅ FIXED: Changed `quizData.questions` to `quizData.quizzes`
          <div key={index} className={`question-card`}>
            <h3 className="question-number">Question {index + 1}</h3>
            <p className="question-text">{question.question}</p>

            <div className="options-grid">
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[index]?.selected === option;
                const isCorrectOption = option === question.correctAnswer;
                const optionClass = `option ${isSelected ? 'selected' : ''} ${
                  answers[index] ? (isCorrectOption ? 'correct' : isSelected ? 'incorrect' : 'dimmed') : ''
                }`;

                return (
                  <button
                    key={optionIndex}
                    className={optionClass}
                    onClick={() => !answers[index] && handleAnswer(index, option)}
                    disabled={!!answers[index]}
                  >
                    <span className="option-text">{option}</span>
                    {answers[index] && isCorrectOption && <span className="marker correct-marker">✓</span>}
                    {answers[index] && isSelected && !isCorrectOption && <span className="marker incorrect-marker">✕</span>}
                  </button>
                );
              })}
            </div>

            {answers[index] && (
              <div className="explanation-container">
                <div className={`feedback ${answers[index].isCorrect ? 'correct' : 'incorrect'}`}>
                  {answers[index].isCorrect ? 'Correct!' : 'Incorrect!'}
                </div>
                <p className="explanation-text">{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizAttempt;
