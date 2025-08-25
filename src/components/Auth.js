import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, verifyOtp, forgotPassword, resetPassword } from "../api/authApi";
import "./Auth.css";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaUser, FaBuilding, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      if (isLogin) {
        const response = await loginUser(formData);
        console.log(response, "login response");
        
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          login();
          navigate("/");
        } else {
          setError(response.data.message || "Login failed!");
        }
      } else {
        const response = await registerUser(formData);
        console.log(response, "registration response");
        
        if (response.data.success) {
          setShowOtpModal(true);
        } else {
          setError(response.data.message || "Registration failed!");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Check if it's an axios error with response data
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Server error. Please try again.");
      }
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
        localStorage.setItem("token", response.data.token);
        login();
        navigate("/");
      } else {
        setError(response.data.message || "Invalid OTP!");
      }
    } catch (err) {
      console.error("OTP error:", err);
      // Check if it's an axios error with response data
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("OTP verification failed.");
      }
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email address first");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await forgotPassword({ email: formData.email });
      
      if (response.data.success) {
        setSuccessMessage("OTP sent to your email. Please check and enter it below.");
        setShowForgotPassword(false);
        setShowResetPassword(true);
      } else {
        setError(response.data.message || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetOtp) {
      setError("Please enter the OTP");
      return;
    }
    
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await resetPassword({ 
        email: formData.email, 
        otp: resetOtp, 
        newPassword 
      });
      
      if (response.data.success) {
        setSuccessMessage("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          setShowResetPassword(false);
          setResetOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <FaShieldAlt />
              </div>
              <h1>Schoolabe</h1>
            </div>
            <h2>Welcome to the future of learning</h2>
            <p>Master Python programming with our comprehensive courses, interactive tutorials, and real-world projects.</p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="feature-content">
                  <h4>Self-Paced Learning</h4>
                  <p>Progress through modules at your own speed with 24/7 access to comprehensive Python courses</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaUser />
                </div>
                <div className="feature-content">
                  <h4>Interactive Practice</h4>
                  <p>Code in real-time with our integrated IDE, instant feedback, and hands-on project building</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <FaBuilding />
                </div>
                <div className="feature-content">
                  <h4>Career-Ready Skills</h4>
                  <p>Master industry-standard Python frameworks and real-world problem-solving techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <h3>{isLogin ? "Welcome back!" : "Join Schoolabe"}</h3>
              <p>{isLogin ? "Sign in to continue your learning journey" : "Create your account to get started"}</p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {isLogin && (
                  <div className="forgot-password-link">
                    <button
                      type="button"
                      className="forgot-password-btn"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <div className="input-wrapper">
                    <FaBuilding className="input-icon" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name (Optional)"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="switch-text">
                {isLogin ? "New to Schoolabe?" : "Already have an account?"}{" "}
                <button 
                  type="button"
                  className="switch-btn"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setFormData({ name: "", email: "", password: "", company: "" });
                  }}
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && !isLogin && (
        <div className="otp-modal">
          <div className="otp-overlay" onClick={() => setShowOtpModal(false)}></div>
          <div className="otp-box">
            <div className="otp-header">
              <div className="otp-icon">🔐</div>
              <h2>Verify Your Email</h2>
              <p>We've sent a 6-digit verification code to <strong>{formData.email}</strong></p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="otp-form">
              <div className="otp-input-group">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                  className="otp-input"
                />
              </div>
              
                             <button 
                 type="submit" 
                 disabled={loading}
                 className="otp-submit-btn"
               >
                 {loading ? (
                   <div className="spinner"></div>
                 ) : (
                   "Verify & Continue"
                 )}
               </button>
            </form>

            <div className="otp-footer">
              <p>Didn't receive the code? <button className="resend-btn">Resend</button></p>
            </div>
          </div>
        </div>
      )}

            {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="otp-modal">
          <div className="otp-overlay" onClick={() => setShowForgotPassword(false)}></div>
          <div className="otp-box">
            <div className="otp-header">
              <div className="otp-icon">🔑</div>
              <h2>Reset Your Password</h2>
              <p>Enter your email address and we'll send you instructions to reset your password</p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="otp-form">
              <div className="otp-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="otp-input"
                />
              </div>
               
               <button 
                 type="submit" 
                 disabled={loading}
                 className="otp-submit-btn"
               >
                 {loading ? (
                   <div className="spinner"></div>
                 ) : (
                   "Send Reset Email"
                 )}
               </button>
            </form>

            <div className="otp-footer">
              <p>Remember your password? <button className="resend-btn" onClick={() => setShowForgotPassword(false)}>Back to Login</button></p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="otp-modal">
          <div className="otp-overlay" onClick={() => setShowResetPassword(false)}></div>
          <div className="otp-box">
            <div className="otp-header">
              <div className="otp-icon">🔐</div>
              <h2>Set New Password</h2>
              <p>Enter the OTP sent to your email and set a new password</p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="otp-form">
              <div className="otp-input-group">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value)}
                  maxLength="6"
                  required
                  className="otp-input"
                />
              </div>

              <div className="otp-input-group">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="otp-input"
                />
              </div>

              <div className="otp-input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="otp-input"
                />
              </div>
               
               <button 
                 type="submit" 
                 disabled={loading}
                 className="otp-submit-btn"
               >
                 {loading ? (
                   <div className="spinner"></div>
                 ) : (
                   "Reset Password"
                 )}
               </button>
            </form>

            <div className="otp-footer">
              <p>Didn't receive the code? <button className="resend-btn" onClick={() => {
                setShowResetPassword(false);
                setShowForgotPassword(true);
              }}>Resend</button></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
