import React, { useState, useEffect } from "react";
import { createQuiz, updateQuiz, getQuizBySlug } from "../../api/quizApi";
import { useNavigate, useParams } from "react-router-dom";

const QuizForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = !!slug;

  useEffect(() => {
    if (isEditing) {
      fetchQuiz();
    }
  }, []);

  const fetchQuiz = async () => {
    const response = await getQuizBySlug(slug);
    if (response.success) {
      setTitle(response.quiz.title);
      setDescription(response.quiz.description);
      setCategory(response.quiz.category);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = { title, description, category };

    let response;
    if (isEditing) {
      response = await updateQuiz(slug, quizData);
    } else {
      response = await createQuiz(quizData);
    }

    if (response.success) {
      navigate("/admin");
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Quiz" : "Create Quiz"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default QuizForm;
