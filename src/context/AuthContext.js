import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export const AuthContext = createContext();

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

  useEffect(() => {
    fetchUser(); // Fetch user details when AuthProvider mounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
