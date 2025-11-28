// src/components/ExportCSV.jsx
import React from "react";

const ExportCSV = ({ expenses, month }) => {

    const downloadCSV = () => {
        if (!expenses || expenses.length === 0) {
            alert("No expenses available to export.");
            return;
        }

        // Convert expenses array → CSV text
        const headers = ["Date", "Description", "Category", "Amount"];
        const rows = expenses.map(exp => [
            exp.date,
            exp.description,
            exp.category,
            exp.amount
        ]);

        let csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map(e => e.join(",")).join("\n");

        const encoded = encodeURI(csvContent);
        const link = document.createElement("a");

        link.setAttribute(
            "download",
            `Expenses-${month}.csv`
        );
        link.setAttribute("href", encoded);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <button
            onClick={downloadCSV}
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
        >
            ⬇ Export CSV
        </button>
    );
};

export default ExportCSV;
