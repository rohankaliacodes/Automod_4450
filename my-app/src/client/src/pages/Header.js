import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";
import { settings } from "firebase/analytics";
import settingsIcon from "../assets/setting.png";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
function Header() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
         const unsubscribe = onAuthStateChanged(auth, (user) => {
             if (user) {
                 setDisplayName(user.displayName);
             } else {
                 setDisplayName(null);
             }
         });
      
         return () => unsubscribe();
      }, []);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDisplayName(null);
      navigate("/login");
    }
    catch(error){
      console.log("Error signing out:", error);
    }
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
            <button className="settings-nav-item" onClick={() => navigate("/settings")}>
              <img src={settingsIcon} alt="Settings"></img>
            </button>
          </>
        )}
        <button className="nav-item" onClick={() => navigate("/Garage")}>My Garage</button>
        <button className="nav-item" onClick={() => navigate("/Market")}>Modshop</button>
        <button className="nav-item" onClick={() => navigate("/login")}>Contact</button>
        
      </div>
    </div>
  );
}

export default Header;
