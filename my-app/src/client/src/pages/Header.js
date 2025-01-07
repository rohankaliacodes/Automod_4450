import React from "react";
import icon from "../assets/person-icon.png";
import "../styles/Header.css";
import { useNavigate } from "react-router-dom";

function Header(){

  const navigate = useNavigate();

  return (
    <div className="header-container">


      <div className="right-actions">
      <button className="nav-item" onClick={() => navigate("/login")}>Login</button>
      <button className="nav-item" onClick={() => navigate("/Garage")}>My Garage</button>
      <button className="nav-item" onClick={() => navigate("/Market")}>Modshop</button>
      <button className="nav-item" onClick={() => navigate("/login")}>Contact</button>


       
          <button className="nav-item" onClick={() => navigate("/Register")}>Sign Up<img className="icon" alt="User Icon" src={icon} /></button>
        </div>
        <button className="submit-listing">Submit Listing</button>
      </div>
  
  );
};

export default Header;