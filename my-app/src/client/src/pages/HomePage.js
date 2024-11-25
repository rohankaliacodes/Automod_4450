import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

function HomePage() {
    const navigate = useNavigate();

    const [make, setMake] = React.useState("");
    const [model, setModel] = React.useState("");
    const [year, setYear] = React.useState("");
    const [trim, setTrim] = React.useState("");

    const loggedIn = false;

    const makes = ["Toyota", "Honda", "Ford"];
    const models = {
        Toyota: ["Corolla", "Camry", "RAV4"],
        Honda: ["Civic", "Accord", "CR-V"],
        Ford: ["F-150", "Escape", "Explorer"],
    };

    const years = ["2022", "2021", "2020"];
    const trims = ["Basic", "Sport", "Luxury"];

    const handleMakeChange = (event) => {
        setMake(event.target.value);
        setModel(""); // Reset model selection when Make changes
    };

    const handleModelChange = (event) => {
        setModel(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleTrimChange = (event) => {
        setTrim(event.target.value);
    };

    const handleButtonClick = () => {
        console.log("Button clicked");
        console.log("Selections:", { make, model, year, trim });
    };

    return (
        <div className="background">
            <div className="top-bar">
                {loggedIn ? (<button className="top-button" onClick={() => navigate("/garage")}>My Garage</button>) : (
                    <>
                        <button className="top-button" onClick={() => navigate("/login")}>
                            Login
                        </button>
                        <button className="top-button" onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </>
                )}
            </div>
            <h1 className="heading">AutoMod</h1>
            <p className="heading-find-cars">
                Transforming Cars One Mod
                <br /> At A Time
            </p>

            {/* Main Container to group left and right containers */}
            <div className="mainContainer">
                <div className="leftContainer">
                    <p className="heading-find-your">Find The Perfect Part For Your Car</p>

                    <div className="form">
                        <div className="container">
                            <select
                                className="combobox-menu-make"
                                value={make}
                                onChange={handleMakeChange}
                            >
                                <option value="">Select Make</option>
                                {makes.map((makeOption) => (
                                    <option key={makeOption} value={makeOption}>
                                        {makeOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model Dropdown */}
                        <div className="container-2">
                            <select
                                className="combobox-menu-model"
                                value={model}
                                onChange={handleModelChange}
                                disabled={!make}
                            >
                                <option value="">Select Model</option>
                                {(models[make] || []).map((modelOption) => (
                                    <option key={modelOption} value={modelOption}>
                                        {modelOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Dropdown */}
                        <div className="container-3">
                            <select
                                className="combobox-menu-year"
                                value={year}
                                onChange={handleYearChange}
                                disabled={!make}
                            >
                                <option value="">Select Year</option>
                                {years.map((yearOption) => (
                                    <option key={yearOption} value={yearOption}>
                                        {yearOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Trim Dropdown */}
                        <div className="container-4">
                            <select
                                className="combobox-menu-trim"
                                value={trim}
                                onChange={handleTrimChange}
                                disabled={!make}
                            >
                                <option value="">Select Trim</option>
                                {trims.map((trimOption) => (
                                    <option key={trimOption} value={trimOption}>
                                        {trimOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="custom-button"
                            onClick={handleButtonClick}
                            disabled={!make || !model || !year || !trim}
                        >
                            Search Parts
                        </button>
                    </div>
                </div>

                <div className="rightContainer">
                    <p className="heading-find-your">Talk to your personal AI mechanic</p>
                    <div className="form">
                    <p className="subheading">
                        Our AI mechanic is here to help you find the perfect part for your car. Just
                        tell us what you need and we'll take care of the rest.
                    </p>
                    <button
                        className="custom-button"
                        onClick={() => navigate("/chat")}
                    >Start Chatting</button>
                </div>
                    
                </div>
            </div>
        </div>
    );
}

export default HomePage;