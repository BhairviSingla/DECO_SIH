import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Logo */}
        <div className="login-brand">
          <div className="login-brand-icon">
            🐠
          </div>

          <div>
            <h1>AquaCore</h1>
            <p>Smart Aquarium Care</p>
          </div>
        </div>

        {/* Welcome */}
        <div className="login-welcome">
          <h2>Welcome back!</h2>
          <p>
            Sign in to monitor your aquarium<br />
            and keep your fish healthy.
          </p>
        </div>

        {/* Login Card */}
        <div className="login-card">

          <form onSubmit={handleLogin}>

            <div className="login-field">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-options">

              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button">
                Forgot password?
              </button>

            </div>

            <button className="login-button" type="submit">
              Sign In
              <span>→</span>
            </button>

          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button
            className="guest-button"
            onClick={() => navigate("/dashboard")}
          >
            Continue as Guest
          </button>

        </div>

        {/* Sign Up */}
        <p className="create-account">
          Don't have an account?
          <button onClick={() => navigate("/onboarding")}>
            Create Account
          </button>
        </p>

        <p className="login-bottom-text">
          🌊 Your aquarium. Smarter. Healthier.
        </p>

      </div>

    </div>
  );
}

export default Login;