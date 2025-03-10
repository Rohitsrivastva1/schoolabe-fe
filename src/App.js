import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Contact from "./components/Contact";
import About from "./components/About";
import MonacoEditor from "./components/MonacoEditor";
import TutorialEditor from "./components/TutorialEditor";
import CourseTutorialEditor from "./components/CourseTutorialEditor";
import CourseDetail from "./components/CourseDetail";
import Auth from "./components/Auth";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import axios from "axios";
import "./App.css";
import ChangePassword from "./components/ChangePassword";

axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider> {/* Wrap the entire app with AuthProvider */}
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
              <Route path="/tutorial-editor" element={<TutorialEditor />} />
              <Route path="/course-tutorial-editor" element={<CourseTutorialEditor />} />
              <Route path="/courses/:courseSlug/:tutorialSlug" element={<CourseDetail />} />
              <Route path="/courses/:courseSlug" element={<CourseDetail />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/change-password" element={<ChangePassword />} />

            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
