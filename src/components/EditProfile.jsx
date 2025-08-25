import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditProfile.css";

const EditProfile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
      }));
      // Set profile image if user has one
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password change
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put("/api/auth/profile", updateData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("✅ Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Update local auth context
        login();
        // Small delay before navigation to show the success message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
    setLoading(false);
  };

  if (!user) {
    navigate("/signup");
    return null;
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-content">
        <div className="edit-profile-card">
          <div className="profile-header">
            <div className="profile-image-section">
              <div className="profile-image-container" onClick={triggerImageUpload}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-icon">
                    <i className="fas fa-user-edit"></i>
                  </div>
                )}
                <div className="profile-image-overlay">
                  <i className="fas fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              </div>
              {imagePreview && (
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={removeProfileImage}
                  title="Remove profile picture"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <h1>Edit Profile</h1>
            <p>Update your personal information and account settings</p>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <i className="fas fa-user"></i>
              <span>Personal Info</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              <i className="fas fa-lock"></i>
              <span>Password</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="tab-content personal-tab">
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-user"></i>
                    Personal Information
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">
                        <i className="fas fa-user"></i>
                        Full Name
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        <i className="fas fa-envelope"></i>
                        Email Address
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="company">
                      <i className="fas fa-building"></i>
                      Company
                      <span className="optional-text">(Optional)</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="tab-content password-tab">
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-lock"></i>
                    Change Password
                    <span className="optional-text">(Optional)</span>
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="currentPassword">
                        <i className="fas fa-key"></i>
                        Current Password
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="Enter your current password"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="newPassword">
                        <i className="fas fa-lock"></i>
                        New Password
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          placeholder="Enter your new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="confirmPassword">
                      <i className="fas fa-check-circle"></i>
                      Confirm New Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="button-group">
              <button type="submit" disabled={loading} className="save-btn">
                {loading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/")} 
                className="cancel-btn"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
