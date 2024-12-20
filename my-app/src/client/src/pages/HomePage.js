import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

function Homepage() {
    const navigate = useNavigate();

    const [make, setMake] = React.useState("");
    const [model, setModel] = React.useState("");
    const [year, setYear] = React.useState("");
    const [trim, setTrim] = React.useState("");
    const [engine, setEngine] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState(false);

    setLoggedIn(sessionStorage.getItem("email") !== null);


    const makes = ["Toyota", "Honda"];
    const models = {
        Toyota: {
            "GR Supra":{
                years: {
                    "2020": {
                        trims: {
                            Base: {
                                engine: ["3.0L 6-Cylinder"]
                            }

                        }
                    },
                    "2021": {
                        trims: {
                            Base: {
                                engine: ["L6-2998cc 3.0L FI Turbo B58B30O1", "L4-122cid 2.0L FI Turbo B46B20O1"]
                            },
                        }
                    },
                    "2022": {
                        trims: {
                            Base: {
                                engine: ["L4-122cid 2.0L FI Turbo B46B20O1", "L6-2998cc 3.0L FI Turbo B58B30O1 24V"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            Base: {
                                engine: ["L6-2998cc 3.0L FI Turbo B58B30O1 24V", "L4-122cid 2.0L FI Turbo B46B20O1"]
                            }
                        }

                    }
                }
            },
            "86": {
                years: {
                    "2020": {
                        trims: {
                            Base: {
                                engine: ["H4-122cid 2.0L FI FA20 200HP", "H4-122cid 2.0L FI FA20 205HP"]
                            },
                        }
                    }
                }
            },
            Corolla: {
                years: {
                    "2020": {
                        trims: {
                           
                            LE: {
                                engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"]
                            }
                        }
                    },
                    "2021": {
                        trims: {
                            LE: {
                                engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            LE: {
                                engine: ["L4-110cid 1.8L FI 2ZR-FAE 139HP"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            LE: {
                                engine: ["L4-121cid 2.0L FI M20A-FKS 169HP"]
                            }
                        }
                    }
                }
            },
            Tacoma: {
                years: {
                    "2020": {
                        trims: {
                            SR5: {
                                engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"]
                            }
                        },
                    },
                    "2021": {
                        trims: {
                            SR5: {
                                engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            SR5: {
                                engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            SR5: {
                                engine: ["V6-3456cc 3.5L FI 2GR-FKS 278HP"]
                            }
                        }
                    }
                }
            },
        },
        Honda: {
            Civic: {
                years: {
                    "2020": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15B7 174HP", "L4-122cid 2.0L FI K20C2"]
                            }
                        }
                    },
                    "2021": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15B7 174HP", "L4-122cid 2.0L FI K20C2"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            Lx: {
                                engine: ["L4-122cid 2.0L FI K20C2"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            LX: {
                                engine: ["L4-122cid 2.0L FI K20C2"]
                            }
                        }
                    }
                }
            },
            Accord: {
                years: {
                    "2020": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"]
                            }
                        }
                    },
                    "2021": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            SE: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            EX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 192HP"]
                            }
                        }
                    }
                }
            },
            "CR-V": {
                years: {
                    "2020": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"]
                            }
                        }
                    },
                    "2021": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            LX: {
                                engine: ["L4-1497cc 1.5L FI Turbo L15BE 190HP"]
                            }
                        }
                    }
                }
            },
            "Pilot": {
                years: {
                    "2020": {
                        trims: {
                            LX: {
                                engine: ["V6-3471cc 3.5L FI J35Y6 280HP"]
                            }
                        }
                    },
                    "2021": {
                        trims: {
                            Touring: {
                                engine: ["V6-3471cc 3.5L FI J35Y6 280HP"]
                            }
                        }
                    },
                    "2022": {
                        trims: {
                            Sport: {
                                engine: ["V6-3471cc 3.5L FI J35Y6 280HP"]
                            }
                        }
                    },
                    "2023": {
                        trims: {
                            Sport: {
                                engine: ["V6-3471cc 3.5L FI J35Y6 285HP"]
                            }
                        }
                    }
                }
            }
        }
    }


    const handleMakeChange = (event) => {
        setMake(event.target.value);
        setModel(""); // Reset model selection when Make changes
        setYear(""); // Reset year selection when Make changes
        setTrim(""); // Reset trim selection when Make changes
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

    

    const getModels = () => (models[make] ? Object.keys(models[make]) : []);
    const getYears = () =>
        model && models[make][model] ? Object.keys(models[make][model].years) : [];
    const getTrims = () => 
        model && models[make][model].years[year] ? Object.keys(models[make][model].years[year].trims) : [];
    const getEngines = () =>
        trim && year && models[make][model].years[year].trims[trim] ? models[make][model].years[year].trims[trim].engine : [];

    const handleButtonClick = () => {
        console.log("Button clicked");
        console.log("Selections:", { make, model, year, trim, engine });
    };

    return (
        <div className="background">
            <div className="top-bar">
                <button className="top-button" onClick={() => navigate("/login")}>
                    Login
                </button>
                <button className="top-button" onClick={() => navigate("/register")}>
                    Register
                </button>
                <button className="top-button" onClick={() => navigate("/market")}>
                    Browse Parts
                </button>
            </div>
            {loggedIn ? (
                    <div className="display-username">
                        <p className="username-text">Welcome back, {sessionStorage.getItem("email")}</p>
                    </div>
                ) : null}
            <h1 className="heading">AutoMod</h1>
            <p className="heading-find-cars">
                Transforming Cars One Mod
                <br /> At A Time
            </p>

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

                        <div className="container-2">
                            <select
                                className="combobox-menu-model"
                                value={model}
                                onChange={handleModelChange}
                                disabled={!make}
                            >
                                <option value="">Select Model</option>
                                {getModels().map((modelOption) => (
                                    <option key={modelOption} value={modelOption}>
                                        {modelOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="container-3">
                            <select
                                className="combobox-menu-year"
                                value={year}
                                onChange={handleYearChange}
                                disabled={!model}
                            >
                                <option value="">Select Year</option>
                                {getYears().map((yearOption) => (
                                    <option key={yearOption} value={yearOption}>
                                        {yearOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="container-4">
                            <select
                                className="combobox-menu-trim"
                                value={trim}
                                onChange={handleTrimChange}
                                disabled={!year}
                            >
                                <option value="">Select Trim</option>
                                {getTrims().map((trimOption) => (
                                    <option key={trimOption} value={trimOption}>
                                        {trimOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="container-5">
                            <select
                                className="combobox-menu-engine"
                                value={engine}
                                onChange={handleEngineChange}
                                disabled={!trim}
                            >
                                <option value="">Select Engine</option>
                                {getEngines().map((engineOption) => (
                                    <option key={engineOption} value={engineOption}>
                                        {engineOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="custom-button"
                            onClick={handleButtonClick}
                            disabled={!make || !model || !year || !trim || !engine}
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

export default Homepage;
