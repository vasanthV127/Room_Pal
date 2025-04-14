import './ViewFinancialExpenses.css';

const ViewFinancialExpenses = () => {
  // Sample data for expenses
  const expenses = [
    { id: 1, name: 'Grocery Shopping', category: 'Daily', amount: 142.75 },
    { id: 2, name: 'Internet Bill', category: 'Monthly', amount: 89.99 },
    { id: 3, name: 'Electricity', category: 'Utilities', amount: 142.30 },
    { id: 4, name: 'Gas Bill', category: 'Utilities', amount: 65.45 },
    { id: 5, name: 'Phone Bill', category: 'Monthly', amount: 55.20 },
    { id: 6, name: 'Car Insurance', category: 'Insurance', amount: 120.75 }
  ];

  return (
    <div className="expenses-list">
      <h2>Financial Expenses</h2>
      {expenses.map(expense => (
        <div key={expense.id} className="expense-item">
          <div className="expense-icon"></div>
          <div className="expense-details">
            <div className="expense-name">{expense.name}</div>
            <div className="expense-category">{expense.category}</div>
          </div>
          <div className="expense-amount">${expense.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};

export default ViewFinancialExpenses;