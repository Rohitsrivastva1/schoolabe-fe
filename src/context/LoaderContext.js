// src/context/LoaderContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { setupInterceptors } from "../api/axiosInstance"; // Import axios interceptors

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof setLoading === "function") {
      setupInterceptors(setLoading); // ✅ Pass setLoading properly AFTER it's available
    }
  }, []); // ✅ Runs only once when the provider is initialized

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
