import React from "react";
import "../styles/styles.css";

function Market () {
    const [make, setMake] = React.useState("");
    const [model, setModel] = React.useState("");
    const [year, setYear] = React.useState("");
    const [trim, setTrim] = React.useState("");
    const [engine, setEngine] = React.useState("");
    const [message, setMessage] = React.useState("");


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
        const selection = make + " " + model + " " + year + " " + trim + " " + engine;
        setMessage("You have selected: " + selection);    
    };

    return (
        <div className="container">
            <h1>Browse Parts By Vehicle</h1>
            <p>Enter in your car's specifics and view compatible parts</p>
            <div>
                <label>Make</label>
                <select value={make} onChange={handleMakeChange}>
                    <option value="">Select Make</option>
                    {makes.map((make) => (
                        <option key={make} value={make}>
                            {make}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Model</label>
                <select value={model} onChange={handleModelChange}>
                    <option value="">Select Model</option>
                    {getModels().map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Year</label>
                <select value={year} onChange={handleYearChange}>
                    <option value="">Select Year</option>
                    {getYears().map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Trim</label>
                <select value={trim} onChange={handleTrimChange}>
                    <option value="">Select Trim</option>
                    {getTrims().map((trim) => (
                        <option key={trim} value={trim}>
                            {trim}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Engine</label>
                <select value={engine} onChange={handleEngineChange}>
                    <option value="">Select Engine</option>
                    {getEngines().map((engine) => (
                        <option key={engine} value={engine}>
                            {engine}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleButtonClick}>Submit</button>
            <p>{message}</p>
        </div>

    )
   
}

export default Market;