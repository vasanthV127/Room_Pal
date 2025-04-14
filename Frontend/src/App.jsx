import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './Components/Dashboard/Dashboard';
import ViewFinancialExpenses from './Components/ViewFinancialExpenses/ViewFinancialExpenses';
import ManageFinance from './Components/ManageFinance/ManageFinance';
import AccessComunityForum from './Components/AccessComunityForum/AccessComunityForum';
import UploadBills from './Components/UploadBills/UploadBills';
import ManageTasks from './Components/ManageTasks/ManageTasks';
import LoginMain from './Components/LoginPageRoomPal/LoginMain';

function App() {
  const [activeView, setActiveView] = useState('expenses');

  // Render the main content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'expenses':
        return <ViewFinancialExpenses />;
      case 'finances':
        return <ManageFinance />;
      case 'forum':
        return <AccessComunityForum />;
      case 'upload':
        return <UploadBills />;
      case 'tasks':
        return <ManageTasks />;
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  // DashboardLayout component to wrap Dashboard and content
  const DashboardLayout = () => {
    return (
      <div className="dashboard-container">
        <Dashboard activeView={activeView} setActiveView={setActiveView} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginMain />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;