// src/pages/Register.jsx
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/AlertBox';
import '../styles/pages.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register, isAuthenticated } = useAuth();
    const { showAlert } = useAlert();

    // Redirect logged-in users
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value.trimStart(), // Prevent leading spaces
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Validate form data
    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required.';
        }

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email.';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await register(
                formData.username.trim(),
                formData.email.trim(),
                formData.password
            );
            // Redirect handled in AuthContext
        } catch (error) {
            // AuthContext already handles errors + alerts
        } finally {
            setLoading(false);
        }
    };

    // Render individual field errors
    const renderError = (field) =>
        errors[field] && (
            <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', marginTop: '5px' }}>
                {errors[field]}
            </p>
        );

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <h2>Create Your Account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                            autoComplete="off"
                        />
                        {renderError('username')}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            autoComplete="off"
                        />
                        {renderError('email')}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 chars)"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {renderError('password')}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {renderError('confirmPassword')}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
