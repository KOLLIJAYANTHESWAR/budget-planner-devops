// src/context/AlertContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [timer, setTimer] = useState(null);

    const showAlert = useCallback((message, type = "success", duration = 4000) => {
        if (timer) clearTimeout(timer);

        setAlert({ message, type });

        const newTimer = setTimeout(() => {
            setAlert({ message: "", type: "" });
        }, duration);

        setTimer(newTimer);
    }, [timer]);

    const value = useMemo(() => ({ showAlert }), [showAlert]);

    return (
        <AlertContext.Provider value={value}>
            {alert.message && (
                <div className={`alert-box alert-${alert.type}`}>
                    <span>{alert.type === "error" ? "❌" : "✅"}</span>
                    {alert.message}
                </div>
            )}
            {children}
        </AlertContext.Provider>
    );
};
