// src/api/axios.js
import axios from 'axios';
console.log("🚀 API BASE URL:", import.meta.env.VITE_API_URL);
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000 // avoid infinite wait if backend hangs
});

// -----------------------------------------------------
// REQUEST INTERCEPTOR
// -----------------------------------------------------
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('budget_app_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// -----------------------------------------------------
// RESPONSE INTERCEPTOR
// -----------------------------------------------------
api.interceptors.response.use(
    (response) => response,

    (error) => {
        // Network/connection issue → backend offline
        if (!error.response) {
            return Promise.reject(new Error("Network error — backend offline or unreachable."));
        }

        const status = error.response.status;

        // Safely check URL
        const url = error?.config?.url || "";
        const isAuthEndpoint =
            url.includes('/auth/login') ||
            url.includes('/auth/register');

        // Global 401 → session expired
        if (status === 401 && !isAuthEndpoint) {
            localStorage.removeItem('budget_app_token');

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }

            return Promise.reject(new Error("Session expired. Please log in again."));
        }

        return Promise.reject(error);
    }
);

export default api;
