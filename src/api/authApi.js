import axios from "axios";

const API_BASE_URL = "/auth"; // Change this if needed

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (loginData) => {
  return axios.post(`${API_BASE_URL}/login`, loginData);
};

export const verifyOtp = async (otpData) => {
  return axios.post(`${API_BASE_URL}/verify-otp`, otpData);
};
