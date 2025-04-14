import React from "react";
import "./LoginPage.css";
import GoogleIcon from "./google.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LoginPage() {
  return (
    <div>
      <div className="container-fluid">
        <div id="loginbox-row" className="row">
          <div
            id="loginbox-col"
            className="col d-flex flex-column justify-content-center align-items-center"
          >
            <p id="login-text">Login</p>
            <div id="email-Input" className="form-floating mb-3 w-100">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div id="pass-Input" className="form-floating mb-3 w-100">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button id="login-button" type="button" className="mb-3">
              Login
            </button>
            <a href="" id="f-pass" className="mb-3">
              Forgot Password
            </a>
            <p className="mb-3" id="or">
              -or-
            </p>
            <a className="mb-3" href="#">
              <img src={GoogleIcon} alt="Google" />
            </a>
            <p id="New-User" className="mb-3">
              Don't have an account? <a href="#">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
