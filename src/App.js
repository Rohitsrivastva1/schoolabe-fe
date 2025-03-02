import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Contact from "./components/Contact";
import About from "./components/About";
import MonacoEditor from "./components/MonacoEditor";
import CoursePage from "./components/CoursePage";
import Sidebar from "./components/Sidebar";
import "./App.css"; // Import global styles
import TutorialEditor from "./components/TutorialEditor";
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/code" element={<MonacoEditor />} />
          <Route path="/cod" element={<TutorialEditor />} />

          {/* Course Page with Sidebar */}
          <Route
            path="/courses/:course/:topicId"
            element={
              <div className="course-container">
                <Sidebar />
                <CoursePage />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
