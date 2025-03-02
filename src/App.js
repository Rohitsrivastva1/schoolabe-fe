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
  );
};

export default App;
