import axios from "axios";

// Environment variable or default
// Using local proxy to avoid CORS/Cookie issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
