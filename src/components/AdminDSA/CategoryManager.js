import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDSA.css";

const CategoryManager = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const res = await axios.get("/api/dsa/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!name) return;
    await axios.post("/api/dsa/categories", { name });
    setName("");
    fetchCategories();
  };

  return (
    <div className="admin-container">
      <h2>📁 Create New Category</h2>
      <div className="form-inline">
        <input
          type="text"
          placeholder="DSA Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={createCategory}>+ Create</button>
      </div>

      <div className="cards-container">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="admin-card"
            onClick={() => navigate(`/admin/dsa/questions/${cat.id}`)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
