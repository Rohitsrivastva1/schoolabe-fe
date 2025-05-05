import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UserDSA.css";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

const DSAQuestionList = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dsa/questions/category/${categoryId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  const fetchCategoryName = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dsa/categories/${categoryId}`);
      setCategoryName(res.data.name);
    } catch (err) {
      console.error("Failed to fetch category name", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCategoryName();
  }, [categoryId]);

  return (
    <div className="user-dsa-container">
      <h2 className="user-dsa-title">📂 {categoryName}</h2>
      <div className="user-dsa-cards">
        {questions.map((q) => (
          <div
            key={q.id}
            className="user-dsa-card"
            onClick={() => navigate(`/dsa/question/${q.id}`)}
          >
            {q.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSAQuestionList;
