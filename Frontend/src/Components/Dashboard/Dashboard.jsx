// JSX Component
import React, { useState } from 'react';
import './Dashboard.css';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ForumIcon from '@mui/icons-material/Forum';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


const FinancialDashboard = () => {
  const [activeView, setActiveView] = useState('expenses');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for different sections
  const expenses = [
    { id: 1, name: 'Grocery Shopping', category: 'Daily', amount: 142.75 },
    { id: 2, name: 'Internet Bill', category: 'Monthly', amount: 89.99 },
    { id: 3, name: 'Electricity', category: 'Utilities', amount: 142.30 },
    { id: 4, name: 'Gas Bill', category: 'Utilities', amount: 65.45 },
    { id: 5, name: 'Phone Bill', category: 'Monthly', amount: 55.20 },
    { id: 6, name: 'Car Insurance', category: 'Insurance', amount: 120.75 }
  ];

  const tasks = [
    { id: 1, name: 'Pay credit card bill', dueDate: '2025-04-20' },
    { id: 2, name: 'Review monthly budget', dueDate: '2025-04-25' },
    { id: 3, name: 'File tax documents', dueDate: '2025-04-30' }
  ];

  const forumPosts = [
    { id: 1, author: 'Emily Parker', content: 'What strategies do you use for emergency fund planning?', replies: 12 },
    { id: 2, author: 'Marcus Johnson', content: 'Has anyone tried the 50/30/20 budget rule?', replies: 8 }
  ];

  const bills = [
    { id: 1, name: 'Rent Payment', amount: 1200, dueDate: '2025-05-01' },
    { id: 2, name: 'Water Bill', amount: 45.75, dueDate: '2025-04-28' },
    { id: 3, name: 'Netflix Subscription', amount: 14.99, dueDate: '2025-04-22' }
  ];

  // Render the main content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'expenses':
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
      case 'finances':
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
      case 'forum':
        return (
          <div className="finances-forum">
            <h2>Finances Forum</h2>
            <div className="forum-container">
              {forumPosts.map(post => (
                <div key={post.id} className="forum-post">
                  <div className="post-author">{post.author}</div>
                  <div className="post-content">{post.content}</div>
                  <div className="post-stats">
                    <span>{post.replies} replies</span>
                    <button className="reply-btn">Reply</button>
                  </div>
                </div>
              ))}
              <div className="new-post">
                <textarea placeholder="Share your financial insights or questions..."></textarea>
                <button className="post-btn">Post</button>
              </div>
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className="upload-bills">
            <h2>Upload Bills</h2>
            <div className="upload-container">
              <div className="upload-area">
                <div className="upload-icon"></div>
                <p>Drag and drop files here or click to upload</p>
                <button className="browse-btn">Browse Files</button>
              </div>
              <h3>Recent Uploads</h3>
              <div className="recent-uploads">
                {bills.map(bill => (
                  <div key={bill.id} className="bill-item">
                    <div className="bill-icon"></div>
                    <div className="bill-details">
                      <div className="bill-name">{bill.name}</div>
                      <div className="bill-amount">${bill.amount.toFixed(2)} | Due: {bill.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="manage-tasks">
            <h2>Manage Tasks</h2>
            <div className="tasks-container">
              <div className="add-task">
                <input type="text" placeholder="Add a new financial task..." />
                <button className="add-btn">Add</button>
              </div>
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <input type="checkbox" id={`task-${task.id}`} />
                    <label htmlFor={`task-${task.id}`}>{task.name}</label>
                    <div className="task-due">Due: {task.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="back-button">
            <span>←</span>
          </div>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="menu-title">
          Finance Dashboard
        </div>
        
        <nav className="sidebar-menu">
          <div 
            className={`menu-item ${activeView === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveView('expenses')}
          >
            <div className="menu-icon expense-icon">
            <BarChartIcon style={{ color: 'white' }} />
          </div>
          <span>View Financial Expenses</span>
          <span className="chevron">→</span>
        </div>
          
          <div 
            className={`menu-item ${activeView === 'finances' ? 'active' : ''}`}
            onClick={() => setActiveView('finances')}
          >
            <div className="menu-icon finances-icon">
            <AccountBalanceWalletIcon style={{ color: 'white' }} />
          </div>
          <span>Manage Finances</span>
          <span className="chevron">→</span>
        </div>
          
          <div 
            className={`menu-item ${activeView === 'forum' ? 'active' : ''}`}
            onClick={() => setActiveView('forum')}
          >
            <div className="menu-icon forum-icon">
            <ForumIcon style={{ color: 'white' }} />
          </div>
          <span>Access Finances Forum</span>
          <span className="chevron">→</span>
        </div>

          <div 
            className={`menu-item ${activeView === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveView('upload')}
          >
            <div className="menu-icon upload-icon"> <ReceiptLongIcon style={{ color: 'white' }} /></div>
            
            <pre>  Upload Bills</pre>
            <span className="chevron">→</span>
          </div>
          
          <div 
            className={`menu-item ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <div className="menu-icon tasks-icon"><TaskAltIcon style={{ color: 'white' }} /></div>
            <span>Manage Tasks</span>
            <span className="chevron">→</span>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="footer-buttons">
            <div className="footer-icon upload"></div>
            <div className="footer-icon more"></div>
            <div className="footer-icon home"></div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;