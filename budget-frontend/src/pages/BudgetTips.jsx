// src/pages/BudgetTips.jsx
import React, { useState, useEffect, useMemo } from "react";
import "../styles/pages.css";

const STORAGE_KEY = "budget_savings_goal";

// --- EXISTING TIPS ---
const TIPS = [
  "Build an emergency fund of 3–6 months' expenses before aggressive investing.",
  "Track small daily expenses — they add up. Try a 7-day spending audit.",
  "Automate savings: move a fixed amount to savings on payday.",
  "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt repayment.",
  "Round up every purchase to the next dollar and save the difference.",
  "Review subscriptions quarterly and cancel services you don't use.",
  "Set specific goals (e.g., 'Save ₹1,200 by June') instead of vague intentions.",
  "Prioritize high-interest debt — paying it down saves more in the long run.",
  "When eating out, set a monthly dining budget and track it.",
  "Compare prices and wait for sale windows before big purchases."
];

// --- NEW LIST OF 20–30 STATIC POPUP TIPS ---
const MORE_TIPS = [
  "Avoid late fees by enabling bill reminders.",
  "Negotiate your insurance premiums once a year.",
  "Use energy-efficient appliances to reduce electricity costs.",
  "Buy groceries with a list to avoid impulse purchases.",
  "Sell unused items online for extra income.",
  "Use public transportation a few days a week to save money.",
  "Compare mobile plans annually for better offers.",
  "Keep a 24-hour rule before buying anything non-essential.",
  "Avoid shopping when you're hungry — it increases spending.",
  "Plan meals weekly to prevent food waste.",
  "Use cash for discretionary spending to limit overspending.",
  "Unsubscribe from marketing emails to avoid buying temptations.",
  "Check for coupon codes before every online purchase.",
  "Borrow books instead of buying them.",
  "Use a budgeting app to track where your money goes.",
  "Drink more water instead of buying sugary drinks.",
  "Repair instead of replacing when possible.",
  "Cancel gym memberships if you're not using them.",
  "Use refillable bottles instead of disposable ones.",
  "Avoid extended warranties — they're usually not worth it.",
  "Wait for big sale seasons before buying electronics.",
  "Group errands to save fuel.",
  "Buy generic groceries instead of brand-name products.",
  "Attempt a “no-spend weekend” challenge monthly.",
  "Freeze leftovers to avoid buying takeout.",
  "Track subscriptions to avoid being charged unexpectedly.",
  "Use loyalty points for discounts or cashback.",
  "Set spending limits for online shopping platforms."
];

const pickTip = (seed) => {
  if (typeof seed === "string" && seed.length > 0) {
    const s = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return TIPS[s % TIPS.length];
  }
  return TIPS[Math.floor(Math.random() * TIPS.length)];
};

const BudgetTips = () => {

  const todaySeed = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  const [tipOfTheDay] = useState(() => pickTip(todaySeed));
  const [customTip, setCustomTip] = useState("");

  const [popupTip, setPopupTip] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleRandomTip = () => {
    setCustomTip(pickTip());

    const randomPopup = MORE_TIPS[Math.floor(Math.random() * MORE_TIPS.length)];
    setPopupTip(randomPopup);
    setShowPopup(true);
  };

  const handleCopyTip = (t) => {
    try {
      navigator.clipboard?.writeText(t);
      alert("Tip copied to clipboard!");
    } catch {
      prompt("Copy this tip:", t);
    }
  };

  const [goalAmount, setGoalAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [months, setMonths] = useState("12");
  const [progress, setProgress] = useState(0);
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setGoalAmount(saved.goalAmount || "");
      setSavedAmount(saved.savedAmount || "");
    }
  }, []);

  useEffect(() => {
    const goal = Number(goalAmount);
    const saved = Number(savedAmount);
    if (goal > 0) {
      setProgress(Math.min((saved / goal) * 100, 100));
    } else {
      setProgress(0);
    }
  }, [goalAmount, savedAmount]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const g = Number(goalAmount);
    const m = Math.max(1, Number(months) || 1);

    if (!g || g <= 0) {
      setCalcResult({ error: "Enter a valid goal amount greater than 0." });
      return;
    }

    setCalcResult({
      monthly: g / m,
      months: m
    });
  };

  const saveGoal = () =>
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ goalAmount, savedAmount })
    );

  return (
    <div className="container">
      <h1>Budget Tips</h1>

      <div className="grid grid-2" style={{ gap: "var(--spacing-lg)" }}>

        {/* LEFT SIDE ORIGINAL UI */}
        <div className="card">
          <h2>Tip of the Day</h2>
          <p>{tipOfTheDay}</p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={() => handleCopyTip(tipOfTheDay)}>
              Copy Tip
            </button>
            <button className="btn btn-secondary" onClick={handleRandomTip}>
              New Random Tip
            </button>
          </div>

          <hr />

          <h3>Quick Tips</h3>
          <ul>
            {TIPS.slice(0, 6).map((t, i) => (
              <li key={i}>
                {t}
                <button className="btn" style={{ marginLeft: "8px" }} onClick={() => handleCopyTip(t)}>
                  copy
                </button>
              </li>
            ))}
          </ul>

          {customTip && (
            <div style={{ marginTop: "12px", fontStyle: "italic" }}>
              <strong>Random Tip:</strong> {customTip}
            </div>
          )}
        </div>

        {/* RIGHT SIDE (Combined Calculator + Goal progress) */}
        <div className="card">
          <h2>Savings / Goal Calculator</h2>

          <form
            onSubmit={handleCalculate}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="form-group">
              <label>Goal Amount (₹)</label>
              <input type="number" placeholder="e.g., 1200"
                value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Amount Saved So Far (₹)</label>
              <input type="number" placeholder="e.g., 200"
                value={savedAmount} onChange={(e) => setSavedAmount(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Months to Save (approx)</label>
              <input type="number" placeholder="e.g., 12"
                value={months} onChange={(e) => setMonths(e.target.value)} />
            </div>

            <button className="btn btn-primary" type="submit">
              Calculate Monthly Amount
            </button>
          </form>

          {calcResult && (
            <div style={{ marginTop: "16px" }}>
              {calcResult.error ? (
                <p style={{ color: "red" }}>{calcResult.error}</p>
              ) : (
                <p>
                  Save <strong>₹{calcResult.monthly.toFixed(2)}</strong> per month for{" "}
                  <strong>{calcResult.months}</strong> months.
                </p>
              )}
            </div>
          )}

          <hr />

          <p><strong>{Math.round(progress)}%</strong> Achieved</p>
          <div className="budget-progress-bar">
            <div
              className="budget-progress progress-green"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button className="btn btn-secondary" style={{ marginTop: "16px" }} onClick={saveGoal}>
            Save Goal
          </button>
        </div>
      </div>

      {/* --- POPUP MODAL FOR MORE TIPS --- */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              width: "340px",
              borderRadius: "10px",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
          >

            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                fontSize: "20px",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              ×
            </button>

            <h3>Extra Tip</h3>
            <p style={{ marginTop: "12px" }}>{popupTip}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTips;
