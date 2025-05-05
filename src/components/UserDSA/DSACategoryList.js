import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDSA.css";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

const DSACategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/dsa/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="user-dsa-container">
      <h2 className="user-dsa-title">💡 Select a DSA Category</h2>
      <div className="user-dsa-cards">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="user-dsa-card"
            onClick={() => navigate(`/dsa/category/${cat.id}`)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSACategoryList;
