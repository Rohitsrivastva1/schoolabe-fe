import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Ensures cookies are sent
});

// Function to check if user is authenticated
export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data; // Returns user details if authenticated
  } catch (error) {
    return null; // Returns null if not authenticated
  }
};
