// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/pages.css";

const Landing = () => {
    return (
        <div className="landing-wrapper">

            {/* =======================
                HERO SECTION
            ======================== */}
            <header className="landing-hero">
                <div className="landing-hero-content">
                    <h1 className="landing-title">Take Control of Your Money</h1>

                    <p className="landing-subtitle">
                        Budget Planner helps you track spending, set budgets, and reach your
                        savings goals — all in one fast and simple dashboard.
                    </p>

                    <div className="landing-buttons">
                        <Link to="/login" className="btn btn-primary landing-cta">
                            Get Started
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                            Create Account
                        </Link>
                    </div>

                    <p className="landing-small-text">
                        100% Free • No credit card required • Start in less than 10 seconds
                    </p>
                </div>
            </header>

            {/* =======================
                FEATURES SECTION
            ======================== */}
            <section className="landing-features">
                <h2 className="section-title">Powerful Features, Simple Experience</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">📊</span>
                        <h3>Smart Dashboard</h3>
                        <p>
                            Get instant insights with charts, summaries, and trend analysis.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">₹</span>  {/* CHANGED ONLY THIS */}
                        <h3>Budget Management</h3>
                        <p>
                            Set monthly limits and know exactly where your money goes.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">🧾</span>
                        <h3>Expense Tracking</h3>
                        <p>
                            Add, categorize, and review all expenses quickly & easily.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">🎯</span>
                        <h3>Goals & Tips</h3>
                        <p>
                            Set savings goals and learn proven ways to improve your finances.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">📅</span>
                        <h3>Monthly Insights</h3>
                        <p>
                            Understand your financial habits with clean monthly summaries.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-icon">⚡</span>
                        <h3>Fast & Simple</h3>
                        <p>
                            A clean, modern interface focused on speed and clarity.
                        </p>
                    </div>
                </div>
            </section>

            {/* =======================
                ABOUT / CTA SECTION
            ======================== */}
            <section className="landing-about">
                <h2 className="section-title">Plan Better. Spend Smarter. Grow Faster.</h2>

                <p className="about-text">
                    Building a healthy financial life starts with awareness. Budget Planner
                    gives you everything you need to organize your expenses, stay within budget,
                    and reach your long-term goals — without stress or complexity.
                </p>

                <Link to="/register" className="btn btn-primary about-btn">
                    Start Managing Your Money Today
                </Link>
            </section>

            {/* =======================
                FOOTER
            ======================== */}
            <footer className="landing-footer">
                <p>© {new Date().getFullYear()} BudgetPlanner — All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
