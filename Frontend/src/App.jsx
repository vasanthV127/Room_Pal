import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import ViewFinancialExpenses from "./Components/ViewFinancialExpenses/ViewFinancialExpenses";
import ManageFinance from "./Components/ManageFinance/ManageFinance";
import AccessComunityForum from "./Components/AccessComunityForum/AccessComunityForum";
import UploadBills from "./Components/UploadBills/UploadBills";
import ManageTasks from "./Components/ManageTasks/ManageTasks";
import LoginMain from "./Components/LoginPageRoomPal/LoginMain";

import UsrHomeRP from "./Components/UsrHomePage/UsrHomeRP";
import Notifications from "./Components/Notification/Notifications";

function App() {
  const [activeView, setActiveView] = useState("expenses");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginMain />} />
        <Route path="/dashboard" element={<UsrHomeRP />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/n" element={<Notifications/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
