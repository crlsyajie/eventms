import axios from "axios";
import { getCSRFToken } from "./csrf";

const api = axios.create({
 baseURL: "http://localhost:8000/api", // Django backend
 // baseURL: "http://127.0.0.1:8000/api", // Django backend
  //baseURL: "http://192.168.1.49:8000/api", // Home 
  //baseURL: "http://192.168.21.73:8000/api", //BSU Wifi 
  //baseURL: "http://192.168.22.127:8000/api",
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
