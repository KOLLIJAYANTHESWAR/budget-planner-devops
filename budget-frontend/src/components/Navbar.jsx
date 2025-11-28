// src/components/Navbar.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components.css';

import QuickAddExpense from "./QuickAddExpense"; // <== ADDED

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const [theme, setTheme] = useState("light");

    const [openQuickAdd, setOpenQuickAdd] = useState(false); // <== ADDED

    // Load saved theme
    useEffect(() => {
        const saved = localStorage.getItem("theme") || "light";
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Logout handler
    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    if (!isAuthenticated) return null;

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">

                    {/* Brand */}
                    <NavLink to="/dashboard" className="navbar-logo">
                        BudgetPlanner
                    </NavLink>

                    <div className="navbar-links">

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/budget"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Budget
                        </NavLink>

                        <NavLink
                            to="/expenses"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Expenses
                        </NavLink>

                        <NavLink
                            to="/budget-tips"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Goals
                        </NavLink>
                        
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            Profile
                        </NavLink>

                        

                        {/* 🌙 Theme Toggle */}
                        {/*<button
                            onClick={toggleTheme}
                            className="btn btn-secondary theme-toggle-btn"
                            aria-label="Toggle Theme"
                            style={{ marginRight: "10px" }}
                        >
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>
                        */}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Quick Add Expense Modal */}
            <QuickAddExpense
                open={openQuickAdd}
                onClose={() => setOpenQuickAdd(false)}
            />
        </>
    );
};

export default Navbar;
