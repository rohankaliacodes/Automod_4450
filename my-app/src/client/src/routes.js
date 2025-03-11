import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Market from "./pages/Market";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Companies from "./pages/Companies";
import DeleteAccount from "./pages/DeleteAccount";
import CarView from "./pages/CarView/CarView";
import Contact from "./pages/Contact";



const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Login Page */}
                <Route path="/login" element={<Login />} />

                {/* Settings Page */}
                <Route path="/settings" element={<Settings />} />

                {/* Register Page */}
                <Route path="/register" element={<Register />} />

                {/* Chat Page */}
                <Route path="/chat" element={<Chat />} />

                {/* Market Page */}
                <Route path="/market" element={<Market />} />

                {/* Garage Page */}
                <Route path="/garage" element={<CarView />} /> 

                {/* Delete Account Page */}
                <Route path="/deleteAccount" element={<DeleteAccount />} />

                {/* Companies Page */}
                <Route path="/companies" element={<Companies />} />

                <Route path="/contact" element={<Contact />} /> {/* Add this line */}


            </Routes>
        </Router>
    );
};

export default AppRoutes;
