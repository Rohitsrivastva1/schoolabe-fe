import React, { useState } from "react";
import '../quizStyles.css';

const OptionForm = ({ option, onChange }) => {
  const [optionData, setOptionData] = useState(option);

  const handleChange = (e) => {
    setOptionData({ ...optionData, [e.target.name]: e.target.value });
    onChange({ ...optionData, [e.target.name]: e.target.value });
  };

  const handleCorrectAnswerChange = (e) => {
    setOptionData({ ...optionData, isCorrect: e.target.checked });
    onChange({ ...optionData, isCorrect: e.target.checked });
  };

  return (
    <div className="option-form">
      <input
        type="text"
        name="text"
        placeholder="Enter option text..."
        value={optionData.text}
        onChange={handleChange}
      />
      <label>
        Correct Answer
        <input
          type="checkbox"
          checked={optionData.isCorrect}
          onChange={handleCorrectAnswerChange}
        />
      </label>
    </div>
  );
};

export default OptionForm;
