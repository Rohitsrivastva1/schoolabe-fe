import React, { useState } from "react";
import QuestionForm from "./QuestionForm";
import '../quizStyles.css';

const QuizPartForm = ({ quiz, onChange }) => {
  const [quizData, setQuizData] = useState(quiz);

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
    onChange({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = () => {
    const newQuestion = { id: Date.now(), text: "", options: [], explanation: "", codeBlock: "" };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
    onChange({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index] = updatedQuestion;
    setQuizData({ ...quizData, questions: newQuestions });
    onChange({ ...quizData, questions: newQuestions });
  };

  return (
    <div className="quiz-part-form">
      <h3>Quiz Part</h3>
      <input
        type="text"
        name="title"
        placeholder="Quiz Title"
        value={quizData.title}
        onChange={handleChange}
      />

      <h4>Questions</h4>
      {quizData.questions.map((question, index) => (
        <QuestionForm
          key={question.id}
          question={question}
          onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
        />
      ))}
      <button onClick={handleAddQuestion}>Add Question</button>
    </div>
  );
};

export default QuizPartForm;
