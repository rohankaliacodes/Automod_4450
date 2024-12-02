import React from "react";
import icon from "../assets/person-icon.png";
import "../styles/Header.css";

export const Header = () => {
  return (
    <div className="header-container">


      <div className="right-actions">
      <a href="#about" className="nav-item">About</a>
      <a href="#mygarage" className="nav-item">My Garage</a>
      <a href="#mygarage" className="nav-item">ModShop</a>
      <a href="#contact" className="nav-item">Contact</a>


        <div className="sign-in">
          <img className="icon" alt="User Icon" src={icon} />
          <a href="#signin" className="sign-in-text">Sign In</a>
        </div>
        <button className="submit-listing">Submit Listing</button>
      </div>
    </div>
  );
};

export default Header;