import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userLogin.css";
import loginImage from "../assets/login.jpg";
import googleLogo from "../assets/google-logo.svg";
import {signInWithEmailAndPassword} from "firebase/auth"
import { auth } from "../config/firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

   const handleSignIn = async (event) => {
      if(!email || !password){return;}
      event.preventDefault();
      try {
        // Sign In with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        console.log("User signed in:", user);
        alert("User Logged In");
  
        // Navigate to login page after successful signup
        navigate("/");
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
        <h1 className="welcome-back">Welcome back</h1>
        <form onSubmit={handleSignIn} className="login-form-container">
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
            Sign-In
          </button>
          <div className="separator">   </div>
          <button className="google-button">
            <img src={googleLogo} alt="Google Logo" />
            Log in with Google
          </button>
          <div className="signup-link">
            <p>
              Don't have an account? <a href="#">Sign up for free</a>
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;