import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import LoginPage from "./Components/LoginPageRoomPal/LoginPage.jsx";
import LoginMain from "./Components/LoginPageRoomPal/LoginMain.jsx";
import RegisterMain from "./Components/RegisterPageRoomPal/RegisterMain.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    <RegisterMain></RegisterMain>
  </React.StrictMode>
);
