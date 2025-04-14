import React from "react";
import "./RegisterPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function RegisterPage() {
  return (
    <div>
      <div className="container-fluid">
        <div id="registerbox-row" className="row">
          <div
            id="registerbox-col"
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <p id="registerbox-text">Create Account</p>
            <div class="form-floating mb-3 w-100">
              <input
                type="text"
                class="form-control"
                id="floatingName"
                placeholder="Your Name"
              />
              <label for="floatingName">Name</label>
            </div>

            <div class="form-floating mb-3 w-100">
              <input
                type="tel"
                class="form-control"
                id="floatingContact"
                placeholder="Contact Number"
              />
              <label for="floatingContact">Contact Number</label>
            </div>
            <div class="form-floating mb-3 w-100">
              <input type="date" class="form-control" id="floatingDOB" />
              <label for="floatingDOB">Date of Birth</label>
            </div>
            <div class="form-floating mb-3 w-100">
              <input
                type="number"
                class="form-control"
                id="floatingAge"
                placeholder="Age"
              />
              <label for="floatingAge">Age</label>
            </div>
            <div
              id="registerbox-email-Input"
              className="form-floating mb-3 w-100"
            >
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div
              id="registerbox-pass-Input"
              className="form-floating mb-3 w-100"
            >
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div
              id="registerbox-pass-Input"
              className="form-floating mb-3 w-100"
            >
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Confirm Password</label>
            </div>
            <button id="register-button" type="button" className="mb-3">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
