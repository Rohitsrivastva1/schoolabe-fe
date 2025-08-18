import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      
      if (response.data.success) {
        toast.success("Password reset OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send reset email");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/verify-reset-otp", { email, otp });
      
      if (response.data.success) {
        toast.success("OTP verified! Set your new password.");
        setStep(3);
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      
      if (response.data.success) {
        toast.success("Password reset successfully! Please login with your new password.");
        navigate("/signup");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h1>Reset Password</h1>
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p className="instruction">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p className="instruction">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
            
            <div className="otp-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button type="button" onClick={resendOtp} className="resend-btn">
                Resend Code
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <p className="instruction">
              Enter your new password
            </p>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="back-to-login">
          <button onClick={() => navigate("/signup")} className="back-btn">
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
