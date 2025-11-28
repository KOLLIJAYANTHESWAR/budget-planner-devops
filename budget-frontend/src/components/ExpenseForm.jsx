// src/components/ExpenseForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useAlert } from './AlertBox';
import '../styles/components.css';

const getCurrentDate = () => new Date().toISOString().substring(0, 10);
const getCurrentMonth = () => new Date().toISOString().substring(0, 7);

const ExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        month: getCurrentMonth(),
        description: '',
        amount: '',
        category: '',
        date: getCurrentDate(),
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { showAlert } = useAlert();

    const categories = [
        'Food',
        'Transport',
        'Entertainment',
        'Housing',
        'Utilities',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'date' ? { month: value.substring(0, 7) } : {})
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required.';
        }

        const amount = parseFloat(formData.amount);
        if (!amount || amount <= 0) {
            newErrors.amount = 'Valid amount is required.';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required.';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                month: formData.date.substring(0, 7)
            };

            await api.post('/expenses', payload);

            showAlert('Expense added successfully!', 'success');

            setFormData({
                month: getCurrentMonth(),
                description: '',
                amount: '',
                category: '',
                date: getCurrentDate(),
            });

            if (onExpenseAdded) onExpenseAdded();

        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data ||
                'Failed to add expense.';

            showAlert(backendMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card expense-form">
            <h2>Add New Expense</h2>

            <form onSubmit={handleSubmit}>
                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Enter description"
                    />
                    {errors.description && <p className="error-text">{errors.description}</p>}
                </div>

                {/* Amount */}
                <div className="form-group">
                    <label htmlFor="amount">Amount (₹)</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        disabled={loading}
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                    />
                    {errors.amount && <p className="error-text">{errors.amount}</p>}
                </div>

                {/* Category */}
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="error-text">{errors.category}</p>}
                </div>

                {/* Date */}
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    {errors.date && <p className="error-text">{errors.date}</p>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding…' : 'Add Expense'}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
