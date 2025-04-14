import ViewFinancialExpenses from "../ViewFinancialExpenses/ViewFinancialExpenses";
import ManageFinance from "../ManageFinance/ManageFinance";
import AccessCommunityForum from "../AccessComunityForum/AccessComunityForum";
import UploadBills from "../UploadBills/UploadBills";
import ManageTasks from "../ManageTasks/ManageTasks";

import { useState, useEffect } from "react";
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
  Search,
  Menu,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = ({ activeView, setActiveView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);

      // Auto-open sidebar on desktop
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Toggle Button - visible on mobile only */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {isMobile && (
            <div className="back-button" onClick={toggleSidebar}>
              <ChevronLeft size={16} />
            </div>
          )}
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form-control-sm"
            />
          </div>
        </div>

        <div className="menu-title">Finance Dashboard</div>

        <nav className="sidebar-menu">
          <div
            className={`menu-item ${activeView === "expenses" ? "active" : ""}`}
            onClick={() => {
              setActiveView("expenses");
              if (isMobile) toggleSidebar();
            }}
          >
            <div className="menu-icon expense-icon">
              <DollarSign size={18} />
            </div>
            <span id="dbSideIcon-1">View Financial Expenses</span>
            <ChevronRight size={16} className="chevron" />
          </div>

          <div
            className={`menu-item ${activeView === "finances" ? "active" : ""}`}
            onClick={() => {
              setActiveView("finances");
              if (isMobile) toggleSidebar();
            }}
          >
            <div className="menu-icon finances-icon">
              <Wallet size={18} />
            </div>
            <span id="dbSideIcon-1">Manage Finances</span>
            <ChevronRight size={16} className="chevron" />
          </div>

          <div
            className={`menu-item ${activeView === "forum" ? "active" : ""}`}
            onClick={() => {
              setActiveView("forum");
              if (isMobile) toggleSidebar();
            }}
          >
            <div className="menu-icon forum-icon">
              <MessageSquare size={18} />
            </div>
            <span id="dbSideIcon-1">Access Finances Forum</span>
            <ChevronRight size={16} className="chevron" />
          </div>

          <div
            className={`menu-item ${activeView === "upload" ? "active" : ""}`}
            onClick={() => {
              setActiveView("upload");
              if (isMobile) toggleSidebar();
            }}
          >
            <div className="menu-icon upload-icon">
              <Upload size={18} />
            </div>
            <span id="dbSideIcon-1">Upload Bills</span>
            <ChevronRight size={16} className="chevron" />
          </div>

          <div
            className={`menu-item ${activeView === "tasks" ? "active" : ""}`}
            onClick={() => {
              setActiveView("tasks");
              if (isMobile) toggleSidebar();
            }}
          >
            <div className="menu-icon tasks-icon">
              <CheckSquare size={18} />
            </div>
            <span id="dbSideIcon-1">Manage Tasks</span>
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

      {/* Overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Content Area - properly positioned to adjust for sidebar */}
      <div className="content-area">
        <h1 id="dbTitle-1">
          {activeView === "expenses" && "View Financial Expenses"}
        </h1>
        <h1 id="dbTitle-1">{activeView === "finances" && "Manage Finances"}</h1>
        <h1 id="dbTitle-1">
          {activeView === "forum" && "Access Finances Forum"}
        </h1>
        <h1 id="dbTitle-1">{activeView === "upload" && "Upload Bills"}</h1>
        <h1 id="dbTitle-1">{activeView === "tasks" && "Manage Tasks"}</h1>

        {/* Example content to demonstrate layout */}
        <div className="dashboard-content">
          {activeView === "expenses" && <ViewFinancialExpenses />}
          {activeView === "finances" && <ManageFinance />}
          {activeView === "forum" && <AccessCommunityForum />}
          {activeView === "upload" && <UploadBills />}
          {activeView === "tasks" && <ManageTasks />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
