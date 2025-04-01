import React, { useState } from "react";
import OptionForm from "./OptionForm";
import '../quizStyles.css';

const QuestionForm = ({ question, onChange }) => {
  const [questionData, setQuestionData] = useState(question);

  const handleChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    onChange({ ...questionData, [e.target.name]: e.target.value });
  };

  const handleAddOption = () => {
    const newOption = { id: Date.now(), text: "", isCorrect: false };
    setQuestionData({ ...questionData, options: [...questionData.options, newOption] });
    onChange({ ...questionData, options: [...questionData.options, newOption] });
  };

  const handleOptionChange = (index, updatedOption) => {
    const newOptions = [...questionData.options];
    newOptions[index] = updatedOption;
    setQuestionData({ ...questionData, options: newOptions });
    onChange({ ...questionData, options: newOptions });
  };

  return (
    <div className="question-form">
      <h4>Question</h4>
      <textarea
        name="text"
        placeholder="Enter question..."
        value={questionData.text}
        onChange={handleChange}
      />

      <h5>Code Block (Optional)</h5>
      <textarea
        name="codeBlock"
        placeholder="Enter code block..."
        value={questionData.codeBlock}
        onChange={handleChange}
      />

      <h5>Options</h5>
      {questionData.options.map((option, index) => (
        <OptionForm
          key={option.id}
          option={option}
          onChange={(updatedOption) => handleOptionChange(index, updatedOption)}
        />
      ))}
      <button onClick={handleAddOption}>Add Option</button>

      <h5>Explanation</h5>
      <textarea
        name="explanation"
        placeholder="Enter explanation..."
        value={questionData.explanation}
        onChange={handleChange}
      />
    </div>
  );
};

export default QuestionForm;
