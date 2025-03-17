import React, { useEffect } from "react";
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
import { AuthProvider } from "./components/AuthContext";
import { LoaderProvider, useLoader } from "./context/LoaderContext"; // Loader Context
import Loader from "./components/Loader"; // Loader Component
import { setupInterceptors } from "./api/axiosInstance"; // Axios Interceptors
import "./App.css";

const AppContent = () => {
  const { setLoading } = useLoader();

  // useEffect(() => {
  //   setupInterceptors(setLoading); // Initialize global API loader
  // }, [setLoading]);

  return (
    <Router>
      <div className="navbar">
        <Navbar />
      </div>
      <Loader /> {/* Global Loader */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/code" element={<MonacoEditor />} />
          <Route path="/cod" element={<TutorialEditor />} />
          <Route path="/editor" element={<CourseTutorialEditor />} />
          <Route path="/courses/:courseSlug/:tutorialSlug" element={<CourseDetail />} />
          <Route path="/courses/:courseSlug" element={<CourseDetail />} />
          <Route path="/signup" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LoaderProvider>
          <AppContent />
        </LoaderProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
