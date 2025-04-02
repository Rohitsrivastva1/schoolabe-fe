import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axiosInstance";
import "./QuizAttempt.dark.css"; // Import the dark theme CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const QuizAttempt = () => {
    const { quizId, subQuizId } = useParams();
    const [quizData, setQuizData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = quizData?.questions[currentQuestionIndex];
    const totalQuestions = quizData?.questions.length;

    useEffect(() => {
        const fetchQuiz = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/quizzes/${quizId}`);
                const { success, quiz } = response.data;

                if (success) {
                    const selectedSubQuiz = quiz.quizzes.find(q => q.id.toString() === subQuizId);
                    if (selectedSubQuiz) {
                        setQuizData(selectedSubQuiz);
                    } else {
                        setError("Sub-quiz not found!");
                    }
                } else {
                    setError("Invalid quiz data");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Quiz not found");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, subQuizId]);

    const handleAnswer = (selectedOptionId) => {
        if (!answers[currentQuestion.id]) {
            const isCorrect = currentQuestion.options.find(opt => opt.id === selectedOptionId)?.isCorrect || false;
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: {
                    selected: selectedOptionId,
                    isCorrect: isCorrect
                }
            }));
            setShowExplanation(true);
        }
    };

    const handleNextQuestion = () => {
        setShowExplanation(false);
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Quiz finished
            let correctCount = 0;
            Object.values(answers).forEach(answer => {
                if (answer.isCorrect) {
                    correctCount++;
                }
            });
            setScore(correctCount);
            setQuizCompleted(true);
        }
    };

    if (error) return <div className="quiz-attempt-container"><div className="error-message">{error}</div></div>;
    if (isLoading) return <div className="quiz-attempt-container"><div className="loading-message">{quizData?.title ? `Loading ${quizData.title}...` : "Loading quiz..."}</div></div>;
    if (!quizData) return <div className="quiz-attempt-container"><div className="loading-message">Loading quiz data...</div></div>;
    if (quizCompleted) {
        return (
            <div className="quiz-attempt-container results-container">
                <div className="quiz-header">
                    <h1 className="quiz-title">{quizData.title} - Results</h1>
                </div>
                <div className="results-body">
                    <p className="results-score">Your Score: {score} out of {totalQuestions}</p>
                    {quizData.questions.map(question => (
                        <div key={question.id} className="question-card results-question">
                            <h3 className="question-number">{question.text}</h3>
                            {question.codeBlock && (
                                <div className="code-block-container">
                                    <SyntaxHighlighter language="javascript" style={dracula}>
                                        {question.codeBlock}
                                    </SyntaxHighlighter>
                                </div>
                            )}
                            <div className="options-grid">
                                {question.options.map(option => {
                                    const isSelected = answers[question.id]?.selected === option.id;
                                    const isCorrectOption = option.isCorrect;
                                    const optionClass = `option ${isSelected ? 'selected' : ''} ${isCorrectOption ? 'correct' : ''} ${isSelected && !isCorrectOption ? 'incorrect' : ''} dimmed`;
                                    return (
                                        <button key={option.id} className={optionClass} disabled>
                                            <span className="option-text">{option.text}</span>
                                            {isCorrectOption && <FontAwesomeIcon icon={faCheck} className="marker correct-marker" />}
                                            {isSelected && !isCorrectOption && <FontAwesomeIcon icon={faTimes} className="marker incorrect-marker" />}
                                        </button>
                                    );
                                })}
                            </div>
                            {question.explanation && (
                                <div className="explanation-container">
                                    <div className={`feedback ${answers[question.id]?.isCorrect ? "correct" : "incorrect"}`}>
                                        {answers[question.id]?.isCorrect ? "Correct!" : "Incorrect!"}
                                    </div>
                                    <p className="explanation-text">{question.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    <Link to={`/quizzes/${quizId}`} className="back-to-category-btn">Back to Quiz Category</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-attempt-container">
            <div className="quiz-header">
                <h1 className="quiz-title">{quizData.title}</h1>
            </div>

            <div className="quiz-body">
                <div className="progress-indicator">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>
                <div key={currentQuestion.id} className="question-card">
                    <h3 className="question-number">{currentQuestion.text}</h3>
                    {currentQuestion.codeBlock && (
                        <div className="code-block-container">
                            <SyntaxHighlighter language="javascript" style={dracula}>
                                {currentQuestion.codeBlock}
                            </SyntaxHighlighter>
                        </div>
                    )}
                    <div className="options-grid">
                        {currentQuestion.options.map((option) => {
                            const isSelected = answers[currentQuestion.id]?.selected === option.id;
                            const isCorrectOption = option.isCorrect;
                            const optionClass = `option ${isSelected ? 'selected' : ''} ${
                                answers[currentQuestion.id] ? (isCorrectOption ? 'correct' : isSelected ? 'incorrect' : 'dimmed') : ''
                            }`;

                            return (
                                <button
                                    key={option.id}
                                    className={optionClass}
                                    onClick={() => handleAnswer(option.id)}
                                    disabled={!!answers[currentQuestion.id]}
                                >
                                    <span className="option-text">{option.text}</span>
                                    {answers[currentQuestion.id] && isCorrectOption && <FontAwesomeIcon icon={faCheck} className="marker correct-marker" />}
                                    {answers[currentQuestion.id] && isSelected && !isCorrectOption && <FontAwesomeIcon icon={faTimes} className="marker incorrect-marker" />}
                                </button>
                            );
                        })}
                    </div>

                    {showExplanation && answers[currentQuestion.id] && (
                        <div className="explanation-container">
                            <div className={`feedback ${answers[currentQuestion.id].isCorrect ? "correct" : "incorrect"}`}>
                                {answers[currentQuestion.id].isCorrect ? "Correct!" : "Incorrect!"}
                            </div>
                            <p className="explanation-text">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>

                <button onClick={handleNextQuestion} className="next-button" disabled={!answers[currentQuestion?.id]}>
                    {currentQuestionIndex < totalQuestions - 1 ? (
                        <>Next <FontAwesomeIcon icon={faArrowRight} /></>
                    ) : (
                        <>Submit Quiz <FontAwesomeIcon icon={faPaperPlane} /></>
                    )}
                </button>
            </div>
        </div>
    );
};

export default QuizAttempt;