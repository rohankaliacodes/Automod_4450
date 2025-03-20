// my-app/src/client/src/pages/Home.js
import button from "../assets/search-button.png";
import "../styles/Home.css";
import Header from "../pages/Header";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

export const Home = () => {
    const categories = ["All", "Belts/Hoses/Cooling", "Body/Cable/Misc", "Brake/Wheel Bearing", "Electrical", "Fuel/Emissions", "Heating/AC", "Ignition/Filters", "Tires/Accessories", "Wipers/Lamps/Fuses"];
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [trim, setTrim] = useState("");
    const [engine, setEngine] = useState("");
    const navigate = useNavigate();

    // Gauge state
    const [speed, setSpeed] = useState(0);
    const [rpm, setRpm] = useState(0);
    const [isAccelerating, setIsAccelerating] = useState(false); // Track if spacebar is held
    const speedRef = useRef(0); // Use refs to track current values in intervals
    const rpmRef = useRef(0);
    const maxSpeed = 180;
    const maxRpm = 7000;
    const idleSpeed = 5; // Idle speed in MPH
    const idleRpm = 800; // Idle RPM

    const makes = ["Toyota", "Honda", "BMW"];
    const models = {
        // ... (rest of your car data remains the same) ...
        Toyota: {
            "GR Supra": {
                years: {
                    "2020": { trims: { Base: { engine: ["3.0L 6-Cylinder"] } } },
                    "2021": { trims: { Base: { engine: ["L6-2998cc 3.0L FI Turbo B58B30O1", "L4-122cid 2.0L FI Turbo B46B20O1"] } } },
                    "2022": { trims: { Base: { engine: ["L4-122cid 2.0L FI Turbo B46B20O1", "L6-2998cc 3.0L FI Turbo B58B30O1 24V"] } } },
                    "2023": { trims: { Base: { engine: ["L6-2998cc 3.0L FI Turbo B58B30O1 24V", "L4-122cid 2.0L FI Turbo B46B20O1"] } } },
                },
            },
            "86": {
                years: {
                    "2020": { trims: { Base: { engine: ["H4-122cid 2.0L FI FA20 200HP", "H4-122cid 2.0L FI FA20 205HP"] } } },
                },
            },
            Corolla: {
                years: {
                    "2020": { trims: { LE: { engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"] } } },
                    "2021": { trims: { LE: { engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"] } } },
                    "2022": { trims: { LE: { engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"] } } },
                    "2023": { trims: { LE: { engine: ["L4-121cid 2.0L FI M20A-FKS 169HP"] } } },
                },
            },
            Tacoma: {
                years: {
                    "2020": { trims: { SR5: { engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"] } } },
                    "2021": { trims: { SR5: { engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"] } } },
                    "2022": { trims: { SR5: { engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"] } } },
                    "2023": { trims: { SR5: { engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"] } } },
                },
            },
        },
        Honda: {
            Civic: {
                years: {
                    "2020": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15B7 174HP", "L4-122cid 2.0L FI K20C2"] } } },
                    "2021": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15B7 174HP", "L4-122cid 2.0L FI K20C2"] } } },
                    "2022": { trims: { LX: { engine: ["L4-122cid 2.0L FI K20C2"] } } },
                    "2023": { trims: { LX: { engine: ["L4-122cid 2.0L FI K20C2"] } } },
                },
            },
            Accord: {
                years: {
                    "2020": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"] } } },
                    "2021": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"] } } },
                    "2022": { trims: { SE: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"] } } },
                    "2023": { trims: { EX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"] } } },
                },
            },
            "CR-V": {
                years: {
                    "2020": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"] } } },
                    "2021": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"] } } },
                    "2022": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"] } } },
                    "2023": { trims: { LX: { engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"] } } },
                },
            },
            Pilot: {
                years: {
                    "2020": { trims: { LX: { engine: ["V6-3471cc 3.5L FI J35Y6 280HP"] } } },
                    "2021": { trims: { Touring: { engine: ["V6-3471cc 3.5L FI J35Y6 280HP"] } } },
                    "2022": { trims: { Sport: { engine: ["V6-3471cc 3.5L FI J35Y6 280HP"] } } },
                    "2023": { trims: { Sport: { engine: ["V6-3471cc 3.5L FI J35Y6 285HP"] } } },
                },
            },
        },
        BMW: {
            "335i": {
                years: {
                    "2007": { trims: { Base: { engine: ["N54B30"] } } },
                }
            }
        }
    };

    const handleMakeChange = (event) => {
        setMake(event.target.value);
        setModel("");
        setYear("");
        setTrim("");
        setEngine("");
    };

    const handleModelChange = (event) => {
        setModel(event.target.value);
        setYear("");
        setTrim("");
        setEngine("");
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
        setTrim("");
        setEngine("");
    };

    const handleTrimChange = (event) => {
        setTrim(event.target.value);
        setEngine("");
    };

    const handleEngineChange = (event) => {
        setEngine(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const carData = {
            make: make,
            model: model,
            year: year,
            trim: trim,
            engine: engine
        };
        navigate('/carView', { state: carData });
    };

    const getModels = () => (models[make] ? Object.keys(models[make]) : []);
    const getYears = () => (model && models[make][model] ? Object.keys(models[make][model].years) : []);
    const getTrims = () => (year && models[make][model]?.years[year] ? Object.keys(models[make][model].years[year].trims) : []);
    const getEngines = () => (trim && models[make][model]?.years[year]?.trims[trim]?.engine || []);

   // Function to accelerate the gauges
   const accelerate = () => {
    setIsAccelerating(true); // Set acceleration flag
};

// Function to decelerate the gauges
const decelerate = () => {
    setIsAccelerating(false); // Clear acceleration flag
};


    useEffect(() => {
        let speedIntervalId;
        let rpmIntervalId;

        const updateGauges = () => {
            // Update speed
            if (isAccelerating) {
                speedRef.current = Math.min(speedRef.current + Math.random() * 5, maxSpeed);
            } else {
                speedRef.current = Math.max(speedRef.current - 1, idleSpeed);
            }
            setSpeed(Math.round(speedRef.current)); // Update state for re-render

            // Update RPM
            if (isAccelerating) {
                rpmRef.current = Math.min(rpmRef.current + Math.random() * 200, maxRpm);
            } else {
                rpmRef.current = Math.max(rpmRef.current - 40, idleRpm);
            }
            setRpm(Math.round(rpmRef.current));
        };

        // Start intervals for continuous updates
        if (isAccelerating) {
            // Faster updates while accelerating
            speedIntervalId = setInterval(updateGauges, 30);
            rpmIntervalId = setInterval(updateGauges, 30);
        } else {
            // Slower updates for deceleration/idling
            speedIntervalId = setInterval(updateGauges, 50);
            rpmIntervalId = setInterval(updateGauges, 50);
        }


        const handleKeyDown = (event) => {
            if (event.code === "Space" && !isAccelerating) {
                accelerate();
            }
        };

        const handleKeyUp = (event) => {
            if (event.code === "Space") {
                decelerate();
            }
        };


        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);


        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            clearInterval(speedIntervalId);
            clearInterval(rpmIntervalId);
        };
    }, [isAccelerating, maxSpeed, maxRpm]);  // Depend on isAccelerating




    return (
        <div className="background">
            <Header />
            <p className="heading-find-your">Find The Perfect Part For Your Car</p>

            <div className="form">
                <button className="home-info-tooltip" data-tooltip-id="test-tooltip" data-tooltip-content="Welcome to AutoMod! Enter your vehicle's specs to get started, or browse parts by category.">
                    ?
                </button>
                <Tooltip id="test-tooltip" />

                <p className="heading-find-cars">Select Your Vehicle</p>

                <form onSubmit={handleSubmit}>
                    <div className="dropdowns">
                        <select className="dropdown" value={make} onChange={handleMakeChange} data-tooltip-id="make-tooltip" data-tooltip-content="Select the make of your vehicle">
                            <option value="">Select Make</option>
                            {makes.map((makeOption) => (
                                <option key={makeOption} value={makeOption}>
                                    {makeOption}
                                </option>
                            ))}
                        </select>
                        <Tooltip id="make-tooltip" />

                        <select
                            className="dropdown"
                            value={model}
                            onChange={handleModelChange}
                            disabled={!make}
                            data-tooltip-id="model-tooltip"
                            data-tooltip-content="Select the model of your vehicle"
                        >
                            <option value="">Select Model</option>
                            {getModels().map((modelOption) => (
                                <option key={modelOption} value={modelOption}>
                                    {modelOption}
                                </option>
                            ))}
                        </select>
                        <Tooltip id="model-tooltip" />

                        <select
                            className="dropdown"
                            value={year}
                            onChange={handleYearChange}
                            disabled={!model}
                            data-tooltip-id="year-tooltip"
                            data-tooltip-content="Select the year of your vehicle"
                        >
                            <option value="">Select Year</option>
                            {getYears().map((yearOption) => (
                                <option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </option>
                            ))}
                        </select>
                        <Tooltip id="year-tooltip" />

                        <select
                            className="dropdown"
                            value={trim}
                            onChange={handleTrimChange}
                            disabled={!year}
                            data-tooltip-id="trim-tooltip"
                            data-tooltip-content="Select the trim of your vehicle"
                        >
                            <option value="">Select Trim</option>
                            {getTrims().map((trimOption) => (
                                <option key={trimOption} value={trimOption}>
                                    {trimOption}
                                </option>
                            ))}
                        </select>
                        <Tooltip id="trim-tooltip" />

                        <select
                            className="dropdown"
                            value={engine}
                            onChange={handleEngineChange}
                            disabled={!trim}
                            data-tooltip-id="engine-tooltip"
                            data-tooltip-content="Select the engine of your vehicle"
                        >
                            <option value="">Select Engine</option>
                            {getEngines().map((engineOption) => (
                                <option key={engineOption} value={engineOption}>
                                    {engineOption}
                                </option>
                            ))}
                        </select>
                        <Tooltip id="engine-tooltip" />
                    </div>

                    <button type="submit" disabled={!make || !model || !year || !trim || !engine} className="custom-button">
                        Submit
                    </button>
                </form>

                <p className="text-wrapper">Or Browse Part By Category</p>
                <div className="categories">
                    {categories.map((category, index) => (
                        <button key={index} className="category-button" onClick={() => navigate("/modshop", { state: { category } })}>
                            {category}
                        </button>
                    ))}
                </div>

                <div className="gauges-container">
                    <div className="gauge-container">
                        <div className="gauge">
                            <div className="gauge-face">
                                {/* Combined loop for ticks and numbers */}
                                {[...Array(37)].map((_, i) => {
                                    const angle = (i * 4.5) - 90; // Correct angle for 5 MPH increments
                                    const isMajorTick = i % 4 === 0; // Major tick every 4 minor ticks (20mph)
                                    const tickHeight = isMajorTick ? 10 : 5;
                                    const tickWidth = isMajorTick ? 2 : 1;

                                    return (
                                        <React.Fragment key={`tick-${i}`}>
                                            <div
                                                className="gauge-tick"
                                                style={{
                                                    transform: `rotate(${angle}deg)`,
                                                    height: `${tickHeight}px`,
                                                    width: `${tickWidth}px`,
                                                    backgroundColor: isMajorTick ? 'white' : '#aaa',
                                                }}
                                            ></div>
                                            {isMajorTick && (
                                            <div
                                            className="gauge-number"
                                            style={{
                                                position: 'absolute',
                                                left: `${50 + (Math.sin(angle * Math.PI / 180) * 65)}%`, // 65 is the "radius"
                                                top: `${50 - (Math.cos(angle * Math.PI / 180) * 65)}%`,  // 50 - ... because top 0 is at the top
                                                transform: `translate(-50%, -50%)`, // Center the number
                                                color: 'white',
                                                fontSize: '10px',
                                            }}
                                        >
                                            {i/2 * 10}
                                        </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                <div
                                    className="gauge-needle"
                                    style={{
                                        transform: `rotate(${speed * (180 / maxSpeed) - 90}deg)`,
                                    }}
                                ></div>
                            </div>
                            <div className="gauge-value">{speed} MPH</div>
                        </div>
                    </div>

                    <div className="gauge-container">
                        <div className="gauge">
                            <div className="gauge-face">
                            {[...Array(33)].map((_, i) => {
                                    const angle = (i * 22.5 / 4) - 90;  // -90 start, every 250 rpm
                                    const isMajorTick = i % 4 === 0;
                                    const tickHeight = isMajorTick ? 10 : 5;
                                    const tickWidth = isMajorTick ? 2 : 1;
                                    return (
                                    <React.Fragment key={`rpm-tick-${i}`}>
                                        <div
                                        className="gauge-tick"
                                        style={{
                                            transform: `rotate(${angle}deg)`,
                                            height: `${tickHeight}px`,
                                            width: `${tickWidth}px`,
                                            backgroundColor: isMajorTick ? "white" : "#aaa",
                                        }}
                                        ></div>
                                        {isMajorTick && (
                                            <div
                                                className="gauge-number"
                                                style={{
                                                position: 'absolute',
                                                left: `${50 + (Math.sin(angle * Math.PI / 180) * 65)}%`, // 65 is the "radius"
                                                top: `${50 - (Math.cos(angle * Math.PI / 180) * 65)}%`,  // 50 - ... because top 0 is at the top
                                                transform: `translate(-50%, -50%)`, // Center the number
                                                color: 'white',
                                                fontSize: '10px',
                                                }}
                                            >
                                                {i / 4}
                                            </div>
                                        )}
                                    </React.Fragment>
                                    );
                                })}
                                <div
                                    className="gauge-needle"
                                    style={{
                                        transform: `rotate(${rpm * (180 / maxRpm) - 90}deg)`,
                                    }}
                                ></div>
                            </div>
                            <div className="gauge-value">{rpm} RPM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;