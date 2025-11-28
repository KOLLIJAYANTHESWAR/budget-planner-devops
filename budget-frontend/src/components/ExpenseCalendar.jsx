// src/components/ExpenseCalendar.jsx
import React, { useMemo } from "react";
import "../styles/components.css";

/**
 * Calendar View (frontend only)
 * - Displays monthly expenses inside a simple calendar grid
 * - No backend calls (uses the expenses already passed as props)
 */

const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

const ExpenseCalendar = ({ month, expenses }) => {
    const [year, monthIndex] = month.split("-").map(Number);
    const firstDay = new Date(year, monthIndex - 1, 1).getDay();
    const daysInMonth = getDaysInMonth(year, monthIndex - 1);

    // Map: date → total spent on that day
    const expenseByDay = useMemo(() => {
        const map = {};
        expenses.forEach((exp) => {
            const day = new Date(exp.date).getDate();
            const amt = Number(exp.amount) || 0;
            map[day] = (map[day] || 0) + amt;
        });
        return map;
    }, [expenses]);

    const totalCells = firstDay + daysInMonth;
    const rows = Math.ceil(totalCells / 7);

    return (
        <div className="card">
            <h2>Calendar View</h2>

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="calendar-header">{d}</div>
                ))}

                {/* Empty slots before the first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={"e" + i} className="calendar-cell empty"></div>
                ))}

                {/* Actual days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const spent = expenseByDay[day];

                    return (
                        <div key={day} className="calendar-cell">
                            <span className="calendar-day">{day}</span>

                            {spent ? (
                                <span className="calendar-expense">
                                    ₹{spent.toFixed(0)}
                                </span>
                            ) : (
                                <span className="calendar-no-expense">—</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExpenseCalendar;
