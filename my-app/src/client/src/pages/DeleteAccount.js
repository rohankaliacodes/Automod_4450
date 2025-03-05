import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import settingsImage from "../assets/settingsbg.jpg";
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
                <img src={deleteAccountImage} alt="Delete Account" className="settings-image" />
            </div>
            <h1>Delete Account</h1>
            <p>Are you sure you want to delete your account?</p>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
}

export default DeleteAccount;