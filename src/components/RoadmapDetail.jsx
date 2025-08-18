import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaArrowLeft,
  FaDatabase,
  FaChartBar,
  FaServer,
  FaPython,
  FaCode,
  FaCheck,
  FaLock,
  FaTimes,
  FaRocket,
  FaCog,
  FaNetworkWired,
  FaCloud,
  FaBrain,
  FaChartLine,
  FaTable,
  FaFileAlt,
  FaProjectDiagram,
  FaDatabase as FaDb,
  FaServer as FaServerIcon,
  FaCloud as FaCloudIcon,
  FaShieldAlt as FaShield
} from 'react-icons/fa';
import './RoadmapDetail.css';

const RoadmapDetail = () => {
  const { careerPath } = useParams();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [completedNodes, setCompletedNodes] = useState(new Set());

  const careerData = {
    'data-engineer': {
      title: 'Data Engineer',
      description: 'Build robust data pipelines and infrastructure to transform raw data into actionable insights.',
      icon: FaDatabase,
      nodes: [
        {
          id: 'python-basics',
          name: 'Python Fundamentals',
          icon: FaPython,
          level: 1,
          description: 'Master Python programming fundamentals for data engineering',
          skills: ['Python Syntax', 'Data Structures', 'OOP Concepts', 'File I/O'],
          projects: ['Data Processing Script', 'CSV Parser', 'JSON Handler'],
          x: 50,
          y: 20,
          status: 'completed'
        },
        {
          id: 'sql-mastery',
          name: 'SQL & Databases',
          icon: FaDatabase,
          level: 1,
          description: 'Learn SQL and database management for data storage and retrieval',
          skills: ['SQL Queries', 'Database Design', 'Indexing', 'Transactions'],
          projects: ['E-commerce Database', 'Analytics Dashboard', 'Data Migration'],
          x: 25,
          y: 40,
          status: 'completed'
        },
        {
          id: 'etl-pipelines',
          name: 'ETL Pipelines',
          icon: FaCog,
          level: 2,
          description: 'Build Extract, Transform, Load pipelines for data processing',
          skills: ['Apache Airflow', 'Data Transformation', 'Error Handling', 'Monitoring'],
          projects: ['Real-time ETL Pipeline', 'Data Quality Checks', 'Automated Reports'],
          x: 75,
          y: 40,
          status: 'unlocked'
        },
        {
          id: 'big-data',
          name: 'Big Data Technologies',
          icon: FaNetworkWired,
          level: 2,
          description: 'Work with large-scale data processing frameworks',
          skills: ['Apache Spark', 'Hadoop', 'Kafka', 'Data Streaming'],
          projects: ['Real-time Analytics', 'Data Lake Architecture', 'Stream Processing'],
          x: 50,
          y: 60,
          status: 'locked'
        },
        {
          id: 'cloud-platforms',
          name: 'Cloud Platforms',
          icon: FaCloud,
          level: 3,
          description: 'Deploy and manage data infrastructure on cloud platforms',
          skills: ['AWS', 'Azure', 'GCP', 'Containerization'],
          projects: ['Cloud Data Warehouse', 'Serverless ETL', 'Multi-cloud Setup'],
          x: 25,
          y: 80,
          status: 'locked'
        },
        {
          id: 'data-architecture',
          name: 'Data Architecture',
          icon: FaProjectDiagram,
          level: 3,
          description: 'Design scalable and efficient data architectures',
          skills: ['Data Modeling', 'System Design', 'Performance Optimization', 'Security'],
          projects: ['Enterprise Data Platform', 'Data Governance', 'Compliance Framework'],
          x: 75,
          y: 80,
          status: 'locked'
        }
      ],
      connections: [
        { from: 'python-basics', to: 'sql-mastery' },
        { from: 'python-basics', to: 'etl-pipelines' },
        { from: 'sql-mastery', to: 'big-data' },
        { from: 'etl-pipelines', to: 'big-data' },
        { from: 'big-data', to: 'cloud-platforms' },
        { from: 'big-data', to: 'data-architecture' }
      ]
    },
    'data-analyst': {
      title: 'Data Analyst',
      description: 'Transform data into insights that drive business decisions and strategic planning.',
      icon: FaChartBar,
      nodes: [
        {
          id: 'python-analytics',
          name: 'Python for Analytics',
          icon: FaPython,
          level: 1,
          description: 'Learn Python libraries for data analysis and manipulation',
          skills: ['Pandas', 'NumPy', 'Data Cleaning', 'Exploratory Analysis'],
          projects: ['Sales Analysis', 'Customer Segmentation', 'Data Quality Report'],
          x: 50,
          y: 20,
          status: 'completed'
        },
        {
          id: 'sql-analytics',
          name: 'SQL for Analysis',
          icon: FaTable,
          level: 1,
          description: 'Master SQL for data extraction and analysis',
          skills: ['Complex Queries', 'Window Functions', 'CTEs', 'Performance Tuning'],
          projects: ['Business Metrics Dashboard', 'Trend Analysis', 'Data Profiling'],
          x: 25,
          y: 40,
          status: 'completed'
        },
        {
          id: 'data-visualization',
          name: 'Data Visualization',
          icon: FaChartLine,
          level: 2,
          description: 'Create compelling visualizations to communicate insights',
          skills: ['Matplotlib', 'Seaborn', 'Plotly', 'Storytelling'],
          projects: ['Interactive Dashboard', 'Executive Reports', 'Data Stories'],
          x: 75,
          y: 40,
          status: 'unlocked'
        },
        {
          id: 'statistics',
          name: 'Statistics & Math',
          icon: FaBrain,
          level: 2,
          description: 'Apply statistical methods for data analysis',
          skills: ['Descriptive Statistics', 'Inferential Statistics', 'Hypothesis Testing', 'Regression'],
          projects: ['A/B Testing Analysis', 'Predictive Modeling', 'Statistical Reports'],
          x: 50,
          y: 60,
          status: 'locked'
        },
        {
          id: 'bi-tools',
          name: 'BI Tools',
          icon: FaFileAlt,
          level: 3,
          description: 'Master business intelligence tools for reporting',
          skills: ['Tableau', 'Power BI', 'Looker', 'Dashboard Design'],
          projects: ['Executive Dashboard', 'KPI Tracking', 'Automated Reports'],
          x: 25,
          y: 80,
          status: 'locked'
        },
        {
          id: 'advanced-analytics',
          name: 'Advanced Analytics',
          icon: FaRocket,
          level: 3,
          description: 'Apply advanced analytical techniques for deeper insights',
          skills: ['Machine Learning', 'Time Series Analysis', 'Text Analytics', 'Predictive Modeling'],
          projects: ['Churn Prediction', 'Market Analysis', 'Sentiment Analysis'],
          x: 75,
          y: 80,
          status: 'locked'
        }
      ],
      connections: [
        { from: 'python-analytics', to: 'sql-analytics' },
        { from: 'python-analytics', to: 'data-visualization' },
        { from: 'sql-analytics', to: 'statistics' },
        { from: 'data-visualization', to: 'statistics' },
        { from: 'statistics', to: 'bi-tools' },
        { from: 'statistics', to: 'advanced-analytics' }
      ]
    },
    'backend-developer': {
      title: 'Backend Developer',
      description: 'Build scalable server-side applications and APIs using Python frameworks.',
      icon: FaServer,
      nodes: [
        {
          id: 'python-core',
          name: 'Python Core',
          icon: FaPython,
          level: 1,
          description: 'Master Python programming fundamentals for backend development',
          skills: ['Python Syntax', 'OOP', 'Decorators', 'Context Managers'],
          projects: ['CLI Application', 'Library Package', 'Code Generator'],
          x: 50,
          y: 20,
          status: 'completed'
        },
        {
          id: 'web-frameworks',
          name: 'Web Frameworks',
          icon: FaCode,
          level: 1,
          description: 'Learn popular Python web frameworks for building APIs',
          skills: ['Django', 'FastAPI', 'Flask', 'REST APIs'],
          projects: ['Blog API', 'E-commerce Backend', 'Authentication System'],
          x: 25,
          y: 40,
          status: 'completed'
        },
        {
          id: 'databases',
          name: 'Database Integration',
          icon: FaDb,
          level: 2,
          description: 'Work with databases and ORMs for data persistence',
          skills: ['PostgreSQL', 'MongoDB', 'SQLAlchemy', 'Database Design'],
          projects: ['Multi-tenant App', 'Data Migration Tool', 'Query Optimizer'],
          x: 75,
          y: 40,
          status: 'unlocked'
        },
        {
          id: 'authentication',
          name: 'Authentication & Security',
          icon: FaShield,
          level: 2,
          description: 'Implement secure authentication and authorization systems',
          skills: ['JWT', 'OAuth', 'Password Hashing', 'Security Best Practices'],
          projects: ['SSO System', 'Role-based Access', 'Security Audit Tool'],
          x: 50,
          y: 60,
          status: 'locked'
        },
        {
          id: 'deployment',
          name: 'Deployment & DevOps',
          icon: FaCloudIcon,
          level: 3,
          description: 'Deploy and maintain applications in production environments',
          skills: ['Docker', 'CI/CD', 'AWS/Azure', 'Monitoring'],
          projects: ['Microservices Architecture', 'Auto-scaling System', 'Monitoring Dashboard'],
          x: 25,
          y: 80,
          status: 'locked'
        },
        {
          id: 'performance',
          name: 'Performance & Scaling',
          icon: FaServerIcon,
          level: 3,
          description: 'Optimize application performance and handle high traffic',
          skills: ['Caching', 'Load Balancing', 'Database Optimization', 'Async Programming'],
          projects: ['High-traffic API', 'Caching Layer', 'Performance Monitoring'],
          x: 75,
          y: 80,
          status: 'locked'
        }
      ],
      connections: [
        { from: 'python-core', to: 'web-frameworks' },
        { from: 'python-core', to: 'databases' },
        { from: 'web-frameworks', to: 'authentication' },
        { from: 'databases', to: 'authentication' },
        { from: 'authentication', to: 'deployment' },
        { from: 'authentication', to: 'performance' }
      ]
    }
  };

  const career = careerData[careerPath];

  if (!career) {
    return (
      <div className="roadmap-detail-page">
        <div className="error-container">
          <h1>Career Path Not Found</h1>
          <p>The requested career path "{careerPath}" is not available.</p>
          <button className="back-btn" onClick={() => navigate('/roadmap')}>
            <FaArrowLeft /> Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const handleNodeClick = (node) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleCompleteNode = (nodeId) => {
    setCompletedNodes(prev => new Set([...prev, nodeId]));
    setSelectedNode(null);
  };

  const calculateProgress = () => {
    const completedCount = career.nodes.filter(node => node.status === 'completed' || completedNodes.has(node.id)).length;
    return (completedCount / career.nodes.length) * 100;
  };

  const renderConnectionLine = (connection) => {
    const fromNode = career.nodes.find(n => n.id === connection.from);
    const toNode = career.nodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const fromStatus = fromNode.status;
    const toStatus = toNode.status;
    
    let status = 'locked';
    if (fromStatus === 'completed' && toStatus !== 'locked') {
      status = 'completed';
    } else if (fromStatus === 'completed' || fromStatus === 'unlocked') {
      status = 'unlocked';
    }

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return (
      <div
        key={`${connection.from}-${connection.to}`}
        className={`connection-line ${status}`}
        style={{
          left: `${fromNode.x}%`,
          top: `${fromNode.y}%`,
          width: `${distance}%`,
          transform: `rotate(${angle}deg)`
        }}
      />
    );
  };

  return (
    <div className="roadmap-detail-page">
      <Helmet>
        <title>{`${career.title} Roadmap - Schoolabe`}</title>
        <meta name="description" content={`Master the ${career.title} career path with our interactive 3D roadmap. Learn essential skills and complete projects to advance your career.`} />
      </Helmet>

      {/* Header */}
      <div className="roadmap-header">
        <button className="back-btn" onClick={() => navigate('/roadmap')}>
          <FaArrowLeft /> Back to Roadmap
        </button>
        
        <div className="career-info">
          <div className="career-icon">
            <career.icon />
          </div>
          <div className="career-details">
            <h1>{career.title}</h1>
            <p>{career.description}</p>
          </div>
        </div>

        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
            {Math.round(calculateProgress())}% Complete
          </span>
        </div>
      </div>

      {/* Network Graph Canvas */}
      <div className="roadmap-canvas">
        <div className="network-graph">
          {/* Connection Lines */}
          {career.connections.map(renderConnectionLine)}
          
          {/* Skill Nodes */}
          {career.nodes.map((node) => {
            const IconComponent = node.icon;
            
            return (
              <div
                key={node.id}
                className={`skill-node ${node.status}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`
                }}
                onClick={() => handleNodeClick(node)}
              >
                <div className="node-icon">
                  <IconComponent />
                </div>
                <div className="node-level">{node.level}</div>
                
                {node.status === 'locked' && <FaLock className="lock-icon" />}
                {node.status === 'completed' && <FaCheck className="complete-icon" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <div className="node-details-modal" onClick={() => setSelectedNode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="node-title-section">
                <div className="node-icon-large">
                  <selectedNode.icon />
                </div>
                <div>
                  <h2 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                    {selectedNode.name}
                  </h2>
                  <p style={{ color: '#a0a0a0', margin: 0, fontSize: '0.9rem' }}>
                    {selectedNode.description}
                  </p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedNode(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="skills-section">
                <h3>
                  <FaCode /> Required Skills
                </h3>
                <div className="skills-grid">
                  {selectedNode.skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <div className="skill-icon">
                        <FaCode />
                      </div>
                      <span style={{ color: 'white', fontSize: '0.9rem' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="projects-section">
                <h3>
                  <FaProjectDiagram /> Projects to Build
                </h3>
                <div className="projects-list">
                  {selectedNode.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-icon">
                        <FaRocket />
                      </div>
                      <span style={{ color: 'white', fontSize: '0.95rem' }}>{project}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="action-section">
                {completedNodes.has(selectedNode.id) ? (
                  <div className="completed-badge">
                    <FaCheck /> Completed
                  </div>
                ) : (
                  <button
                    className="complete-btn"
                    onClick={() => handleCompleteNode(selectedNode.id)}
                  >
                    <FaCheck /> Mark as Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetail;
