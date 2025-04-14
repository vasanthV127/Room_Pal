import { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ activeView, setActiveView }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
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
          <div className="menu-icon expense-icon"></div>
          <span>View Financial Expenses</span>
          <span className="chevron">→</span>
        </div>
        
        <div 
          className={`menu-item ${activeView === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveView('finances')}
        >
          <div className="menu-icon finances-icon"></div>
          <span>Manage Finances</span>
          <span className="chevron">→</span>
        </div>
        
        <div 
          className={`menu-item ${activeView === 'forum' ? 'active' : ''}`}
          onClick={() => setActiveView('forum')}
        >
          <div className="menu-icon forum-icon"></div>
          <span>Access Finances Forum</span>
          <span className="chevron">→</span>
        </div>
        
        <div 
          className={`menu-item ${activeView === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveView('upload')}
        >
          <div className="menu-icon upload-icon"></div>
          <span>Upload Bills</span>
          <span className="chevron">→</span>
        </div>
        
        <div 
          className={`menu-item ${activeView === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveView('tasks')}
        >
          <div className="menu-icon tasks-icon"></div>
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
  );
};

export default Dashboard;