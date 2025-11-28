import axios from "axios";
import Cookies from "js-cookie";

// Base URL من env
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor: attach token from cookie
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `System ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Token expired or unauthorized
        Cookies.remove("accessToken", { path: "/" });
        // Redirect to login page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
