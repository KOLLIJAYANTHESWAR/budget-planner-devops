// src/context/AuthContext.jsx
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAlert } from '../components/AlertBox';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    // -----------------------------
    // FETCH PROFILE
    // -----------------------------
    const getProfile = useCallback(async () => {
        const token = localStorage.getItem('budget_app_token');

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await api.get('/users/profile');
            setUser(res.data);
        } catch (error) {
            console.error("Profile fetch failed:", error);

            // Clear token & user
            localStorage.removeItem('budget_app_token');
            setUser(null);

            showAlert("Session expired. Please log in again.", "error");
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate, showAlert]);

    // -----------------------------
    // INITIAL LOAD ON REFRESH
    // -----------------------------
    useEffect(() => {
        const token = localStorage.getItem('budget_app_token');

        if (token) {
            getProfile();
        } else {
            setUser(null);
            setLoading(false);
        }
        // getProfile is in deps
    }, [getProfile]);

    // -----------------------------
    // LOGIN
    // -----------------------------
    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });

            // If backend returns { token: '...' } adjust accordingly
            const token = res.data && typeof res.data === 'string' ? res.data : (res.data?.token || res.data);

            if (!token) throw new Error("No token received");

            localStorage.setItem('budget_app_token', token);

            // Fetch fresh profile
            await getProfile();

            showAlert("Login successful!", "success");
            navigate('/dashboard');
        } catch (error) {
            const msg = error.response?.data || "Invalid username or password.";
            showAlert(msg, "error");
            throw error;
        }
    };

    // -----------------------------
    // LOGOUT
    // -----------------------------
    const logout = (redirect = true) => {
        localStorage.removeItem('budget_app_token');
        setUser(null);

        if (redirect) {
            showAlert("Logged out successfully.", "success");
            navigate('/login');
        }
    };

    // -----------------------------
    // REGISTER
    // -----------------------------
    const register = async (username, email, password) => {
        try {
            await api.post('/auth/register', { username, email, password });

            showAlert("Registration successful! Please log in.", "success");
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data || "Registration failed.";
            showAlert(msg, "error");
            throw error;
        }
    };

    // -----------------------------
    // STATE
    // -----------------------------
    const isAuthenticated =
        Boolean(localStorage.getItem('budget_app_token')) && Boolean(user);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
                register,
                getProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
