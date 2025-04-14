import { useState, useEffect } from "react";
import axios from "axios";
import "./ViewFinancialExpenses.css";

const ViewFinancialExpenses = () => {
  const [personalExpenses, setPersonalExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = 2 // e.g., "2" for Purushoth
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
        // Fetch personal expenses only
        const personalResponse = await axios.get(
          `http://192.168.137.1:8080/api/expenses/personal?userId=${userId}&roomId=${roomId}`
        );
        setPersonalExpenses(personalResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load expenses. Please try again.");
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

  if (loading) {
    return <div className="expenses-list">Loading...</div>;
  }

  if (error) {
    return <div className="expenses-list">{error}</div>;
  }

  return (
    <div className="expenses-list">
      <h2 id="ViewFinanceTitle"> Personal Expenses</h2>

      {/* Personal Expenses */}
      
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
    </div>
  );
};

export default ViewFinancialExpenses;