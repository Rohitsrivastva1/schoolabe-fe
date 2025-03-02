import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Use only HashRouter

import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Contact from "./components/Contact";
import About from "./components/About";
import MonacoEditor from "./components/MonacoEditor";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/code" element={<MonacoEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
