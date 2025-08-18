import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { 
  FaShoppingCart, 
  FaLock, 
  FaCheck, 
  FaStar, 
  FaUsers, 
  FaClock, 
  FaPlay, 
  FaSearch,
  FaFilter,
  FaFire,
  FaRocket,
  FaGraduationCap,
  FaCode,
  FaDatabase,
  FaMobile,
  FaGlobe,
  FaShare,
  FaBookmark
} from "react-icons/fa";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  // Course categories with icons
  const categories = [
    { id: "all", name: "All Courses", icon: FaGraduationCap, count: 0 },
    { id: "python", name: "Python", icon: FaCode, count: 0 },
    { id: "javascript", name: "JavaScript", icon: FaCode, count: 0 },
    { id: "web", name: "Web Development", icon: FaGlobe, count: 0 },
    { id: "mobile", name: "Mobile Development", icon: FaMobile, count: 0 },
    { id: "database", name: "Database", icon: FaDatabase, count: 0 },
  ];

  // Realistic course data
  const realisticCourses = [
    {
      id: 1,
      title: "Complete Python Programming Masterclass",
      slug: "python-masterclass",
      description: "Learn Python from scratch to advanced level. Master data structures, algorithms, web development with Django, and data science with pandas.",
      price: 1499,
      category: "python",
      level: "Beginner",
      rating: 4.8,
      students: 12450,
      duration: "25 hours",
      isHot: true,
      isNew: false,
      isPremium: true,
      certificate: true,
      projects: 15,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "JavaScript Full Stack Development",
      slug: "javascript-fullstack",
      description: "Build modern web applications with JavaScript, React, Node.js, and MongoDB. From frontend to backend, become a full-stack developer.",
      price: 1999,
      category: "javascript",
      level: "Intermediate",
      rating: 4.7,
      students: 8900,
      duration: "30 hours",
      isHot: false,
      isNew: true,
      isPremium: true,
      certificate: true,
      projects: 12,
      lastUpdated: "2024-02-01"
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      slug: "web-development-bootcamp",
      description: "Master HTML, CSS, JavaScript, and modern web frameworks. Build responsive websites and web applications from scratch.",
      price: 1299,
      category: "web",
      level: "Beginner",
      rating: 4.6,
      students: 15600,
      duration: "20 hours",
      isHot: true,
      isNew: false,
      isPremium: false,
      certificate: true,
      projects: 10,
      lastUpdated: "2024-01-20"
    },
    {
      id: 4,
      title: "Mobile App Development with React Native",
      slug: "react-native-mobile",
      description: "Create cross-platform mobile applications using React Native. Build iOS and Android apps with a single codebase.",
      price: 1799,
      category: "mobile",
      level: "Intermediate",
      rating: 4.5,
      students: 7200,
      duration: "28 hours",
      isHot: false,
      isNew: false,
      isPremium: true,
      certificate: true,
      projects: 8,
      lastUpdated: "2024-01-10"
    },
    {
      id: 5,
      title: "Database Design and SQL Mastery",
      slug: "database-sql-mastery",
      description: "Learn database design principles, SQL programming, and database management. Work with MySQL, PostgreSQL, and MongoDB.",
      price: 999,
      category: "database",
      level: "Beginner",
      rating: 4.4,
      students: 6800,
      duration: "18 hours",
      isHot: false,
      isNew: true,
      isPremium: false,
      certificate: true,
      projects: 6,
      lastUpdated: "2024-02-05"
    },
    {
      id: 6,
      title: "Advanced Python for Data Science",
      slug: "python-data-science",
      description: "Master data science with Python. Learn pandas, numpy, matplotlib, scikit-learn, and machine learning algorithms.",
      price: 2499,
      category: "python",
      level: "Advanced",
      rating: 4.9,
      students: 5400,
      duration: "35 hours",
      isHot: true,
      isNew: false,
      isPremium: true,
      certificate: true,
      projects: 20,
      lastUpdated: "2024-01-25"
    }
  ];

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`${BASE_URL}/courses`)
      .then(response => {
        if (Array.isArray(response.data.courses)) {
          // If API has courses, merge them with realistic data
          const coursesWithPricing = response.data.courses.length > 0 
            ? response.data.courses.map((course, index) => ({
            ...course,
                ...realisticCourses[index % realisticCourses.length],
                id: course.id || index + 1,
                title: course.title || realisticCourses[index % realisticCourses.length].title,
                description: course.description || realisticCourses[index % realisticCourses.length].description,
                slug: course.slug || realisticCourses[index % realisticCourses.length].slug,
              }))
            : realisticCourses;

          setCourses(coursesWithPricing);
          setFilteredCourses(coursesWithPricing);
        } else {
          console.error("Unexpected API response format:", response.data);
          // Fallback to realistic courses if API fails
          setCourses(realisticCourses);
          setFilteredCourses(realisticCourses);
        }
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
        // Fallback to realistic courses if API fails
        const fallbackCourses = [
          {
            id: 1,
            title: "Complete Python Programming Masterclass",
            slug: "python-masterclass",
            description: "Learn Python from scratch to advanced level. Master data structures, algorithms, web development with Django, and data science with pandas.",
            price: 1499,
            category: "python",
            level: "Beginner",
            rating: 4.8,
            students: 12450,
            duration: "25 hours",
            isHot: true,
            isNew: false,
            isPremium: true,
            certificate: true,
            projects: 15,
            lastUpdated: "2024-01-15"
          },
          {
            id: 2,
            title: "JavaScript Full Stack Development",
            slug: "javascript-fullstack",
            description: "Build modern web applications with JavaScript, React, Node.js, and MongoDB. From frontend to backend, become a full-stack developer.",
            price: 1999,
            category: "javascript",
            level: "Intermediate",
            rating: 4.7,
            students: 8900,
            duration: "30 hours",
            isHot: false,
            isNew: true,
            isPremium: true,
            certificate: true,
            projects: 12,
            lastUpdated: "2024-02-01"
          },
          {
            id: 3,
            title: "Web Development Bootcamp",
            slug: "web-development-bootcamp",
            description: "Master HTML, CSS, JavaScript, and modern web frameworks. Build responsive websites and web applications from scratch.",
            price: 1299,
            category: "web",
            level: "Beginner",
            rating: 4.6,
            students: 15600,
            duration: "20 hours",
            isHot: true,
            isNew: false,
            isPremium: false,
            certificate: true,
            projects: 10,
            lastUpdated: "2024-01-20"
          }
        ];
        setCourses(fallbackCourses);
        setFilteredCourses(fallbackCourses);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Sort courses
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case "students":
        filtered.sort((a, b) => b.students - a.students);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      default: // featured
        filtered.sort((a, b) => {
          if (a.isHot && !b.isHot) return -1;
          if (!a.isHot && b.isHot) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return parseFloat(b.rating) - parseFloat(a.rating);
        });
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, sortBy]);

  const handleAddToCart = (course) => {
    if (!user) {
      toast.error('Please login to add courses to cart');
      return;
    }
    
    if (isInCart(course.id)) {
      toast.info('Course already in cart');
      return;
    }
    
    addToCart(course);
    toast.success('Course added to cart!');
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : FaCode;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "#3FB950";
      case "Intermediate": return "#F59E0B";
      case "Advanced": return "#EF4444";
      default: return "#58A6FF";
    }
  };

  return (
    <div className="courses-container">
      <Helmet>
        <title>Our Courses - Schoolabe</title>
        <meta name="description" content="Explore coding courses on Python, JavaScript, and Full-Stack Development at Schoolabe." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Hero Section */}
      <section className="courses-hero">
        <div className="hero-shell">
          <div className="hero-grid">
            <div className="hero-text">
              <h1>
                Master <span className="highlight">Programming</span> with 
                <br />
                Expert-Led Courses
              </h1>
              <p>
                Transform your career with our comprehensive Python, JavaScript, and Full-Stack Development courses. 
                Learn from industry experts and build real-world projects.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{courses.length}+</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15K+</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
            <div className="hero-media">
              <div className="hero-visual">
                <div className="code-blocks">
                  <div className="code-block">
                    <div className="code-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <div className="code-content">
                      <span className="code-line">def learn_python():</span>
                      <span className="code-line">    return "Success!"</span>
                    </div>
                  </div>
                  <div className="code-block">
                    <div className="code-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <div className="code-content">
                      <span className="code-line">const masterJS = () =&gt; {'{'}</span>
                      <span className="code-line">  return "Future Ready!";</span>
                      <span className="code-line">{'}'};</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="courses-section">
        <div className="courses-header">
          <div className="header-content">
            <div className="header-text">
              <h2>Featured Courses</h2>
              <p>Choose your learning path and start building your future</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="sort-container">
                <FaFilter className="filter-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Highest Rated</option>
                  <option value="students">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          <div className="filters-container">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const count = courses.filter(course => 
                category.id === "all" ? true : course.category === category.id
              ).length;
              
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="category-icon" />
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading amazing courses...</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="results-summary">
              <p>
                Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> courses
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>

            <div className="courses-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const CategoryIcon = getCategoryIcon(course.category);
                  
                  return (
            <div className="course-card" key={course.id}>
                      {/* Course Badges */}
                      <div className="course-badges">
                        {course.isHot && (
                          <div className="badge hot-badge">
                            <FaFire /> Hot
                          </div>
                        )}
                        {course.isNew && (
                          <div className="badge new-badge">
                            <FaRocket /> New
                          </div>
                        )}
                {course.isPremium && (
                          <div className="badge premium-badge">
                    <FaLock /> Premium
                          </div>
                )}
              </div>

                      {/* Course Image */}
                      <div className="course-image">
                        <div className="image-overlay">
                          <div className="overlay-content">
                            <div className="course-category">
                              <CategoryIcon />
                              <span>{course.category.charAt(0).toUpperCase() + course.category.slice(1)}</span>
                            </div>
                            <div className="course-level" style={{ backgroundColor: getLevelColor(course.level) }}>
                              {course.level}
                            </div>
                          </div>
                        </div>
                        <div className="course-stats-overlay">
                          <div className="stat-item">
                            <FaStar />
                            <span>{course.rating}</span>
                          </div>
                          <div className="stat-item">
                            <FaUsers />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="stat-item">
                            <FaClock />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="course-content">
                        <div className="course-header">
                          <h3>{course.title}</h3>
                          <div className="course-actions-top">
                            <button className="action-icon-btn" title="Bookmark">
                              <FaBookmark />
                            </button>
                            <button className="action-icon-btn" title="Share">
                              <FaShare />
                            </button>
                          </div>
                        </div>
                        
                        <p className="course-description">{course.description}</p>
                        
                        <div className="course-features">
                          <div className="feature-item">
                            <FaGraduationCap />
                            <span>{course.projects} Projects</span>
                          </div>
                          {course.certificate && (
                            <div className="feature-item">
                              <FaCheck />
                              <span>Certificate</span>
                            </div>
                          )}
                          <div className="feature-item">
                            <FaClock />
                            <span>Updated {course.lastUpdated}</span>
                          </div>
                        </div>

                        <div className="course-meta">
                          <div className="course-rating">
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={`star ${i < Math.floor(course.rating) ? 'filled' : ''}`}
                                />
                              ))}
                            </div>
                            <span className="rating-text">{course.rating}</span>
                            <span className="rating-count">({course.students.toLocaleString()} students)</span>
                          </div>
                        </div>

              <div className="course-price">
                          <div className="price-info">
                            <span className="current-price">₹{course.price.toLocaleString()}</span>
                            {course.isPremium && (
                              <span className="original-price">₹{(course.price + 500).toLocaleString()}</span>
                            )}
                {course.isPremium && (
                              <span className="discount-badge">Save ₹500</span>
                )}
              </div>
                        </div>

              <div className="course-actions">
                {isInCart(course.id) ? (
                            <button className="action-btn success-btn" disabled>
                    <FaCheck /> In Cart
                  </button>
                ) : (
                  <button 
                              className="action-btn cart-btn"
                    onClick={() => handleAddToCart(course)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                )}
                <Link 
                            to={`/courses/${course.slug}`}
                            className="action-btn view-btn"
                >
                            <FaPlay /> {course.isPremium ? 'Preview' : 'View Course'}
                </Link>
              </div>
            </div>
                      
                      {/* Make entire card clickable for better UX */}
                      <Link 
                        to={`/courses/${course.slug}`}
                        className="course-card-overlay"
                        title={`View ${course.title}`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="no-courses">
                  <div className="no-courses-content">
                    <FaSearch className="no-courses-icon" />
                    <h3>No courses found</h3>
                    <p>
                      {searchTerm 
                        ? `No courses match "${searchTerm}". Try different keywords.`
                        : "No courses available in this category. Check back soon!"
                      }
                    </p>
                    {(searchTerm || selectedCategory !== "all") && (
                      <button 
                        className="clear-filters-btn"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        }}
                      >
                        Clear Filters
                      </button>
        )}
      </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Courses;
