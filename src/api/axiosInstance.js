// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "", // Proxy will redirect this to localhost:5000
  withCredentials: true, // Required for httpOnly cookie auth
});

export const setupInterceptors = (setLoading) => {
  let requestCount = 0;

  if (typeof setLoading !== "function") {
    console.error("🚨 setupInterceptors was called without a valid setLoading function!");
    return; // Exit early to prevent errors
  }

  const showLoader = () => {
    requestCount++;
    setLoading(true);
  };

  const hideLoader = () => {
    requestCount--;
    if (requestCount <= 0) {
      requestCount = 0; // Prevent going negative
      setLoading(false);
    }
  };

  axiosInstance.interceptors.request.use(
    (config) => {
      showLoader();
      return config;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      hideLoader();
      return response;
    },
    (error) => {
      hideLoader();
      return Promise.reject(error);
    }
  );

  console.log("✅ Interceptors setup complete");
};

export default axiosInstance;
