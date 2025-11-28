// src/pages/Budget.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAlert } from '../components/AlertBox';
import Loader from '../components/Loader';
import BudgetCard from '../components/BudgetCard';
import '../styles/pages.css';

const getCurrentMonth = () => new Date().toISOString().substring(0, 7);

const Budget = () => {
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [limitInput, setLimitInput] = useState('');
    const [currentBudget, setCurrentBudget] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [computedSpent, setComputedSpent] = useState(0);

    const { showAlert } = useAlert();

    const fetchBudget = useCallback(async (month) => {
        setLoading(true);

        try {
            let budgetRes = null;
            try {
                budgetRes = await api.get(`/budget/?month=${month}`);
            } catch (err) {
                if (err.response?.status === 404) {
                    budgetRes = null;
                } else {
                    throw err;
                }
            }

            const budgetData = budgetRes ? budgetRes.data : null;
            setCurrentBudget(budgetData);
            setLimitInput(String(budgetData?.limitAmount ?? ''));

            try {
                const expRes = await api.get(`/expenses?month=${month}`);
                const expArray = Array.isArray(expRes.data) ? expRes.data : [];
                const sum = expArray.reduce((acc, e) => acc + Number(e.amount || 0), 0);
                setComputedSpent(sum);
            } catch (err) {
                console.warn('Failed to fetch expenses for computed spent:', err);
                setComputedSpent(0);
            }

        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to load budget.';
            console.error('Budget fetch failed:', msg, error);
            showAlert(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchBudget(selectedMonth);
    }, [selectedMonth, fetchBudget]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleLimitChange = (e) => {
        setLimitInput(e.target.value);
    };

    const handleSetBudget = async (e) => {
        e.preventDefault();

        const limitAmount = parseFloat(limitInput);

        if (isNaN(limitAmount) || limitAmount <= 0) {
            showAlert('Please enter a valid budget amount greater than zero.', 'error');
            return;
        }

        setSubmitLoading(true);

        try {
            const res = await api.post(
                `/budget/?month=${selectedMonth}&limitAmount=${limitAmount}`
            );

            setCurrentBudget(res.data);

            showAlert(
                `Budget for ${selectedMonth} saved: ₹${limitAmount.toFixed(0)}`,
                'success'
            );

            try {
                const expRes = await api.get(`/expenses?month=${selectedMonth}`);
                const expArray = Array.isArray(expRes.data) ? expRes.data : [];
                const sum = expArray.reduce((acc, e) => acc + Number(e.amount || 0), 0);
                setComputedSpent(sum);
            } catch (err) {}
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                'Failed to set budget.';
            console.error('Set budget error:', msg, error);
            showAlert(msg, 'error');

        } finally {
            setSubmitLoading(false);
        }
    };

    const limitAmount = Number(currentBudget?.limitAmount) || 0;
    const backendSpent = Number(currentBudget?.spentAmount);
    const spentAmount = !isNaN(backendSpent) && backendSpent > 0 ? backendSpent : computedSpent;
    const remainingAmount = limitAmount - spentAmount;

    return (
        <div className="container budget-page">
            <h1>Budget Management</h1>

            <div className="budget-grid">

                <div className="card budget-setup-form">
                    <h2>Set / Update Monthly Budget</h2>

                    <form
                        onSubmit={handleSetBudget}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-md)',
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="month-select">Select Month</label>
                            <input
                                type="month"
                                id="month-select"
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                disabled={submitLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="limit-amount">Budget Limit (₹)</label>
                            <input
                                type="number"
                                id="limit-amount"
                                placeholder="e.g., 5000"
                                value={limitInput}
                                onChange={handleLimitChange}
                                min="1"
                                step="1"
                                required
                                disabled={submitLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitLoading || loading}
                        >
                            {submitLoading
                                ? 'Saving...'
                                : currentBudget
                                ? 'Update Budget'
                                : 'Set Budget'}
                        </button>
                    </form>
                </div>

                <div className="card budget-display">

                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <h2>Current Budget Status ({selectedMonth})</h2>

                            {currentBudget ? (
                                <BudgetCard
                                    title="Budget Overview"
                                    amount={limitAmount}
                                    spentAmount={spentAmount}
                                    variant="total"
                                />
                            ) : (
                                <p
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        marginTop: 'var(--spacing-md)',
                                    }}
                                >
                                    No budget set for this month. Use the form to add one.
                                </p>
                            )}

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: 'var(--spacing-xl)',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    Spent:{' '}
                                    <span style={{ color: 'var(--color-danger)' }}>
                                        ₹{Number(spentAmount || 0).toFixed(0)}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                    }}
                                >
                                    Remaining:{' '}
                                    <span
                                        style={{
                                            color:
                                                remainingAmount < 0
                                                    ? 'var(--color-danger)'
                                                    : 'var(--color-success)',
                                        }}
                                    >
                                        ₹{Number(remainingAmount || 0).toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
