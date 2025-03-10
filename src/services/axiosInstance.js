import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Your API base URL
  withCredentials: true, // Ensures cookies are sent with requests
});

// Response Interceptor (Auto-handle unauthorized users)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized → Remove user from state & redirect to login
      localStorage.removeItem("user");
      window.location.href = "/signup";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
