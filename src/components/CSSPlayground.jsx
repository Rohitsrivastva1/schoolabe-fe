import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CSSPlayground.css';

const CSSPlayground = () => {
  const [activeTab, setActiveTab] = useState('flexbox');
  const [cssProperties, setCssProperties] = useState({
    flexbox: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '10px',
      justifyItems: 'center',
      alignItems: 'center'
    },
    positioning: {
      position: 'relative',
      top: '0px',
      left: '0px',
      zIndex: '1'
    },
    responsive: {
      width: '100%',
      maxWidth: '800px',
      minHeight: '400px'
    }
  });

  const [previewSize, setPreviewSize] = useState({ width: 800, height: 400 });
  const [challengeMode, setChallengeMode] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [showAlignmentGuides, setShowAlignmentGuides] = useState(false);
  const [customCSS, setCustomCSS] = useState('');
  const [useCustomCSS, setUseCustomCSS] = useState(false);
  
  // New state for enhanced features
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    challengesCompleted: 0,
    badges: [],
    totalChallenges: 0
  });

  const challenges = [
    {
      title: "Center the boxes horizontally and vertically using Flexbox",
      description: "Use justify-content and align-items to center all boxes",
      target: { justifyContent: 'center', alignItems: 'center' },
      type: 'flexbox',
      difficulty: 'Beginner',
      hint: "Try setting justify-content to 'center' and align-items to 'center'",
      xpReward: 50
    },
    {
      title: "Create a 3x3 grid with equal gaps",
      description: "Set up a 3x3 grid layout with consistent spacing",
      target: { gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' },
      type: 'grid',
      difficulty: 'Intermediate',
      hint: "Set both grid-template-columns and grid-template-rows to 'repeat(3, 1fr)'",
      xpReward: 75
    },
    {
      title: "Position the red box absolutely in the top-right corner",
      description: "Use absolute positioning to place the red box in the corner",
      target: { position: 'absolute', top: '0px', right: '0px' },
      type: 'positioning',
      difficulty: 'Advanced',
      hint: "Set position to 'absolute', top to '0px', and right to '0px'",
      xpReward: 100
    }
  ];

  // Badge system
  const badges = [
    { id: 'flexbox-master', name: 'Flexbox Master 🌟', description: 'Complete 5 Flexbox challenges', requirement: 5, type: 'flexbox' },
    { id: 'grid-guru', name: 'Grid Guru 🔲', description: 'Complete 5 Grid challenges', requirement: 5, type: 'grid' },
    { id: 'positioning-pro', name: 'Positioning Pro 📍', description: 'Complete 5 Positioning challenges', requirement: 5, type: 'positioning' },
    { id: 'css-ninja', name: 'CSS Ninja ⚡', description: 'Complete 15 challenges total', requirement: 15, type: 'all' },
    { id: 'beginner', name: 'CSS Beginner 🌱', description: 'Complete your first challenge', requirement: 1, type: 'all' },
    { id: 'intermediate', name: 'CSS Intermediate 🚀', description: 'Complete 10 challenges', requirement: 10, type: 'all' },
    { id: 'advanced', name: 'CSS Advanced 🏆', description: 'Complete 20 challenges', requirement: 20, type: 'all' }
  ];

  // Initialize user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cssPlaygroundProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      setUserProgress({
        xp: 0,
        level: 1,
        challengesCompleted: 0,
        badges: [],
        totalChallenges: 0
      });
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('cssPlaygroundProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Calculate level from XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  // Check for new badges
  const checkForNewBadges = (challengeType) => {
    const newBadges = [];
    
    badges.forEach(badge => {
      if (!userProgress.badges.includes(badge.id)) {
        let shouldAward = false;
        
        if (badge.type === 'all') {
          shouldAward = userProgress.challengesCompleted >= badge.requirement;
        } else if (badge.type === challengeType) {
          const typeChallenges = userProgress.challengesCompleted; // Simplified for demo
          shouldAward = typeChallenges >= badge.requirement;
        }
        
        if (shouldAward) {
          newBadges.push(badge);
        }
      }
    });
    
    return newBadges;
  };

  // Award XP and check for level up
  const awardXP = (amount, challengeType) => {
    setUserProgress(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const newChallengesCompleted = prev.challengesCompleted + 1;
      
      const newBadges = checkForNewBadges(challengeType);
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        challengesCompleted: newChallengesCompleted,
        badges: [...prev.badges, ...newBadges.map(b => b.id)]
      };
    });
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('preview-container')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPreviewSize(prev => ({
        width: Math.max(300, Math.min(1200, prev.width + deltaX)),
        height: Math.max(200, Math.min(800, prev.height + deltaY))
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // Resizing functionality
  const handleResizeStart = (e, handle) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e) => {
    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPreviewSize(prev => {
        let newWidth = prev.width;
        let newHeight = prev.height;
        
        if (resizeHandle.includes('right')) {
          newWidth = Math.max(300, Math.min(1200, prev.width + deltaX));
        }
        if (resizeHandle.includes('bottom')) {
          newHeight = Math.max(200, Math.min(800, prev.height + deltaY));
        }
        
        return { width: newWidth, height: newHeight };
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Enhanced challenge completion
  const checkChallenge = () => {
    const current = challenges[currentChallenge];
    const currentProps = cssProperties[current.type];
    
    let completed = true;
    Object.entries(current.target).forEach(([property, targetValue]) => {
      if (currentProps[property] !== targetValue) {
        completed = false;
      }
    });
    
    if (completed) {
      setChallengeCompleted(true);
      
      // Award XP and check for badges
      awardXP(current.xpReward, current.type);
      
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(prev => prev + 1);
          setChallengeCompleted(false);
        } else {
          setChallengeMode(false);
          setCurrentChallenge(0);
          setChallengeCompleted(false);
        }
      }, 2000);
    }
  };

  const generateCSS = () => {
    if (useCustomCSS && customCSS.trim()) {
      return customCSS;
    }
    
    const currentProps = cssProperties[activeTab];
    let css = `.playground-container {\n`;
    
    Object.entries(currentProps).forEach(([property, value]) => {
      if (value !== '') {
        css += `  ${property}: ${value};\n`;
      }
    });
    
    css += `}`;
    return css;
  };

  const updateCSSProperty = (property, value) => {
    setCssProperties(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [property]: value
      }
    }));
  };

  const resetToDefaults = () => {
    setCssProperties({
      flexbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '10px'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '10px',
        justifyItems: 'center',
        alignItems: 'center'
      },
      positioning: {
        position: 'relative',
        top: '0px',
        left: '0px',
        zIndex: '1'
      },
      responsive: {
        width: '100%',
        maxWidth: '800px',
        minHeight: '400px'
      }
    });
    setCustomCSS('');
    setUseCustomCSS(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
  };

  // Parse custom CSS and apply to preview
  const parseCustomCSS = (cssString) => {
    try {
      // Enhanced CSS parser for better property extraction
      const cssObj = {};
      const lines = cssString.split('\n');
      
      lines.forEach(line => {
        // Remove comments and extra whitespace
        const cleanLine = line.replace(/\/\*.*?\*\//g, '').trim();
        
        // Match CSS property: value; pattern
        const match = cleanLine.match(/^([a-zA-Z-]+)\s*:\s*([^;]+);?$/);
        if (match) {
          const [, property, value] = match;
          const cleanProperty = property.trim();
          const cleanValue = value.trim();
          
          // Convert CSS property names to camelCase for React
          const reactProperty = cleanProperty.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          
          // Handle special cases
          if (reactProperty === 'zIndex') {
            cssObj[reactProperty] = parseInt(cleanValue) || 1;
          } else if (reactProperty === 'position') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'display') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'flexDirection') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'justifyContent') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'alignItems') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'flexWrap') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'gap') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'gridTemplateColumns') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'gridTemplateRows') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'justifyItems') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'top' || reactProperty === 'left' || reactProperty === 'right' || reactProperty === 'bottom') {
            cssObj[reactProperty] = cleanValue;
          } else if (reactProperty === 'width' || reactProperty === 'height' || reactProperty === 'maxWidth' || reactProperty === 'minHeight') {
            cssObj[reactProperty] = cleanValue;
          }
        }
      });
      
      console.log('Parsed CSS:', cssObj); // Debug log
      return cssObj;
    } catch (error) {
      console.log('CSS parsing error:', error);
      return {};
    }
  };

  // Get current CSS properties for preview
  const getCurrentPreviewCSS = () => {
    if (useCustomCSS && customCSS.trim()) {
      const parsedCSS = parseCustomCSS(customCSS);
      console.log('Using custom CSS for preview:', parsedCSS); // Debug log
      return parsedCSS;
    }
    console.log('Using control CSS for preview:', cssProperties[activeTab]); // Debug log
    return cssProperties[activeTab];
  };

  // Handle custom CSS changes with debouncing for better performance
  const handleCustomCSSChange = (value) => {
    setCustomCSS(value);
    setUseCustomCSS(true);
    
    // Force a re-render to update preview
    setTimeout(() => {
      const parsedCSS = parseCustomCSS(value);
      if (Object.keys(parsedCSS).length > 0) {
        // Update the preview immediately
        setCssProperties(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            ...parsedCSS
          }
        }));
      }
    }, 100);
  };

  useEffect(() => {
    if (challengeMode) {
      checkChallenge();
    }
  }, [cssProperties, challengeMode]);

  // Global mouse event listeners for dragging and resizing
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging || isResizing) {
        e.preventDefault();
        if (isDragging) {
          handleMouseMove(e);
        } else if (isResizing) {
          handleResizeMove(e);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div className="css-playground-container">
      {/* Enhanced Header */}
      <div className="playground-header">
        <h1>🎨 CSS Playground</h1>
        <p>Master CSS with interactive examples and real-time preview. Experiment with Flexbox, Grid, Positioning, and Responsive Design concepts.</p>
        
        {/* Progress Bar and XP System */}
        <div className="progress-section">
          <div className="level-info">
            <span className="level-badge">Level {userProgress.level}</span>
            <span className="xp-display">{userProgress.xp} XP</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(userProgress.xp % 100)}%` }}
            ></div>
          </div>
          <div className="challenges-info">
            <span>Challenges: {userProgress.challengesCompleted}</span>
            <span>Badges: {userProgress.badges.length}</span>
          </div>
        </div>

        {/* Badge Display */}
        {userProgress.badges.length > 0 && (
          <div className="badges-display">
            <h4>🏆 Your Badges</h4>
            <div className="badges-grid">
              {userProgress.badges.map(badgeId => {
                const badge = badges.find(b => b.id === badgeId);
                return badge ? (
                  <div key={badge.id} className="badge-item" title={badge.description}>
                    {badge.name}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        <div className="playground-controls">
          <button 
            className={`control-btn ${challengeMode ? 'active' : ''}`}
            onClick={() => setChallengeMode(!challengeMode)}
          >
            {challengeMode ? '🎯 Challenge Mode Active' : '🎯 Start Challenges'}
          </button>
          
          <button className="control-btn" onClick={resetToDefaults}>
            🔄 Reset to Defaults
          </button>
          
          <button className="control-btn" onClick={copyToClipboard}>
            📋 Copy Generated CSS
          </button>
        </div>
      </div>

      {/* Enhanced Challenge Banner */}
      {challengeMode && (
        <div className="challenge-banner">
          <div className="xp-reward">+{challenges[currentChallenge].xpReward} XP</div>
          <div className="challenge-info">
            <h3>🎯 Challenge {currentChallenge + 1}: {challenges[currentChallenge].title}</h3>
            <p>{challenges[currentChallenge].description}</p>
            <div className="challenge-meta">
              <span className="difficulty-badge">{challenges[currentChallenge].difficulty}</span>
              <span className="hint-text">💡 Hint: {challenges[currentChallenge].hint}</span>
            </div>
          </div>
          {challengeCompleted && (
            <div className="challenge-success">
              ✅ Challenge Completed! +{challenges[currentChallenge].xpReward} XP earned!
            </div>
          )}
        </div>
      )}

      {/* Three-Column Main Layout */}
      <div className="playground-layout-three-column">
        {/* Column 1: Controls Panel */}
        <div className="controls-column">
          <div className="control-panel">
            <div className="tab-navigation">
              {['flexbox', 'grid', 'positioning', 'responsive'].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="controls-content">
              {activeTab === 'flexbox' && (
                <div className="control-group">
                  <h4>⚙️ Flexbox Properties</h4>
                  
                  <div className="control-item">
                    <label>Flex Direction:</label>
                    <select 
                      value={cssProperties.flexbox.flexDirection}
                      onChange={(e) => updateCSSProperty('flexDirection', e.target.value)}
                    >
                      <option value="row">Row (Horizontal)</option>
                      <option value="column">Column (Vertical)</option>
                      <option value="row-reverse">Row Reverse</option>
                      <option value="column-reverse">Column Reverse</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Justify Content:</label>
                    <select 
                      value={cssProperties.flexbox.justifyContent}
                      onChange={(e) => updateCSSProperty('justifyContent', e.target.value)}
                    >
                      <option value="flex-start">Flex Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">Flex End</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                      <option value="space-evenly">Space Evenly</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Align Items:</label>
                    <select 
                      value={cssProperties.flexbox.alignItems}
                      onChange={(e) => updateCSSProperty('alignItems', e.target.value)}
                    >
                      <option value="stretch">Stretch</option>
                      <option value="flex-start">Flex Start</option>
                      <option value="center">Center</option>
                      <option value="flex-end">Flex End</option>
                      <option value="baseline">Baseline</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Flex Wrap:</label>
                    <select 
                      value={cssProperties.flexbox.flexWrap}
                      onChange={(e) => updateCSSProperty('flexWrap', e.target.value)}
                    >
                      <option value="nowrap">No Wrap</option>
                      <option value="wrap">Wrap</option>
                      <option value="wrap-reverse">Wrap Reverse</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Gap Between Items:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={parseInt(cssProperties.flexbox.gap)}
                      onChange={(e) => updateCSSProperty('gap', e.target.value + 'px')}
                    />
                    <span>{cssProperties.flexbox.gap}</span>
                  </div>
                </div>
              )}

              {activeTab === 'grid' && (
                <div className="control-group">
                  <h4>⚙️ Grid Properties</h4>
                  
                  <div className="control-item">
                    <label>Number of Columns:</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      value={cssProperties.grid.gridTemplateColumns.split('(')[1]?.split(',')[0] || 3}
                      onChange={(e) => updateCSSProperty('gridTemplateColumns', `repeat(${e.target.value}, 1fr)`)}
                    />
                    <span>{cssProperties.grid.gridTemplateColumns.split('(')[1]?.split(',')[0] || 3} columns</span>
                  </div>

                  <div className="control-item">
                    <label>Number of Rows:</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="6" 
                      value={cssProperties.grid.gridTemplateRows.split('(')[1]?.split(',')[0] || 2}
                      onChange={(e) => updateCSSProperty('gridTemplateRows', `repeat(${e.target.value}, 1fr)`)}
                    />
                    <span>{cssProperties.grid.gridTemplateRows.split('(')[1]?.split(',')[0] || 2} rows</span>
                  </div>

                  <div className="control-item">
                    <label>Grid Gap:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={parseInt(cssProperties.grid.gap)}
                      onChange={(e) => updateCSSProperty('gap', e.target.value + 'px')}
                    />
                    <span>{cssProperties.grid.gap}</span>
                  </div>

                  <div className="control-item">
                    <label>Justify Items:</label>
                    <select 
                      value={cssProperties.grid.justifyItems}
                      onChange={(e) => updateCSSProperty('justifyItems', e.target.value)}
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                      <option value="stretch">Stretch</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Align Items:</label>
                    <select 
                      value={cssProperties.grid.alignItems}
                      onChange={(e) => updateCSSProperty('alignItems', e.target.value)}
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                      <option value="stretch">Stretch</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'positioning' && (
                <div className="control-group">
                  <h4>⚙️ Positioning Properties</h4>
                  
                  <div className="control-item">
                    <label>Position Type:</label>
                    <select 
                      value={cssProperties.positioning.position}
                      onChange={(e) => updateCSSProperty('position', e.target.value)}
                    >
                      <option value="static">Static (Default)</option>
                      <option value="relative">Relative</option>
                      <option value="absolute">Absolute</option>
                      <option value="fixed">Fixed</option>
                      <option value="sticky">Sticky</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Top Offset:</label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      value={parseInt(cssProperties.positioning.top)}
                      onChange={(e) => updateCSSProperty('top', e.target.value + 'px')}
                    />
                    <span>{cssProperties.positioning.top}</span>
                  </div>

                  <div className="control-item">
                    <label>Left Offset:</label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      value={parseInt(cssProperties.positioning.left)}
                      onChange={(e) => updateCSSProperty('left', e.target.value + 'px')}
                    />
                    <span>{cssProperties.positioning.left}</span>
                  </div>

                  <div className="control-item">
                    <label>Z-Index Layer:</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={parseInt(cssProperties.positioning.zIndex)}
                      onChange={(e) => updateCSSProperty('zIndex', e.target.value)}
                    />
                    <span>{cssProperties.positioning.zIndex}</span>
                  </div>
                </div>
              )}

              {activeTab === 'responsive' && (
                <div className="control-group">
                  <h4>⚙️ Responsive Properties</h4>
                  
                  <div className="control-item">
                    <label>Preview Width:</label>
                    <input 
                      type="range" 
                      min="300" 
                      max="1200" 
                      value={previewSize.width}
                      onChange={(e) => setPreviewSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    />
                    <span>{previewSize.width}px</span>
                  </div>

                  <div className="control-item">
                    <label>Preview Height:</label>
                    <input 
                      type="range" 
                      min="200" 
                      max="800" 
                      value={previewSize.height}
                      onChange={(e) => setPreviewSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    />
                    <span>{previewSize.height}px</span>
                  </div>

                  <div className="control-item">
                    <label>Max Container Width:</label>
                    <input 
                      type="range" 
                      min="200" 
                      max="1200" 
                      value={parseInt(cssProperties.responsive.maxWidth)}
                      onChange={(e) => updateCSSProperty('maxWidth', e.target.value + 'px')}
                    />
                    <span>{cssProperties.responsive.maxWidth}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Live Preview Area */}
        <div className="preview-column">
          <div className="preview-section">
            <div className="preview-header">
              <h3>👁️ Live Preview</h3>
              <div className="preview-controls">
                <button 
                  className={`preview-toggle-btn ${showGridLines ? 'active' : ''}`}
                  onClick={() => setShowGridLines(!showGridLines)}
                  title="Toggle Grid Lines"
                >
                  🔲 Grid Lines
                </button>
                <button 
                  className={`preview-toggle-btn ${showAlignmentGuides ? 'active' : ''}`}
                  onClick={() => setShowAlignmentGuides(!showAlignmentGuides)}
                  title="Toggle Alignment Guides"
                >
                  📐 Guides
                </button>
                <div className="preview-size">
                  {previewSize.width} × {previewSize.height}
                </div>
              </div>
            </div>
            
            <div 
              className={`preview-container ${showGridLines ? 'show-grid-lines' : ''} ${showAlignmentGuides ? 'show-alignment-guides' : ''}`}
              style={{
                width: previewSize.width + 'px',
                height: previewSize.height + 'px',
                ...getCurrentPreviewCSS() // Real-time preview updates
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Resize Handles */}
              <div 
                className="resize-handle resize-handle-right"
                onMouseDown={(e) => handleResizeStart(e, 'right')}
                onMouseMove={handleResizeMove}
                onMouseUp={handleMouseUp}
              ></div>
              <div 
                className="resize-handle resize-handle-bottom"
                onMouseDown={(e) => handleResizeStart(e, 'bottom')}
                onMouseMove={handleResizeMove}
                onMouseUp={handleMouseUp}
              ></div>
              <div 
                className="resize-handle resize-handle-corner"
                onMouseDown={(e) => handleResizeStart(e, 'right bottom')}
                onMouseMove={handleResizeMove}
                onMouseUp={handleMouseUp}
              ></div>
              
              {showAlignmentGuides && (
                <>
                  <div className="alignment-guide vertical-center"></div>
                  <div className="alignment-guide horizontal-center"></div>
                </>
              )}
              <div className="preview-box box-1">1</div>
              <div className="preview-box box-2">2</div>
              <div className="preview-box box-3">3</div>
              <div className="preview-box box-4">4</div>
              <div className="preview-box box-5">5</div>
              <div className="preview-box box-6">6</div>
              <div className="preview-box box-7">7</div>
              <div className="preview-box box-8">8</div>
              <div className="preview-box box-9">9</div>
            </div>
          </div>
        </div>

        {/* Column 3: CSS Code Editor */}
        <div className="code-column">
          <div className="code-output">
            <div className="code-header">
              <h3>💻 CSS Code Editor</h3>
              <div className="code-controls">
                <button 
                  className={`code-toggle-btn ${useCustomCSS ? 'active' : ''}`}
                  onClick={() => setUseCustomCSS(!useCustomCSS)}
                >
                  {useCustomCSS ? '🎛️ Use Controls' : '✏️ Edit CSS'}
                </button>
                <button className="copy-btn" onClick={copyToClipboard}>
                  📋 Copy CSS
                </button>
              </div>
            </div>
            
            {useCustomCSS ? (
              <div className="monaco-editor-container">
                <Editor
                  height="500px"
                  defaultLanguage="css"
                  value={customCSS || generateCSS()}
                  onChange={handleCustomCSSChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            ) : (
              <pre className="code-block">
                <code>{generateCSS()}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="quick-tips">
        <h3>💡 Quick Tips & Best Practices</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🎯 Flexbox</h4>
            <p>Use <code>justify-content</code> for horizontal alignment and <code>align-items</code> for vertical alignment. Perfect for navigation menus and card layouts.</p>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout" target="_blank" rel="noopener noreferrer" className="learn-more-link">
              🔗 Learn More on MDN
            </a>
          </div>
          <div className="tip-card">
            <h4>🔲 CSS Grid</h4>
            <p><code>grid-template-columns</code> defines column sizes, <code>gap</code> adds spacing between items. Ideal for complex layouts and photo galleries.</p>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout" target="_blank" rel="noopener noreferrer" className="learn-more-link">
              🔗 Learn More on MDN
            </a>
          </div>
          <div className="tip-card">
            <h4>📍 Positioning</h4>
            <p><code>absolute</code> removes from normal flow, <code>relative</code> keeps in flow but allows offset. Great for tooltips and modals.</p>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/position" target="_blank" rel="noopener noreferrer" className="learn-more-link">
              🔗 Learn More on MDN
            </a>
          </div>
          <div className="tip-card">
            <h4>📱 Responsive Design</h4>
            <p>Use <code>max-width</code> and <code>min-height</code> for flexible, responsive layouts. Test different screen sizes for mobile-first design.</p>
            <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" target="_blank" rel="noopener noreferrer" className="learn-more-link">
              🔗 Learn More on MDN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSPlayground;