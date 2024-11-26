import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* Login Page */}
                <Route path="/login" element={<Login />} />

                {/* Register Page */}
                <Route path="/register" element={<Register />} />

                {/* Chat Page */}
                <Route path="/chat" element={<Chat />} />

                {/* Add more routes as needed */}
                {/* Example: <Route path="/garage" element={<Garage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
