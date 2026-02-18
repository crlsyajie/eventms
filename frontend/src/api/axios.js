import axios from "axios";
import { getCSRFToken } from "./csrf";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend
  withCredentials: true,
});

// Add CSRF token to requests
api.interceptors.request.use(
  (config) => {
    const token = getCSRFToken();
    if (token) {
      config.headers['X-CSRFToken'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
