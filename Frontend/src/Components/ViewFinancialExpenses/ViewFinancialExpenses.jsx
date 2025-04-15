import { useState, useEffect } from "react";
import axios from "axios";
import "./ViewFinancialExpenses.css";

const ViewFinancialExpenses = () => {
  const [personalExpenses, setPersonalExpenses] = useState([]);
  const [pendingDebts, setPendingDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const userId = localStorage.getItem("userId"); // e.g., "2" for Purushoth
  const roomId = 1; // Room ID 1 (Flat 101)

  const getCategory = (productName) => {
    const categories = {
      Coffee: "Daily",
      Snack: "Daily",
      Lunch: "Daily",
      Dinner: "Daily",
      Book: "Personal",
      Charger: "Personal",
      Movie: "Entertainment",
      Pizza: "Food",
      Groceries: "Household",
      Drinks: "Food",
      Rent: "Monthly",
      Utilities: "Utilities",
      Internet: "Monthly",
    };
    return categories[productName] || "Other";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch personal expenses
        const personalResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/personal?userId=${userId}&roomId=${roomId}`
        );
        setPersonalExpenses(personalResponse.data);

        // Fetch pending debts
        const debtsResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/debts-to-pay?userId=${userId}&roomId=${roomId}`
        );
        setPendingDebts(debtsResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load data: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError("Please log in to view expenses.");
      setLoading(false);
    }
  }, [userId]);

  // Pay debt
  const handlePayDebt = async (debtId) => {
    try {
      await axios.post("http://192.168.137.1:8080/api/debts/pay", { debtId });
      setPendingDebts(pendingDebts.filter((debt) => debt.id !== debtId));
      setSuccess("Debt paid successfully!");
      setError(null);
      // Notify other components
      window.dispatchEvent(new CustomEvent("debtPaid", { detail: { debtId, userId, roomId } }));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to pay debt: " + (err.response?.data?.message || err.message));
      setSuccess(null);
    }
  };

  if (loading) {
    return <div className="expenses-list">Loading...</div>;
  }

  if (error) {
    return <div className="expenses-list">{error}</div>;
  }

  return (
    <div className="expenses-list">
      <h2 id="ViewFinanceTitle" className="ps-md-4">
        Personal Expenses
      </h2>

      {personalExpenses.length === 0 ? (
        <p>No self-buy expenses found.</p>
      ) : (
        personalExpenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            <div className="expense-icon"></div>
            <div className="expense-details">
              <div className="expense-name">{expense.productName}</div>
              <div className="expense-category">
                {getCategory(expense.productName)} |{" "}
                {new Date(expense.date).toLocaleDateString()}
              </div>
            </div>
            <div className="expense-amount">
              ${(expense.rate * expense.quantity).toFixed(2)}
            </div>
          </div>
        ))
      )}

      <h2 id="ViewFinanceTitle" className="ps-md-4">
        Pending Fees
      </h2>

      {success && <div className="success">{success}</div>}
      {pendingDebts.length === 0 ? (
        <p>No pending fees found.</p>
      ) : (
        pendingDebts.map((debt) => (
          <div key={debt.id} className="debt-item">
            <div className="expense-icon"></div>
            <div className="expense-details">
              <div className="expense-name">{debt.productName}</div>
              <div className="expense-category">
                To: {debt.creditorUsername} |{" "}
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <div className="expense-amount">${debt.amount.toFixed(2)}</div>
            <button
              className="pay-button"
              onClick={() => handlePayDebt(debt.id)}
            >
              Pay
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewFinancialExpenses;