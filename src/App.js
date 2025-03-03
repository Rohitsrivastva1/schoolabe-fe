import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Contact from "./components/Contact";
import About from "./components/About";
import MonacoEditor from "./components/MonacoEditor";
import CoursePage from "./components/CoursePage";
import Sidebar from "./components/Sidebar";
import TutorialEditor from "./components/TutorialEditor";
import CourseTutorialEditor from "./components/CourseTutorialEditor";
import CourseDetail from "./components/CourseDetail";
import "./App.css";
const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="navbar">
        <Navbar />
        
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/code" element={<MonacoEditor />} />
            <Route path="/cod" element={<TutorialEditor  />} />
            <Route path="/ed" element={<CourseTutorialEditor  />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route
              path="/courses/:course/:topicId"
              element={
                <div className="course-layout">
                  <Sidebar course="python" />
                  <CoursePage />
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
