import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userLogin.css"; // Reuse the same CSS
import loginImage from "../assets/registerImage.jpg";
import googleLogo from "../assets/google-logo.svg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (event) => {
    if(!email || !password){return;}
    event.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with displayName (username)
      await updateProfile(user, { displayName: username });

      console.log("User signed up:", user);
      alert("User registered");

      // Navigate to login page after successful signup
      navigate("/login");
    } catch (error) {
      // Handle errors and display an appropriate message
      console.error("Error during signup:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <img src={loginImage} alt="Background" className="background-image" />
      </div>
      <div className="login-form">
        <h1 className="welcome-back">Create an Account</h1>
        <form onSubmit={handleSignup} className="login-form-container">
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
          <div className="separator"></div>
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
