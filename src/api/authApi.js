import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 
  ? `${process.env.REACT_APP_API_BASE_URL}/auth` 
  : "/auth";

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (loginData) => {
  return axios.post(`${API_BASE_URL}/login`, loginData);
};

export const verifyOtp = async (otpData) => {
  return axios.post(`${API_BASE_URL}/verify-otp`, otpData, { withCredentials: true });
};

export const forgotPassword = async (emailData) => {
  return axios.post(`${API_BASE_URL}/forgot-password`, emailData);
};

export const resetPassword = async (resetData) => {
  return axios.post(`${API_BASE_URL}/reset-password`, resetData);
};
