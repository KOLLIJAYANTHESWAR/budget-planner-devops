// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/AlertBox';
import Loader from '../components/Loader';
import BudgetCard from '../components/BudgetCard';
import ExpenseCard from '../components/ExpenseCard';
import QuickAddExpense from "../components/QuickAddExpense";   // << ADDED
import api from '../api/axios';
import '../styles/pages.css';


import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';

const getCurrentMonth = () => new Date().toISOString().substring(0, 7);

const Dashboard = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [openQuickAdd, setOpenQuickAdd] = useState(false);  // << ADDED

    const currentMonth = getCurrentMonth();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let budgetData;

            try {
                const res = await api.get(`/budget/?month=${currentMonth}`);
                budgetData = res?.data;

                if (!budgetData || typeof budgetData === 'string') {
                    budgetData = { limitAmount: 0, spentAmount: 0, month: currentMonth };
                }
            } catch {
                budgetData = { limitAmount: 0, spentAmount: 0, month: currentMonth };
            }

            setBudget(budgetData);

            let expData = [];
            try {
                const expRes = await api.get(`/expenses?month=${currentMonth}`);
                expData = Array.isArray(expRes?.data) ? expRes.data : [];
            } catch {
                expData = [];
            }

            setExpenses(expData);

        } catch (error) {
            console.error("Dashboard fetch failed:", error);
            showAlert("Failed to load dashboard data.", "error");
        } finally {
            setLoading(false);
        }
    }, [currentMonth, showAlert]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <Loader />;

    const limitAmount = Number(budget?.limitAmount) || 0;
    const backendSpent = Number(budget?.spentAmount) || 0;
    const calculatedSpent = expenses.reduce((sum, exp) => sum + Number(exp?.amount || 0), 0);

    const spentAmount = backendSpent > 0 ? backendSpent : calculatedSpent;
    const remainingAmount = limitAmount - spentAmount;

    const categoryMap = expenses.reduce((acc, exp) => {
        const category = exp?.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + Number(exp?.amount || 0);
        return acc;
    }, {});

    const pieData = Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .filter(d => Number(d.value) > 0)
        .sort((a, b) => b.value - a.value);

    const COLORS = [
        '#1e3a8a',
        '#3b82f6',
        '#93c5fd',
        '#34d399',
        '#fcd34d',
        '#f87171'
    ];

    const expenseTrendMap = expenses.reduce((acc, exp) => {
        const key = exp?.date || 'unknown';
        acc[key] = (acc[key] || 0) + Number(exp?.amount || 0);
        return acc;
    }, {});

    const lineData = Object.keys(expenseTrendMap)
        .filter(k => k !== 'unknown')
        .sort()
        .map(date => ({ date, amount: expenseTrendMap[date] }));

    const recentExpenses = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    return (
        <div className="container dashboard-page">

            {/* Header + Add Button */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px"
            }}>
                <h1>Welcome, {user?.username || "User"}!</h1>

                {/* Blue + Add button */}
                <button
                    className="btn btn-primary"
                    style={{
                        padding: "10px 18px",
                        fontSize: "16px",
                        fontWeight: "600",
                        borderRadius: "8px"
                    }}
                    onClick={() => setOpenQuickAdd(true)}
                >
                    + Add
                </button>
            </div>

            {/* Quick Add Modal */}
            <QuickAddExpense
                open={openQuickAdd}
                onClose={() => setOpenQuickAdd(false)}
            />

            {/* MONTH SUMMARY */}
            <div
                className="card"
                style={{
                    marginBottom: "var(--spacing-xl)",
                    backgroundColor:
                        remainingAmount < 0
                            ? "#fee2e2"
                            : limitAmount > 0 && spentAmount / Math.max(limitAmount, 1) >= 0.9
                                ? "#fef3c7"
                                : "inherit",
                }}
            >
                <h3
                    style={{
                        color:
                            remainingAmount < 0
                                ? "var(--color-danger)"
                                : "var(--color-primary)",
                    }}
                >
                    {limitAmount === 0 && "No Budget Set for this month."}
                    {limitAmount > 0 && remainingAmount < 0 && "🛑 Budget Exceeded!"}
                    {limitAmount > 0 &&
                        remainingAmount >= 0 &&
                        spentAmount / Math.max(limitAmount, 1) >= 0.9 &&
                        "⚠️ Warning: Approaching your budget limit."}
                    {limitAmount > 0 &&
                        spentAmount / Math.max(limitAmount, 1) < 0.75 &&
                        "✅ You are on track."}
                </h3>

                <p style={{ marginTop: "5px" }}>
                    Month:{" "}
                    {new Date(currentMonth + "-01").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                    })}
                </p>
            </div>

            {/* BUDGET CARDS */}
            <div className="grid grid-3">
                <BudgetCard
                    title="Total Budget"
                    amount={limitAmount}
                    spentAmount={spentAmount}
                    variant="total"
                />

                <BudgetCard
                    title="Spent Amount"
                    amount={spentAmount}
                    spentAmount={spentAmount}
                    variant="spent"
                />

                <BudgetCard
                    title="Remaining"
                    amount={limitAmount}
                    spentAmount={spentAmount}
                    variant="remaining"
                />
            </div>

            {/* GRAPHS + RECENT */}
            <div className="grid grid-2" style={{ marginTop: 'var(--spacing-xl)' }}>

                {/* PIE CHART */}
                <div className="card">
                    <div className="card-header">
                        <h2>Expenses by Category</h2>
                    </div>

                    <div className="chart-container">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={false}
                                        labelLine={false}
                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {pieData.map((entry, index) => {
                                            const isActive = index === activeIndex;

                                            return (
                                                <Cell
                                                    key={index}
                                                    fill={COLORS[index % COLORS.length]}
                                                    style={{
                                                        opacity: activeIndex === null 
                                                            ? 1                   // ✅ Normal when not hovering
                                                            : isActive 
                                                                ? 1               // ✅ Hovered slice stays normal
                                                                : 0.4,            // ✅ Others fade
                                                        transition: "opacity 0.25s ease"
                                                    }}
                                                />
                                            );
                                        })}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted">No category data yet.</p>
                        )}
                    </div>
                </div>

                {/* LINE CHART */}
                <div className="card">
                    <div className="card-header">
                        <h2>Expense Trend</h2>
                    </div>

                    <div className="chart-container">
                        {lineData.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#1e3a8a"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted">
                                Add at least two days of expenses to show a trend.
                            </p>
                        )}
                    </div>
                </div>

                {/* RECENT EXPENSES */}
                <div className="card">
                    <div className="card-header">
                        <h2>Recent Expenses</h2>
                    </div>

                    <div className="recent-expenses">
                        {recentExpenses.length > 0 ? (
                            recentExpenses.map((exp) => (
                                <ExpenseCard key={exp.id} expense={exp} />
                            ))
                        ) : (
                            <p className="text-muted">No expenses recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
