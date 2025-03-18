import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userLogin.css";
import loginImage from "../assets/login.jpg";
import googleLogo from "../assets/google-logo.svg";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    if (!email || !password) {
      return;
    }
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setVerificationMessage("Please verify your email before signing in. Check your inbox for the verification link.");
        await auth.signOut();
        return;
      }

      // Store user email and display name in localStorage
      localStorage.setItem("email", user.email);
      localStorage.setItem("displayName", user.displayName || "User");
      
      console.log("User signed in:", user);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user email and display name in localStorage
      localStorage.setItem("email", user.email);
      localStorage.setItem("displayName", user.displayName || "Google User");

      console.log("Google sign in successful:", user);
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign in:", error);
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
          <button type="submit" className="sign-in-button btn-5">
            <span>Sign In</span>
          </button>
          <div className="separator"> </div>
          <button onClick={handleGoogleSignIn} className="google-button" type="button">
            <img src={googleLogo} alt="Google Logo" />
            <span>Log In with Google</span>
          </button>
          <div className="signup-link">
            <p>
              Don't have an account? <a href="/register">Sign up for free</a>
            </p>
          </div>
          {verificationMessage && (
            <p className="verification-message">{verificationMessage}</p>
          )}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;