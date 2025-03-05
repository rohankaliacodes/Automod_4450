import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import settingsImage from "../assets/settingsbg.jpg";
import "../styles/settings.css";    

function Settings(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); 
    const [email, setEmail] = useState("");
    
     useEffect(() => {
        // Check authentication status on component mount and when localStorage changes
        const checkAuth = () => {
          const email = localStorage.getItem("email");
          const name = localStorage.getItem("displayName"); 
          if (email && name) {
            setUsername(name);
            setEmail(email);
          } else {
            setUsername(null);
            setEmail(null);
          }
        };
    
        // Initial check
        checkAuth();
    
        // Listen for storage changes
        window.addEventListener('storage', checkAuth);
    
        return () => {
          window.removeEventListener('storage', checkAuth);
        };
      }, []);


return (
    <div className="settings-page">
        <div className="image-container">
            <img src={settingsImage} alt="Background" className="settings-image" />
        </div>
        <div className="settings-container">
            <h1 className="settings-header">Settings</h1>
            <div className="settings-form">
                <span className="text">Current Username: {username}</span>
                <br />
                <span className="text">Your Email: {email}</span>
            </div>
            <button className="settings-btn">Change Username</button>
            <button className="settings-btn">Change Password</button>
            <button className="delete-btn">Delete Account</button>
        </div>
    </div>
)

}

export default Settings;