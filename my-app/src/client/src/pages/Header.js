import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { settings } from "firebase/analytics";
import settingsIcon from "../assets/setting.png";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
function Header() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(undefined);
  const location = useLocation();

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

  const pages = [
    {path: "/Garage", name: "My Garage"},
    {path: "/Market", name: "Modshop"},
    {path: "/settings", name: <img src={settingsIcon} alt="Settings"/>},
    {path: "/contact", name: "Contact"}
  ];


  return (
    <div className="header-container">
      <div className="right-actions">
        {displayName === undefined ? null : !displayName ?  (
          location.pathname !== "/login" && (
            <button className="nav-item" onClick={() => navigate("/login")}>Login</button>
          )
        ) : (
          <>
            <span className="user-name">Welcome, {displayName}!</span>
            <button className="nav-item" onClick={handleLogout}>Logout</button>
            
          </>
        )}
        {pages
          .filter((page) => page.path !== location.pathname)
          .map((page, index) => (
            <button key={index} className="nav-item" onClick={() => navigate(page.path)}>
              {page.name}
            </button>
          ))}
      </div>
    </div>
  );
}

export default Header;
