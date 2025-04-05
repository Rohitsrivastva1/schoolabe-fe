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
import { AuthProvider } from "./components/AuthContext";
import { LoaderProvider, useLoader } from "./context/LoaderContext"; // Loader Context
import Loader from "./components/Loader"; // Loader Component
import { setupInterceptors } from "./api/axiosInstance"; // Axios Interceptors
import ChangePassword from "./components/ChangePassword";

import AdminQuizForm from "./components/AdminQuiz/AdminQuizForm";
import QuizPartForm from "./components/AdminQuiz/QuizPartForm";
import QuestionForm from "./components/AdminQuiz/QuestionForm";
import OptionForm from "./components/AdminQuiz/OptionForm";

import QuizList from "./components/UserQuiz/QuizList";
import QuizDetail from "./components/UserQuiz/QuizDetail";
import QuizAttempt from "./components/UserQuiz/QuizAttempt";

import CategoryManager from "./components/AdminDSA/CategoryManager";
import QuestionManager from "./components/AdminDSA/QuestionManager";
import TestCaseManager from "./components/AdminDSA/TestCaseManager";


import DSACategoryList from "./components/UserDSA/DSACategoryList";
import DSAQuestionList from "./components/UserDSA/DSAQuestionList";

import DSAQuestionSolve from "./components/UserDSA/DSAQuestionSolver";

import "./App.css";

const AppContent = () => {
  const { setLoading } = useLoader();

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
          <Route path="/change-password" element={<ChangePassword />} />

          {/* 🔥 Admin Quiz Routes */}
          <Route path="/admin/quiz/create" element={<AdminQuizForm />} />
          <Route path="/admin/quiz/:quizId/part" element={<QuizPartForm />} />
          <Route path="/admin/quiz/:quizId/questions" element={<QuestionForm />} />
          <Route path="/admin/quiz/:quizId/questions/:questionId/options" element={<OptionForm />} />

          {/* 🧑‍💻 User Quiz Routes */}
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/quizzes/:quizId/attempt/:subQuizId" element={<QuizAttempt />} />


          {/* 🛠️ Admin DSA Routes */}
          <Route path="/admin/dsa/categories" element={<CategoryManager />} />
          <Route path="/admin/dsa/questions/:categoryId" element={<QuestionManager />} />
          <Route path="/admin/dsa/testcases/:questionId" element={<TestCaseManager />} />


          <Route path="/dsa" element={<DSACategoryList />} />
          <Route path="/dsa/category/:categoryId" element={<DSAQuestionList />} />
          <Route path="/dsa/question/:questionId" element={<DSAQuestionSolve />} />


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
