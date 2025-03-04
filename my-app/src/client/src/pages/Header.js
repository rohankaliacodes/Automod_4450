import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { settings } from "firebase/analytics";
import settingsIcon from "../assets/setting.png";
function Header() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    // Check authentication status on component mount and when localStorage changes
    const checkAuth = () => {
      const email = localStorage.getItem("email");
      const name = localStorage.getItem("displayName"); // Assuming displayName is stored
      if (email && name) {
        setDisplayName(name);
      } else {
        setDisplayName(null);
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

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("displayName");
    setDisplayName(null);
    navigate("/login");
  };

  return (
    <div className="header-container">
      <div className="right-actions">
        {!displayName ? (
          <button className="nav-item" onClick={() => navigate("/login")}>Login</button>
        ) : (
          <>
            <span className="user-name">Welcome, {displayName}!</span>
            <button className="nav-item" onClick={handleLogout}>Logout</button>
          </>
        )}
        <button className="nav-item" onClick={() => navigate("/Garage")}>My Garage</button>
        <button className="nav-item" onClick={() => navigate("/Market")}>Modshop</button>
        <button className="nav-item" onClick={() => navigate("/login")}>Contact</button>
        <button className="settings-nav-item" onClick={() => navigate("/settings")}>
          <img src={settingsIcon} alt="Settings"></img>
        </button>
      </div>
    </div>
  );
}

export default Header;
