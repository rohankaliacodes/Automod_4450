import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chat from "./pages/Chat";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* Chat Page */}
                <Route path="/chat" element={<Chat />} />

                {/* Add more routes as needed */}
                {/* Example: <Route path="/garage" element={<Garage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
