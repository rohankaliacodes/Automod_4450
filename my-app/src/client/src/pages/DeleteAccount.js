import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.svg";
import "../styles/DeleteAccount.css";    
import deleteAccountImage from "../assets/comebacksoon.jpeg";
import { auth } from "../config/firebase"; // Ensure Firebase auth is imported
import { deleteUser } from "firebase/auth";

function DeleteAccount() {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        try {
            await deleteUser(user);
            alert("Account deleted successfully.");
            navigate("/login");
        } catch (error) {
            console.log("Error deleting account:", error);
            alert("Error deleting account. Please try again later.");
        }
    };


    return (
        <div className="delete-account-page">
            <div className="image-container">
                <img src={deleteAccountImage} alt="Delete Account" className="delete-account-image" />
            </div>
            <div className="home-icon" onClick={() => navigate("/")}>
                <img src={homeImage} alt="home"></img>
            </div>
            <div className="delete-account-container">
                <h1 className="delete-account-header">We're sad to see you go!</h1>
                <p className="delete-account-p">Are you sure you want to delete your account? This cannot be undone.</p>
                <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
}

export default DeleteAccount;