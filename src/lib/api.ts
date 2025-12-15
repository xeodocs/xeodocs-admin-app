import axios from "axios";

const envApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!envApiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const API_URL = `${envApiUrl}/v1`;

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear local storage to prevent persistence of stale session
            if (typeof window !== "undefined") {
                localStorage.removeItem("xeodocs_user");

                // Redirect to login if unauthorized
                if (!window.location.pathname.startsWith("/login")) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);
