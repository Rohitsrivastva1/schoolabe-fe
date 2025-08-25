import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Courses from "./components/Courses";
import Contact from "./components/Contact";
import About from "./components/About";
import Roadmap from "./components/Roadmap";
import RoadmapDetail from "./components/RoadmapDetail";
import MonacoEditor from "./components/MonacoEditor";
import TutorialEditor from "./components/TutorialEditor";
import CourseTutorialEditor from "./components/CourseTutorialEditor";
import CourseDetail from "./components/CourseDetail";
import Auth from "./components/Auth";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext"; // Loader Context
import { CartProvider } from "./context/CartContext"; // Cart Context
import { ThemeProvider } from "./context/ThemeContext"; // Theme Context
import Loader from "./components/Loader"; // Loader Component
import ChangePassword from "./components/ChangePassword";
import Cart from "./components/Cart";
import EditProfile from "./components/EditProfile";
import Progress from "./components/Progress";
import ForgotPassword from "./components/ForgotPassword";
import CSSPlayground from "./components/CSSPlayground";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import MembershipPlans from "./components/MembershipPlans";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import "./App.css";

const AppContent = () => {
  // Removed unused setLoading variable

  return (
    <Router>
      <div className="navbar">
        <Navbar />
      </div>
      <Loader /> {/* Global Loader */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/:careerPath" element={<RoadmapDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/code" element={<MonacoEditor />} />
          <Route path="/cod" element={<TutorialEditor />} />
          <Route path="/editor" element={<CourseTutorialEditor />} />
          <Route path="/courses/:courseSlug/:tutorialSlug" element={<CourseDetail />} />
          <Route path="/courses/:courseSlug" element={<CourseDetail />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/css-playground" element={<CSSPlayground />} />

          {/* 🔥 Admin Quiz Routes */}
          <Route path="/admin/quiz/create" element={
            <AdminRoute>
              <AdminQuizForm />
            </AdminRoute>
          } />
          <Route path="/admin/quiz/:quizId/part" element={
            <AdminRoute>
              <QuizPartForm />
            </AdminRoute>
          } />
          <Route path="/admin/quiz/:quizId/questions" element={
            <AdminRoute>
              <QuestionForm />
            </AdminRoute>
          } />
          <Route path="/admin/quiz/:quizId/questions/:questionId/options" element={
            <AdminRoute>
              <OptionForm />
            </AdminRoute>
          } />

          {/* 🧑‍💻 User Quiz Routes */}
          <Route path="/quizzes" element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:quizId/attempt/:subQuizId" element={
            <ProtectedRoute>
              <QuizAttempt />
            </ProtectedRoute>
          } />
          
          {/* 👑 Membership Routes */}
          <Route path="/membership" element={
            <ProtectedRoute>
              <MembershipPlans />
            </ProtectedRoute>
          } />


          {/* 🛠️ Admin DSA Routes */}
          <Route path="/admin/dsa/categories" element={
            <AdminRoute>
              <CategoryManager />
            </AdminRoute>
          } />
          <Route path="/admin/dsa/questions/:categoryId" element={
            <AdminRoute>
              <QuestionManager />
            </AdminRoute>
          } />
          <Route path="/admin/dsa/testcases/:questionId" element={
            <AdminRoute>
              <TestCaseManager />
            </AdminRoute>
          } />


          <Route path="/practisecode" element={
            <ProtectedRoute>
              <DSACategoryList />
            </ProtectedRoute>
          } />
          <Route path="/dsa/category/:categoryId" element={
            <ProtectedRoute>
              <DSAQuestionList />
            </ProtectedRoute>
          } />
          <Route path="/dsa/question/:questionId" element={
            <ProtectedRoute>
              <DSAQuestionSolve />
            </ProtectedRoute>
          } />


        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <LoaderProvider>
              <AppContent />
            </LoaderProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
