import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FaPython, 
  FaServer, 
  FaBrain, 
  FaDatabase, 
  FaRobot, 
  FaDesktop, 
  FaGamepad, 
  FaChevronRight 
} from "react-icons/fa";
import "./Roadmap.css";

const pythonCareerTree = {
  root: {
    title: "Python Core",
    description: "Master the fundamentals",
    skills: [
      { name: "Syntax & Variables", level: "Beginner", icon: "🔤" },
      { name: "Data Structures", level: "Intermediate", icon: "📊" },
      { name: "OOP Concepts", level: "Intermediate", icon: "🏗️" },
      { name: "Error Handling", level: "Intermediate", icon: "🛡️" },
      { name: "Modules & Packages", level: "Intermediate", icon: "📦" }
    ]
  },
  branches: [
    {
      id: "backend",
      title: "Backend Developer",
      description: "Build robust server-side applications",
      icon: FaServer,
      color: "#3B82F6",
      skills: [
        { name: "Django", level: "Advanced", icon: "🐍" },
        { name: "FastAPI", level: "Advanced", icon: "⚡" },
        { name: "Flask", level: "Intermediate", icon: "🌶️" },
        { name: "PostgreSQL", level: "Intermediate", icon: "🐘" },
        { name: "REST APIs", level: "Advanced", icon: "🔗" },
        { name: "Docker", level: "Intermediate", icon: "🐳" }
      ],
      salary: "₹8-15 LPA",
      projects: ["E-commerce Platform", "Social Media API", "Payment Gateway"]
    },
    {
      id: "data-science",
      title: "Data Scientist",
      description: "Analyze data and build ML models",
      icon: FaBrain,
      color: "#10B981",
      skills: [
        { name: "Pandas", level: "Advanced", icon: "🐼" },
        { name: "NumPy", level: "Advanced", icon: "🔢" },
        { name: "Scikit-learn", level: "Advanced", icon: "🤖" },
        { name: "Matplotlib", level: "Intermediate", icon: "📈" },
        { name: "TensorFlow", level: "Advanced", icon: "🧠" },
        { name: "Statistics", level: "Intermediate", icon: "📊" }
      ],
      salary: "₹10-20 LPA",
      projects: ["Customer Segmentation", "Sales Prediction", "Image Classification"]
    },
    {
      id: "data-engineer",
      title: "Data Engineer",
      description: "Build data pipelines and infrastructure",
      icon: FaDatabase,
      color: "#F59E0B",
      skills: [
        { name: "Apache Spark", level: "Advanced", icon: "⚡" },
        { name: "Hadoop", level: "Intermediate", icon: "🐘" },
        { name: "Airflow", level: "Advanced", icon: "🌪️" },
        { name: "AWS/GCP", level: "Advanced", icon: "☁️" },
        { name: "Kafka", level: "Intermediate", icon: "📡" },
        { name: "SQL", level: "Advanced", icon: "🗄️" }
      ],
      salary: "₹12-18 LPA",
      projects: ["ETL Pipeline", "Real-time Analytics", "Data Warehouse"]
    },
    {
      id: "automation",
      title: "Automation Engineer",
      description: "Automate testing and deployment",
      icon: FaRobot,
      color: "#8B5CF6",
      skills: [
        { name: "Selenium", level: "Advanced", icon: "🤖" },
        { name: "PyTest", level: "Advanced", icon: "🧪" },
        { name: "Jenkins", level: "Intermediate", icon: "🔧" },
        { name: "GitHub Actions", level: "Intermediate", icon: "⚙️" },
        { name: "API Testing", level: "Advanced", icon: "🔍" },
        { name: "Performance Testing", level: "Intermediate", icon: "⚡" }
      ],
      salary: "₹6-12 LPA",
      projects: ["Test Automation Framework", "CI/CD Pipeline", "API Test Suite"]
    },
    {
      id: "ai-ml",
      title: "AI/ML Engineer",
      description: "Build intelligent systems",
      icon: FaBrain,
      color: "#EF4444",
      skills: [
        { name: "PyTorch", level: "Advanced", icon: "🔥" },
        { name: "NLP", level: "Advanced", icon: "💬" },
        { name: "Computer Vision", level: "Advanced", icon: "👁️" },
        { name: "OpenCV", level: "Intermediate", icon: "📷" },
        { name: "MLOps", level: "Advanced", icon: "🚀" },
        { name: "Model Deployment", level: "Advanced", icon: "🌐" }
      ],
      salary: "₹15-25 LPA",
      projects: ["Chatbot", "Object Detection", "Recommendation System"]
    },
    {
      id: "desktop",
      title: "Desktop App Developer",
      description: "Create cross-platform applications",
      icon: FaDesktop,
      color: "#06B6D4",
      skills: [
        { name: "PyQt", level: "Advanced", icon: "🖥️" },
        { name: "Tkinter", level: "Intermediate", icon: "📱" },
        { name: "Kivy", level: "Intermediate", icon: "📱" },
        { name: "PyInstaller", level: "Intermediate", icon: "📦" },
        { name: "GUI Design", level: "Intermediate", icon: "🎨" },
        { name: "Cross-platform", level: "Advanced", icon: "🔄" }
      ],
      salary: "₹5-10 LPA",
      projects: ["File Manager", "Calculator App", "Media Player"]
    },
    {
      id: "game-dev",
      title: "Game Developer",
      description: "Create interactive games",
      icon: FaGamepad,
      color: "#EC4899",
      skills: [
        { name: "Pygame", level: "Intermediate", icon: "🎮" },
        { name: "Panda3D", level: "Advanced", icon: "🐼" },
        { name: "Game Physics", level: "Intermediate", icon: "⚡" },
        { name: "Sprite Animation", level: "Intermediate", icon: "🎭" },
        { name: "Sound Design", level: "Basic", icon: "🎵" },
        { name: "Multiplayer", level: "Advanced", icon: "👥" }
      ],
      salary: "₹4-8 LPA",
      projects: ["2D Platformer", "Puzzle Game", "Multiplayer Shooter"]
    }
  ]
};

