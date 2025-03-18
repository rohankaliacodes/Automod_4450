// my-app/src/client/src/pages/Register.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/userLogin.css";
import loginImage from "../assets/registerImage.jpg";
import googleLogo from "../assets/google-logo.svg";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../config/firebase";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    if (!email || !password) {
      return;
    }
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(auth.currentUser);
      setVerificationMessage("Verification link has been sent to your email address!");

      console.log("User signed up:", user);

      setResendCooldown(60);
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Google sign up successful:", user);
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign up:", error);
      setError(error.message);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;

    try {
      await sendEmailVerification(auth.currentUser);
      setVerificationMessage("Verification link has been resent to your email address!");
      setResendCooldown(60);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
            <span>Sign Up</span>
          </button>
          <div className="separator"></div>
          <button onClick={handleGoogleSignUp} className="google-button" type="button">
            <img src={googleLogo} alt="Google Logo" />
            <span>Sign up with Google</span>
          </button>
          <div className="signup-link">
            <p>
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
          {verificationMessage && (
            <p className="verification-message">
              {verificationMessage}{" "}
              {auth.currentUser && !auth.currentUser.emailVerified && (
                <>
                  {resendCooldown > 0 ? (
                    <span style={{ color: "gray" }}>
                      Resend available in {resendCooldown}s
                    </span>
                  ) : (
                    <span
                      onClick={handleResendVerification}
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "blue",
                      }}
                    >
                      Resend
                    </span>
                  )}
                </>
              )}
            </p>
          )}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;