// src/components/QuickAddExpense.jsx
import React, { useState } from "react";
import api from "../api/axios";
import { useAlert } from "./AlertBox";
import "../styles/components.css";

const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Housing",
    "Utilities",
    "Other",
];

const getToday = () => new Date().toISOString().substring(0, 10);

const QuickAddExpense = ({ open, onClose, onAdded }) => {
    const { showAlert } = useAlert();

    const [form, setForm] = useState({
        description: "",
        amount: "",
        category: "",
        date: getToday(),
    });

    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amount = Number(form.amount);
        if (!form.description.trim() || amount <= 0 || !form.category) {
            showAlert("Please enter valid expense details.", "error");
            return;
        }

        setLoading(true);

        try {
            await api.post("/expenses", {
                ...form,
                amount,
                month: form.date.substring(0, 7),
            });

            showAlert("Expense added!", "success");

            setForm({
                description: "",
                amount: "",
                category: "",
                date: getToday(),
            });

            if (onAdded) onAdded();
            onClose();
        } catch (err) {
            showAlert("Failed to add expense.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">

                <h2>Quick Add Expense</h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        disabled={loading}
                        min="0.01"
                        step="0.01"
                    />

                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickAddExpense;
