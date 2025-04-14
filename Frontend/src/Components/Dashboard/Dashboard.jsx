import { useState } from 'react';
import './Dashboard.css';

// If you don't have lucide-react installed, you'll need to install it first
// npm install lucide-react
// Import icons from lucide-react
import {
  DollarSign,
  Wallet,
  MessageSquare,
  Upload,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  FileUp,
  MoreHorizontal,
  Home,
  Search
} from 'lucide-react';

const Dashboard = ({ activeView, setActiveView }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="back-button">
          <ChevronLeft size={16} />
        </div>
        <div className="search-bar">
          <Search className="search-icon" size={18} />
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
            <DollarSign size={18} />
          </div>
          <span>View Financial Expenses</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div 
          className={`menu-item ${activeView === 'finances' ? 'active' : ''}`}
          onClick={() => setActiveView('finances')}
        >
          <div className="menu-icon finances-icon">
            <Wallet size={18} />
          </div>
          <span>Manage Finances</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div 
          className={`menu-item ${activeView === 'forum' ? 'active' : ''}`}
          onClick={() => setActiveView('forum')}
        >
          <div className="menu-icon forum-icon">
            <MessageSquare size={18} />
          </div>
          <span>Access Finances Forum</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div 
          className={`menu-item ${activeView === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveView('upload')}
        >
          <div className="menu-icon upload-icon">
            <Upload size={18} />
          </div>
          <span>Upload Bills</span>
          <ChevronRight size={16} className="chevron" />
        </div>
        
        <div 
          className={`menu-item ${activeView === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveView('tasks')}
        >
          <div className="menu-icon tasks-icon">
            <CheckSquare size={18} />
          </div>
          <span>Manage Tasks</span>
          <ChevronRight size={16} className="chevron" />
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="footer-buttons">
          <div className="footer-icon">
            <FileUp size={18} />
          </div>
          <div className="footer-icon">
            <MoreHorizontal size={18} />
          </div>
          <div className="footer-icon">
            <Home size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;