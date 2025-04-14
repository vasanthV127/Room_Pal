import React, { useState } from "react";
import "./LoginPage.css";
import GoogleIcon from "./google.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log(email);
      console.log(password);
      const response = await fetch("http://192.168.137.1:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("userId", data.userId.toString()); // Store userId
      localStorage.setItem("username", data.username); // Store username
      setError("");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div id="loginbox-row" className="row">
          <div
            id="loginbox-col"
            className="col d-flex flex-column justify-content-center align-items-center"
          >
            <p id="login-text">Login</p>
            {error && <p className="text-danger">{error}</p>}
            <div id="email-Input" className="form-floating mb-3 w-100">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div id="pass-Input" className="form-floating mb-3 w-100">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button
              id="login-button"
              type="button"
              className="mb-3"
              onClick={handleLogin}
            >
              Login
            </button>
            <a href="#" id="f-pass" className="mb-3">
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