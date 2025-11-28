// src/components/ExpenseCard.jsx
import React from 'react';
import '../styles/components.css';

const formatCurrency = (amount) => {
    const value = Number(amount);
    if (isNaN(value)) return "₹0";

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',       // ← changed from USD to INR
        minimumFractionDigits: 0,
    }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const ExpenseCard = ({ expense }) => {
    if (!expense) return null;

    const { description, category, date, amount } = expense;

    return (
        <div className="expense-card">
            <div className="expense-details">
                <span className="description">{description || "Untitled Expense"}</span>
                <span className="category">Category: {category || "N/A"}</span>
                <span className="date">Date: {formatDate(date)}</span>
            </div>

            <div className="expense-amount">
                {formatCurrency(amount)}
            </div>
        </div>
    );
};

export default ExpenseCard;
