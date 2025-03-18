// my-app/src/client/src/pages/Settings.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import settingsImage from "../assets/settingsImage.jpg";
//import homeImage from "../assets/home.svg"; // No longer needed here
import "../styles/settings.css";
import { auth } from "../config/firebase";
import { updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./Header"; // Import Header

function Settings() {
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleUsernameFormToggle = () => {
        setShowUsernameForm(!showUsernameForm);
    };

    const handlePasswordFormToggle = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const sendPasswordRecoveryEmail = async () => {
        const user = auth.currentUser;
        try {
            await sendPasswordResetEmail(auth, user.email);
            alert("Password recovery email sent. Check your inbox for further instructions.");
        } catch (error) {
            console.log("Error sending password recovery email:", error);
            alert("Error sending password recovery email. Please try again later.");
        }
    }

    useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (user) => {
           if (user) {
               setUsername(user.displayName);
               setEmail(user.email);
           } else {
               navigate("/login");
           }
       });

       return () => unsubscribe();
    }, []);


    const handleUsernameChange = async (event) => {
        event.preventDefault();
        const trimmedUsername = newUsername.trim();
        if (!trimmedUsername || typeof trimmedUsername !== "string" || trimmedUsername.length < 3 || trimmedUsername.length > 20) {
            setMessage("Please enter a valid username.");
            return;
        }
        if(trimmedUsername === username){
            setMessage("Please enter a different username than your old one.");
            return;
        }
        try {
            await updateProfile(auth.currentUser, { displayName: trimmedUsername });
            setUsername(trimmedUsername);
            setNewUsername("");
            setShowUsernameForm(false);
            setMessage("Username updated successfully!");
        } catch (error) {
            console.log("Error updating username:", error);
            setMessage(error.message);
        }
    };



    const handlePasswordChange = async (event) => {
        event.preventDefault();
        const trimmedPassword = newPassword.trim();
        if(!trimmedPassword || typeof trimmedPassword !== "string" || trimmedPassword.length < 6){
            setMessage("Please enter a valid password.");
            return;
        }

        const currentPassword = prompt("Please enter your current password to continue:");
        if(!currentPassword){
            setMessage("Password change cancelled.");
            return;
        }
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            if(trimmedPassword === currentPassword){
                setMessage("Please enter a different password than your old one.");
                return;
            }


            await updatePassword(user, trimmedPassword);
            setNewPassword("");
            setShowPasswordForm(false);
            setMessage("");
            alert("Password updated successfully!");
        } catch(error){
            console.log("Error updating password:", error);
            setMessage(error.message);
        }
    }

    return (
        <div className="settings-page">
            <div className="image-container">
                <img src={settingsImage} alt="Background" className="settings-image" />
            </div>
            {/* <div className="home-icon" onClick={() => navigate("/")}>  No longer needed 
                <img src={homeImage} alt="home"></img>
            </div> */}
             <Header /> {/* Include Header here */}
            <div className="settings-container">
                <h1 className="settings-header">Settings</h1>
                <div className="settings-form">
                    <p className="text">Current Username: {username}</p>
                    <p className="text">Your Email: {email}</p>
                </div>
                <button className="settings-btn" onClick={handleUsernameFormToggle}>
                    {showUsernameForm ? "Cancel" : "Change Username"}
                </button>
                <button className="settings-btn" onClick={handlePasswordFormToggle}>
                    {showPasswordForm ? "Cancel" : "Change Password"}
                </button>
                <a className="forgot-password" onClick={sendPasswordRecoveryEmail}>Forgot Password?</a>


                {showUsernameForm && (
                    <div className="settings-form-container">
                        <form onSubmit={handleUsernameChange} className="change-form">
                            <p className="new-alert">Enter your new username below</p>
                            <input
                                type="text"
                                placeholder="New Username"
                                className="input-field"
                                onChange={(e) => setNewUsername(e.target.value)}
                                value={newUsername}
                            />
                            <button type="submit" className="settings-btn">Save Changes</button>
                        </form>
                        {message && <p className="error-text">{message}</p>}
                    </div>
                )}
                {showPasswordForm && (
                    <div className="settings-form-container">
                        <form onSubmit={handlePasswordChange} className="change-form">
                            <p className="new-alert">Enter your new password below</p>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="input-field"
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />
                            <button type="submit" className="settings-btn">Save Changes</button>
                        </form>
                        {message && <p className="error-text">{message}</p>}
                    </div>
                )}


                <button className="delete-btn" onClick={() => navigate("/deleteAccount")}>Delete Account</button>
            </div>
        </div>
    );
}

export default Settings;