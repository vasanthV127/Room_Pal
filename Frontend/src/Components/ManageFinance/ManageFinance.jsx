import './ManageFinance.css';

const ManageFinance = () => {
  return (
    <div className="manage-finances">
      <h2>Manage Finances</h2>
      <div className="finance-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount">$615.44</p>
          <p className="period">This Month</p>
        </div>
        <div className="summary-card">
          <h3>Budget Remaining</h3>
          <p className="amount">$1,384.56</p>
          <p className="period">This Month</p>
        </div>
        <div className="summary-card">
          <h3>Savings</h3>
          <p className="amount">$350.00</p>
          <p className="period">This Month</p>
        </div>
      </div>
      <div className="budget-categories">
        <h3>Budget Categories</h3>
        <div className="category-bar">
          <div className="category-name">Housing</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '80%' }}></div>
          </div>
          <div className="category-amount">$1,200/$1,500</div>
        </div>
        <div className="category-bar">
          <div className="category-name">Food</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '60%' }}></div>
          </div>
          <div className="category-amount">$300/$500</div>
        </div>
        <div className="category-bar">
          <div className="category-name">Utilities</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: '45%' }}></div>
          </div>
          <div className="category-amount">$135/$300</div>
        </div>
      </div>
    </div>
  );
};

export default ManageFinance;