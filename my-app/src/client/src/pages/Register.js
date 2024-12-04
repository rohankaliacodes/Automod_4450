import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userLogin.css"; // Reuse the same CSS
import loginImage from "../assets/registerImage.jpg";
import googleLogo from "../assets/google-logo.svg";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function registerUser(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username })
      });
      const data = await response.json();
      if (data.status === "ok") {
        alert("User registered");
        navigate("/login");
      } else {
        console.log(data.message);
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError("Internal Server Error");
    }
  }

  return (
    <div className="login-page">
      <div className="image-container">
        <img src={loginImage} alt="Background" className="background-image" />
      </div>
      <div className="login-form">
        <h1 className="welcome-back">Create an Account</h1>
        <form onSubmit={registerUser} className="login-form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="sign-in-button">
            Sign Up
          </button>
          <div className="separator">   </div>
          <button className="google-button">
            <img src={googleLogo} alt="Google Logo" />
            Sign up with Google
          </button>
          <div className="signup-link">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;