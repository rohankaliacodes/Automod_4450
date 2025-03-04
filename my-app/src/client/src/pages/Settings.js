import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import settingsImage from "../assets/settingsbg.jpg";
import "../styles/settings.css";    

function Settings(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(""); 
    
     useEffect(() => {
        // Check authentication status on component mount and when localStorage changes
        const checkAuth = () => {
          const email = localStorage.getItem("email");
          const name = localStorage.getItem("displayName"); 
          if (email && name) {
            setUsername(name);
          } else {
            setUsername(null);
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
            <h1>Settings</h1>
            <div className="settings-form">
                <span>Current Username: {username}</span>
            </div>
            <button className="change-username-btn">Change Username</button>
            <button className="change-password-btn">Change Password</button>
        </div>
    </div>
)

}

export default Settings;