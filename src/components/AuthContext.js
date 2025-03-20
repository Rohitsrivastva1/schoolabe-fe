import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from sessionStorage if available
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(!user); // Avoid loading if user exists in session

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data.user);
        sessionStorage.setItem("user", JSON.stringify(response.data.user)); // Store user in session
      } catch (error) {
        setUser(null);
        sessionStorage.removeItem("user"); // Clear session if error occurs
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []); // Runs only once when the app starts

  const login = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setUser(null);
    sessionStorage.removeItem("user"); // Clear session on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
