// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './components/AlertBox';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';


// Pages
import Landing from "./pages/Landing";
import BudgetTips from "./pages/BudgetTips";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Expenses from './pages/Expenses';

import Profile from './pages/Profile';

// Global Styles
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
    return (
        <Router>
            <AlertProvider>
                <AuthProvider>
                    <Navbar />

                    <main style={{ flexGrow: 1, paddingBottom: 'var(--spacing-xl)' }}>
                        <Routes>

                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/budget"
                                element={
                                    <ProtectedRoute>
                                        <Budget />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/expenses"
                                element={
                                    <ProtectedRoute>
                                        <Expenses />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />


                            <Route
                                path="/budget-tips"
                                element={
                                    <ProtectedRoute>
                                        <BudgetTips />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>

                </AuthProvider>
            </AlertProvider>
        </Router>
    );
}

export default App;
