import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/change-password", {
        email, otp, newPassword
      });

      setMessage(res.data.message);
      setTimeout(() => navigate("/signup"), 2000); // Redirect after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Change Password</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleChangePassword}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
