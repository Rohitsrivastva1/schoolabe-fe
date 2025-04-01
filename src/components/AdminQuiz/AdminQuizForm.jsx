import React, { useState } from "react";
import QuizPartForm from "./QuizPartForm";
import '../quizStyles.css';
import axios from "../../api/axiosInstance"; // Assuming you have a centralized Axios instance

const AdminQuizForm = () => {
  const [category, setCategory] = useState({
    title: "",
    description: "",
     contentBlocks: [],
      quizzes: [],
  });

  const handleAddContentBlock = (type) => {
    setCategory({
      ...category,
      contentBlocks: [...category.contentBlocks, { type, value: "" }],
    });
  };

  const handleContentChange = (index, value) => {
    const newContent = [...category.contentBlocks];
    newContent[index].value = value;
    setCategory({ ...category, contentBlocks: newContent });
  };

  const handleAddQuizPart = () => {
    setCategory({
      ...category,
      quizzes: [...category.quizzes, { id: Date.now(), title: "", questions: [] }],
    });
  };

  const handleQuizPartChange = (index, quiz) => {
    const newQuizzes = [...category.quizzes];
    newQuizzes[index] = quiz;
    setCategory({ ...category, quizzes: newQuizzes });
  };

  const handleSubmit = async () => {
    console.log("Submitting Category:", category);

    try {
      const response = await axios.post("/api/quizzes", category);
      console.log("✅ Quiz Category Created:", response.data);
      alert("Quiz category created successfully!");
      setCategory({
        title: "",
        description: "",
        contentBlocks: [], // ✅ Ensure empty array after reset
        quizzes: [],       // ✅ Ensure empty array after reset
      });    } catch (error) {
      console.error("❌ Error creating quiz category:", error);
      alert("Failed to create quiz category. Try again!");
    }
  };
  return (
    <div className="admin-quiz-form">
      <h2>Create Quiz Category</h2>
      <input
        type="text"
        placeholder="Category Title"
        value={category.title}
        onChange={(e) => setCategory({ ...category, title: e.target.value })}
      />
      <textarea
        placeholder="Category Description"
        value={category.description}
        onChange={(e) => setCategory({ ...category, description: e.target.value })}
      />

      <h3>Content Blocks</h3>
      {category.contentBlocks?.map((block, index) => (
        <div key={index}>
          {block.type === "paragraph" && (
            <textarea
              placeholder="Enter paragraph..."
              value={block.value}
              onChange={(e) => handleContentChange(index, e.target.value)}
            />
          )}
          {block.type === "heading" && (
            <input
              type="text"
              placeholder="Enter heading..."
              value={block.value}
              onChange={(e) => handleContentChange(index, e.target.value)}
            />
          )}
        </div>
      ))}

      <button onClick={() => handleAddContentBlock("heading")}>Add Heading</button>
      <button onClick={() => handleAddContentBlock("paragraph")}>Add Paragraph</button>

      <h3>Quiz Parts</h3>
      {category.quizzes.map((quiz, index) => (
        <QuizPartForm
          key={quiz.id}
          quiz={quiz}
          onChange={(updatedQuiz) => handleQuizPartChange(index, updatedQuiz)}
        />
      ))}
      <button onClick={handleAddQuizPart}>Add Quiz</button>

      <button onClick={handleSubmit}>Save Category</button>
    </div>
  );
};

export default AdminQuizForm;
