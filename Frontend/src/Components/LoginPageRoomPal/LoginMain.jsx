import React from "react";
import "./LoginMain.css";
import LoginPage from "./LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

function LoginMain() {
  return (
    <div>
      {/*...Container - 1...*/}
      <div className="container-fluid">
        {/*...ROW*/}
        <div id="login-row" className="row">
          {/*...COL*/}
          <div
            id="login-col"
            className="col d-flex justify-content-start align-items-center  ps-md-5"
          >
            ROOM PAL
          </div>
        </div>
      </div>
      {/*...Container - 2...*/}
      <div className="container-fluid">
        <div id="login-row-2" className="row">
          <div
            id="login-col-2"
            className="d-flex justify-content-center align-items-center w-100"
          >
            <LoginPage></LoginPage>
          </div>
        </div>
      </div>
      {/*...Container - 3...*/}
      <div className="container-fluid">
        <footer>
          <div id="login-footer-row" className="row">
            {/*...FOR DESKTOP's AND LAPTOP's AND TAB's*/}
            <div
              id="login-footer-col-1"
              className="col-4 d-flex justify-content-start align-items-center  ps-md-5"
            >
              <a>Support</a>
            </div>
            <div
              id="login-footer-col-2"
              className="col-4 text-center d-flex justify-content-center align-items-center"
            >
              <a>
                <FontAwesomeIcon
                  icon={faCopyright}
                  style={{ color: "rgba(9, 9, 117, 1)" }}
                />
                &nbsp;2024 ROOM PAL
              </a>
            </div>
            <div
              id="login-footer-col-3"
              className="col-4 d-flex justify-content-end align-items-center  pe-md-5"
            >
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LoginMain;
