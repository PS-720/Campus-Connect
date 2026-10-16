import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap ApiResponse<T> data, handle 401
apiClient.interceptors.response.use(
  (response) => {
    // Spring returns { success, message, data, timestamp }
    // Unwrap to just return the payload
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and reload
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");
      window.location.href = "/";
    }
    // Expose the backend error message if present
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
