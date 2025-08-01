import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AdminDSA.css";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // Fetch from env, fallback to empty

const TestCaseManager = () => {
  const { questionId } = useParams();
  const [testCases, setTestCases] = useState([]);
  const [form, setForm] = useState({
    input: "",
    expectedOutput: "",
    isPublic: true,
  });

  const fetchTestCases = async () => {
    const res = await axios.get(`${BASE_URL}/api/dsa/testcases/all/${questionId}`);
    setTestCases(res.data);
  };

  useEffect(() => {
    fetchTestCases();
  }, [questionId]);

  const createTestCase = async () => {
    await axios.post(`${BASE_URL}/api/dsa/testcases`, {
      ...form,
      questionId : questionId,
    });
    setForm({ input: "", expectedOutput: "", isPublic: true });
    fetchTestCases();
  };

  return (
    <div className="admin-container">
      <h2>🧪 Add Test Case</h2>
      <div className="form-column">
        <textarea
          placeholder="Input"
          value={form.input}
          onChange={(e) => setForm({ ...form, input: e.target.value })}
        />
        <textarea
          placeholder="Expected Output"
          value={form.expectedOutput}
          onChange={(e) => setForm({ ...form, expectedOutput: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          />
          Public Test Case?
        </label>
        <button onClick={createTestCase}>+ Add Test Case</button>
      </div>

      <div className="cards-container">
        {testCases.map((tc, index) => (
          <div key={index} className="admin-card">
            <p><strong>Input:</strong> {tc.input}</p>
            <p><strong>Expected:</strong> {tc.expectedOutput}</p>
            <p><strong>Visible:</strong> {tc.isPublic ? "✅" : "❌"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCaseManager;