const Roadmap = () => {
  // Removed unused selectedBranch state
  const [expandedBranches, setExpandedBranches] = useState(new Set());
  const navigate = useNavigate();

  const toggleBranch = (branchId) => {
    const newExpanded = new Set(expandedBranches);
    if (newExpanded.has(branchId)) {
      newExpanded.delete(branchId);
    } else {
      newExpanded.add(branchId);
    }
    setExpandedBranches(newExpanded);
  };

  const handleBranchClick = (branch) => {
    navigate(`/roadmap/${branch.id}`);
  };

  return (
    <div className="python-tree-container">
      <Helmet>
        <title>Python Career Roadmap - Schoolabe</title>
        <meta name="description" content="Explore Python career paths: Backend Development, Data Science, AI/ML, Automation, and more. Choose your learning path and master Python programming." />
      </Helmet>

      {/* Header */}
      <div className="tree-header">
        <h1>🌲 Python Career Tree</h1>
        <p>Choose your path and grow your Python career</p>
      </div>

      {/* Tree Visualization */}
      <div className="tree-visualization">
        {/* Root Node */}
        <div className="root-node">
          <div className="root-icon">
            <FaPython />
          </div>
          <div className="root-content">
            <h2>{pythonCareerTree.root.title}</h2>
            <p>{pythonCareerTree.root.description}</p>
            <div className="root-skills">
              {pythonCareerTree.root.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill.icon} {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tree Trunk */}
        <div className="tree-trunk"></div>

        {/* Career Branches */}
        <div className="career-branches">
          {pythonCareerTree.branches.map((branch, index) => (
            <div key={branch.id} className="career-branch">
              <div 
                className="branch-node"
                style={{ '--branch-color': branch.color }}
                onClick={() => handleBranchClick(branch)}
              >
                <branch.icon className="branch-icon" />
                <h3>{branch.title}</h3>
                <p>{branch.description}</p>
                <div className="branch-meta">
                  <span className="salary">{branch.salary}</span>
                  <button 
                    className="expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBranch(branch.id);
                    }}
                  >
                    <FaChevronRight className={expandedBranches.has(branch.id) ? 'expanded' : ''} />
                  </button>
                </div>
              </div>

              {/* Expanded Skills */}
              {expandedBranches.has(branch.id) && (
                <div className="branch-skills">
                  <div className="skills-grid">
                    {branch.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="skill-card">
                        <span className="skill-icon">{skill.icon}</span>
                        <div className="skill-info">
                          <h4>{skill.name}</h4>
                          <span className="skill-level">{skill.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="branch-projects">
                    <h4>Example Projects:</h4>
                    <div className="projects-list">
                      {branch.projects.map((project, projectIndex) => (
                        <span key={projectIndex} className="project-tag">
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tree Legend */}
      <div className="tree-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon beginner">🔤</span>
            <span>Beginner</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon intermediate">📊</span>
            <span>Intermediate</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon advanced">🚀</span>
            <span>Advanced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
