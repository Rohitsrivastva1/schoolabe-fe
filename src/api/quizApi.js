import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/quizzes`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}/quizzes`, quizData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateQuiz = async (slug, quizData) => {
  try {
    const response = await axios.put(`${API_URL}/quizzes/${slug}`, quizData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteQuiz = async (slug) => {
  try {
    const response = await axios.delete(`${API_URL}/quizzes/${slug}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getQuizBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${slug}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${API_URL}/questions/${questionId}`);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
