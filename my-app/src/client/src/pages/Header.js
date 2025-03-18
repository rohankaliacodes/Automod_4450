import React, { useState, useEffect, useRef } from "react";
import "../styles/Header.css";
import { useNavigate, useLocation } from "react-router-dom";
import settingsIcon from "../assets/setting.png"; // Make sure this path is correct
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function Header() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState(undefined);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName);
                setProfilePicture(user.photoURL);
            } else {
                setDisplayName(null);
                setProfilePicture(null);
            }
        });

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setDisplayName(null);
            setProfilePicture(null);
            setIsDropdownOpen(false);
            navigate("/login");
        } catch (error) {
            console.log("Error signing out:", error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const pages = [
        { path: "/", name: "Home" },
        { path: "/Garage", name: "My Garage" },
        { path: "/modshop", name: "Modshop" },
        { path: "/contact", name: "Contact" }
    ];

    return (
        <div className="header-container">
            <div className="right-actions">
                {/* Always render the navigation items */}
                {pages
                    .filter((page) => page.path !== location.pathname)
                    .map((page) => (
                        <button
                            key={page.path}
                            className="nav-item"
                            onClick={() => navigate(page.path)}
                        >
                            {page.name}
                        </button>
                    ))}

                {/* Conditionally render Login button or profile icon */}
                {displayName === undefined ? null : !displayName ? (
                    location.pathname !== "/login" && (
                        <button className="nav-item" onClick={() => navigate("/login")}>Login</button>
                    )
                ) : (
                    <div className="profile-icon-container" ref={dropdownRef}>
                        <img
                            src={profilePicture || "default-profile-icon.png"} // Use a default if none.  Make sure you have this image!
                            alt="Profile"
                            className="profile-icon"
                            onClick={toggleDropdown}
                        />
                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item" onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}>
                                    Settings
                                </button>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;