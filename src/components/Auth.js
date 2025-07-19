import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, verifyOtp } from "../api/authApi"; // Import API functions
import "./Auth.css";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = isLogin ? await loginUser(formData) : await registerUser(formData);
      console.log(response,"response");
      
      if (response.data.success) {
        
        setShowOtpModal(true);
      } else {
        setError(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp({ email: formData.email, otp });
      console.log(response,"response");
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Save JWT
        login(); // ✅ Update global auth state immediately

        navigate("/editor"); // Redirect after login
      } else {
        setError(response.message || "Invalid OTP!");
      }
    } catch (err) {
      setError("OTP verification failed.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? "Sign in to Schoolabe" : "Create your account"}</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          {!isLogin && (
            <input type="text" name="company" placeholder="Company Name" onChange={handleChange} required />
          )}
          <button type="submit" disabled={loading}>{loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}</button>
        </form>

        <p className="switch-text">
          {isLogin ? "New to Schoolabe?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Create an account" : "Sign in"}</span>
        </p>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-box">
            <h2>Enter OTP</h2>
            <p>We have sent a 6-digit OTP to your email.</p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleOtpSubmit}>
              <input type="text" name="otp" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
              <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
