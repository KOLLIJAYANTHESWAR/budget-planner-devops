// src/pages/Expenses.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAlert } from '../components/AlertBox';
import Loader from '../components/Loader';
import ExpenseForm from '../components/ExpenseForm';
// import MonthlyNotes from "../components/MonthlyNotes";   // ❌ REMOVED
import ExpenseCalendar from "../components/ExpenseCalendar"; // Calendar View
import ExportCSV from "../components/ExportCSV";   // CSV Export
import '../styles/pages.css';

const getCurrentMonth = () => new Date().toISOString().substring(0, 7);

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
        ? "Invalid date"
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',          // ← CHANGED FROM USD TO INR
        minimumFractionDigits: 0
    }).format(Number(amount) || 0);

const Expenses = () => {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    const fetchExpensesAndBudget = useCallback(
        async (month) => {
            setLoading(true);

            try {
                let expenseList = [];
                try {
                    const expensesRes = await api.get(`/expenses?month=${month}`);
                    expenseList = Array.isArray(expensesRes.data)
                        ? expensesRes.data
                        : [];
                } catch {
                    expenseList = [];
                }
                setExpenses(expenseList);

                let budgetData = null;
                try {
                    const budgetRes = await api.get(`/budget/?month=${month}`);
                    budgetData = typeof budgetRes.data === "string"
                        ? { limitAmount: 0, spentAmount: 0, month }
                        : budgetRes.data;
                } catch (err) {
                    if (err.response?.status === 404) {
                        budgetData = { limitAmount: 0, spentAmount: 0, month };
                    } else {
                        throw err;
                    }
                }
                setBudget(budgetData);

            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.response ||
                    "Failed to load expenses.";
                showAlert(message, "error");
            } finally {
                setLoading(false);
            }
        },
        [showAlert]
    );

    useEffect(() => {
        fetchExpensesAndBudget(selectedMonth);
    }, [selectedMonth, fetchExpensesAndBudget]);

    const handleMonthChange = (e) => setSelectedMonth(e.target.value);
    const handleExpenseAdded = () => fetchExpensesAndBudget(selectedMonth);

    const totalExpenses = expenses.length;
    const totalSpent = expenses.reduce(
        (sum, exp) => sum + (Number(exp.amount) || 0),
        0
    );

    const limitAmount = Number(budget?.limitAmount) || 0;
    const spentPercentage = limitAmount > 0
        ? (totalSpent / limitAmount) * 100
        : 0;

    let warningMessage = null;
    let warningClass = "";

    if (limitAmount === 0) {
        warningMessage = "No budget set for this month.";
        warningClass = "alert-warning";
    } else if (spentPercentage > 100) {
        warningMessage = `Exceeded Budget! Overspent by ${formatCurrency(totalSpent - limitAmount)}.`;
        warningClass = "alert-error";
    } else if (spentPercentage >= 90) {
        warningMessage = `Warning: 90% Budget Used. Remaining: ${formatCurrency(limitAmount - totalSpent)}.`;
        warningClass = "alert-error";
    } else if (spentPercentage >= 75) {
        warningMessage = "75% of your budget is already used. Spend carefully!";
        warningClass = "alert-warning";
    }

    return (
        <div className="container expenses-page">
            <h1>Expense Tracker</h1>

            <div className="grid grid-2-1">

                <div>
                    <ExpenseForm onExpenseAdded={handleExpenseAdded} />

                    <ExpenseCalendar
                        month={selectedMonth}
                        expenses={expenses}
                    />
                </div>

                <div className="card">

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <h2>
                            {new Date(selectedMonth + "-01").toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "long" }
                            )}{" "}
                            Expenses
                        </h2>

                        <ExportCSV expenses={expenses} month={selectedMonth} />
                    </div>

                    <div className="form-group month-filter">
                        <label htmlFor="expense-month-filter">Filter Month</label>
                        <input
                            type="month"
                            id="expense-month-filter"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            disabled={loading}
                        />
                    </div>

                    {warningMessage && (
                        <div className={`alert-box ${warningClass}`}>
                            <span>
                                {warningClass === "alert-error" ? "🛑" : "⚠️"}
                            </span>
                            {warningMessage}
                        </div>
                    )}

                    <div className="expense-summary">
                        <div className="summary-item">
                            <strong>Total Expenses:</strong> {totalExpenses}
                        </div>
                        <div className="summary-item">
                            <strong>Amount Spent:</strong>{" "}
                            <span style={{ color: "var(--color-danger)" }}>
                                {formatCurrency(totalSpent)}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : expenses.length === 0 ? (
                        <p
                            style={{
                                textAlign: "center",
                                padding: "var(--spacing-xl)",
                                color: "var(--color-text-secondary)"
                            }}
                        >
                            No expenses recorded for {selectedMonth}.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="expense-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp) => (
                                        <tr key={exp.id}>
                                            <td>{formatDate(exp.date)}</td>
                                            <td>{exp.description}</td>
                                            <td>{exp.category}</td>
                                            <td>{formatCurrency(exp.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
