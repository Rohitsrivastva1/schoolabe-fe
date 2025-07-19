import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UserDSA.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const DSAQuestionList = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [questionsRes, categoryRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/dsa/questions/category/${categoryId}`),
          axios.get(`${BASE_URL}/api/dsa/categories/${categoryId}`),
        ]);
  
        // Parse rich descriptions for all questions
        const parsedQuestions = questionsRes.data.map((q) => {
          try {
            const parsedDesc = JSON.parse(q.description);
            q.description = parsedDesc; // or parsedDesc.content if you only need the HTML string
          } catch (e) {
            console.error("Failed to parse question description for", q.title);
          }
          return q;
        });
  
        setQuestions(parsedQuestions);
        setCategoryName(categoryRes.data.name);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);
  

  return (
    <div className="dsa-landing">
      <header className="dsa-header">
        <h1>📂 {categoryName}</h1>
        <p>Select a question to begin solving</p>
      </header>

      {isLoading ? (
        <div className="loading-spinner">Loading questions...</div>
      ) : (
        <div className="dsa-grid">
          {questions.map((q) => (
            <div
              key={q.id}
              className="dsa-card"
              onClick={() => {
                setSelectedQuestion(q);
                setShowModal(true);
              }}
            >
              <span>{q.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedQuestion && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedQuestion.title}</h2>
            <div
  className="modal-description"
  dangerouslySetInnerHTML={{
    __html: selectedQuestion.description?.content || "<em>No description available.</em>",
  }}
/>


            <div className="modal-buttons">
              <button
                className="solve-btn"
                onClick={() => navigate(`/dsa/question/${selectedQuestion.id}`)}
              >
                Start Solving
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSAQuestionList;
