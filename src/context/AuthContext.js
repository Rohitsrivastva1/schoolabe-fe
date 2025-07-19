import React, { createContext, useState, useEffect, useContext } from "react";
// import axiosInstance from "../services/axiosInstance";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user details
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me"); // Calls API to get user
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // Cache user data
      }
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user details when AuthProvider mounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
