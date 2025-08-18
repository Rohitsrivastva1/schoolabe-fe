import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./Progress.css";

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    coursesCompleted: 0,
    totalCourses: 0,
    quizzesTaken: 0,
    totalQuizzes: 0,
    dsaProblemsSolved: 0,
    totalDsaProblems: 0,
    certificates: [],
    recentActivity: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    fetchProgress();
  }, [user, navigate]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get("/api/user/progress", {
        withCredentials: true,
      });

      if (response.data.success) {
        setProgress(response.data.progress);
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="progress-container">
        <div className="progress-card">
          <div className="loading">Loading progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-card">
        <h1>My Learning Progress</h1>
        
        <div className="progress-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Courses</h3>
              <p className="stat-number">{progress.coursesCompleted}/{progress.totalCourses}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculatePercentage(progress.coursesCompleted, progress.totalCourses)}%` }}
                ></div>
              </div>
              <p className="stat-percentage">{calculatePercentage(progress.coursesCompleted, progress.totalCourses)}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧠</div>
            <div className="stat-content">
              <h3>Quizzes</h3>
              <p className="stat-number">{progress.quizzesTaken}/{progress.totalQuizzes}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculatePercentage(progress.quizzesTaken, progress.totalQuizzes)}%` }}
                ></div>
              </div>
              <p className="stat-percentage">{calculatePercentage(progress.quizzesTaken, progress.totalQuizzes)}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💻</div>
            <div className="stat-content">
              <h3>DSA Problems</h3>
              <p className="stat-number">{progress.dsaProblemsSolved}/{progress.totalDsaProblems}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculatePercentage(progress.dsaProblemsSolved, progress.totalDsaProblems)}%` }}
                ></div>
              </div>
              <p className="stat-percentage">{calculatePercentage(progress.dsaProblemsSolved, progress.totalDsaProblems)}%</p>
            </div>
          </div>
        </div>

        <div className="certificates-section">
          <h2>Certificates Earned</h2>
          {progress.certificates.length > 0 ? (
            <div className="certificates-grid">
              {progress.certificates.map((cert, index) => (
                <div key={index} className="certificate-card">
                  <div className="certificate-icon">🏆</div>
                  <h4>{cert.name}</h4>
                  <p>Earned on {new Date(cert.earnedDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-certificates">No certificates earned yet. Keep learning!</p>
          )}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {progress.recentActivity.length > 0 ? (
            <div className="activity-list">
              {progress.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.description}</p>
                    <p className="activity-time">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-activity">No recent activity. Start your learning journey!</p>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate("/courses")} className="action-btn primary">
            Continue Learning
          </button>
          <button onClick={() => navigate("/practisecode")} className="action-btn secondary">
            Practice DSA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Progress;
