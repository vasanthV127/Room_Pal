import React, { useState } from "react";
import "./UsrHomeRP.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ViewFinancialExpenses from "../ViewFinancialExpenses/ViewFinancialExpenses";
import ManageFinance from "../ManageFinance/ManageFinance";
import AccessComunityForum from "../AccessComunityForum/AccessComunityForum";
import UploadBills from "../UploadBills/UploadBills";
import ManageTasks from "../ManageTasks/ManageTasks";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

function UsrHomeRP() {
  const [activePage, setActivePage] = useState("View Financial Expenses");

  const handleOptionClick = (page) => {
    setActivePage(page);
  };
  return (
    <div>
      <div className="container-fluid">
        <div id="UsrHome-Row-1" className="row">
          <div
            id="UsrHome-Col-1"
            className="col-6 d-flex justify-content-start align-items-center  ps-md-5"
          >
            ROOM PAL
          </div>
          <div
            id="UsrHome-Col-2"
            className="col-6  d-flex justify-content-end align-items-center  pe-md-5"
          >
            <a id="UsrHome-Notifications-Icon" href="#">
              <NotificationsRoundedIcon
                style={{ fontSize: 25, color: "black" }}
              />
            </a>
            <a id="UsrHome-Profile-Icon" href="#">
              <PersonRoundedIcon style={{ fontSize: 30, color: "black" }} />
            </a>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div id="UsrHome-NavBar-Row" className="row">
          <div
            id="UsrHome-NavBar-Col"
            className="col-12 d-sm-flex justify-content-sm-start align-items-sm-center d-none  ps-md-5"
          >
            <div
              id="UsrHome-NavBar-Options"
              className="d-flex gap-5 justify-content-center align-items-center"
            >
              <a
                onClick={() => handleOptionClick("View Financial Expenses")}
                href="#"
              >
                View Financial Expenses
              </a>
              <a onClick={() => handleOptionClick("Manage Finance")} href="#">
                Manage Finance
              </a>
              <a
                onClick={() => handleOptionClick("View Discussion Forum")}
                href="#"
              >
                View Discussion Forum
              </a>
              <a onClick={() => handleOptionClick("Upload Bills")} href="#">
                Upload Bills
              </a>
              <a onClick={() => handleOptionClick("Manage Tasks")} href="#">
                Manage Tasks
              </a>
            </div>
          </div>
          {/* For Mobile */}
          <div className="col-12 d-flex justify-content-end align-items-center d-sm-none">
            <button
              id="mobileHamburgerBtn"
              className="btn btn-primary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <MenuRoundedIcon
                style={{
                  fontSize: 30,
                  color: "black",
                }}
              />
            </button>

            <div
              className="offcanvas offcanvas-end"
              tabindex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div className="offcanvas-header">
                <h5 id="offcanvasRightLabel">Welcome</h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div
                id="UsrHome-NavBar-Options"
                className="offcanvas-body d-flex gap-5 flex-column justify-content-center align-items-start ps-5"
              >
                <a
                  onClick={() => handleOptionClick("View Financial Expenses")}
                  href="#"
                >
                  View Financial Expenses
                </a>
                <a onClick={() => handleOptionClick("Manage Finance")} href="#">
                  Manage Finance
                </a>
                <a
                  onClick={() => handleOptionClick("View Discussion Forum")}
                  href="#"
                >
                  View Discussion Forum
                </a>
                <a onClick={() => handleOptionClick("Upload Bills")} href="#">
                  Upload Bills
                </a>
                <a onClick={() => handleOptionClick("Manage Tasks")} href="#">
                  Manage Tasks
                </a>
              </div>
            </div>
          </div>
          {/* End */}
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            {/* After clocking the navbar optins it hsould display */}
            {activePage === "View Financial Expenses" && (
              <ViewFinancialExpenses />
            )}
            {activePage === "Manage Finance" && <ManageFinance />}
            {activePage === "View Discussion Forum" && <AccessComunityForum />}
            {activePage === "Upload Bills" && <UploadBills />}
            {activePage === "Manage Tasks" && <ManageTasks />}
            {activePage === "Notifications" && <h1>Notifications</h1>}
            {activePage === "Profile" && <h1>Profile Page</h1>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsrHomeRP;
