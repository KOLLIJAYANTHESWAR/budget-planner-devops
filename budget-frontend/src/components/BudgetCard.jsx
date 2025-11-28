// src/components/BudgetCard.jsx
import React from 'react';
import '../styles/components.css';

const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',          // ← CHANGED FROM USD TO INR
        minimumFractionDigits: 0
    }).format(safeAmount);
};

const BudgetCard = ({ title, amount = 0, spentAmount = 0, variant }) => {
    const isSpent = variant === 'spent';
    const isRemaining = variant === 'remaining';

    const limit = isSpent || isRemaining ? null : amount;

    let progressBar = null;

    if (limit !== null) {
        const spent = Number(spentAmount) || 0;
        const percentage = limit > 0 ? (spent / limit) * 100 : 0;
        const barWidth = Math.min(percentage, 100);

        let progressClass = 'progress-green';
        if (percentage > 90) progressClass = 'progress-red';
        else if (percentage >= 75) progressClass = 'progress-orange';

        const remaining = limit - spent;
        const remainingText =
            remaining >= 0
                ? `${formatCurrency(remaining)} Remaining`
                : `${formatCurrency(Math.abs(remaining))} Overspent`;

        progressBar = (
            <div className="budget-progress-container">
                <p className="small-text">{Math.round(percentage)}% Used</p>

                <div className="budget-progress-bar">
                    <div
                        className={`budget-progress ${progressClass}`}
                        style={{ width: `${barWidth}%` }}
                    ></div>
                </div>

                <p
                    className="small-text"
                    style={{
                        marginTop: '5px',
                        fontWeight: '600',
                        color: remaining < 0 ? 'var(--color-danger)' : 'inherit',
                    }}
                >
                    {remainingText}
                </p>
            </div>
        );
    }

    let value = amount;

    if (isSpent) {
        value = amount;
    }

    if (isRemaining) {
        value = amount - spentAmount;
    }

    const isOverspent = isRemaining && value < 0;

    return (
        <div className="card budget-card">
            <div className="budget-info">
                <h3 style={{ color: isOverspent ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                    {title}
                </h3>

                <h1
                    style={{
                        color: isOverspent ? 'var(--color-danger)' : 'var(--color-text-primary)'
                    }}
                >
                    {formatCurrency(value)}
                </h1>
            </div>

            {progressBar}
        </div>
    );
};

export default BudgetCard;
