// src/components/AlertBox.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import '../styles/components.css'; // Import alert styles

const AlertContext = createContext();

// Hook to use the alert system
export const useAlert = () => {
    return useContext(AlertContext);
};

// Component to display the alert
export const AlertBox = ({ message, type }) => {
    if (!message) return null;

    const icon = type === 'success' ? '✅' : '❌'; 
    const className = type === 'success' ? 'alert-success' : 'alert-error';

    return (
        <div className={`alert-box ${className}`} role="alert">
            <span role="img" aria-label={type}>{icon}</span>
            {message}
        </div>
    );
};

// Provider to manage alert state
export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [timeoutId, setTimeoutId] = useState(null);

    const showAlert = useCallback((message, type, duration = 4000) => {
        if (timeoutId) clearTimeout(timeoutId);

        setAlert({ message, type });

        const id = setTimeout(() => {
            setAlert({ message: '', type: '' });
        }, duration);

        setTimeoutId(id);
    }, [timeoutId]);

    const contextValue = useMemo(() => ({
        showAlert,
    }), [showAlert]);

    return (
        <AlertContext.Provider value={contextValue}>
            {alert.message && <AlertBox message={alert.message} type={alert.type} />}
            {children}
        </AlertContext.Provider>
    );
};
