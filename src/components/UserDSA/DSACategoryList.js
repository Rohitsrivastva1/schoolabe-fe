import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDSA.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

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
    <div className="dsa-landing">
      <header className="dsa-header">
        <h1>🧠 Schoolabe DSA Arena</h1>
        <p>Master DSA like a pro – Category by Category</p>
      </header>
      <div className="dsa-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="dsa-card"
            onClick={() => navigate(`/dsa/category/${cat.id}`)}
          >
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSACategoryList;
