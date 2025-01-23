import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

function Market () {
    const navigate = useNavigate();
    const [make, setMake] = React.useState("");
    const [model, setModel] = React.useState("");
    const [year, setYear] = React.useState("");
    const [trim, setTrim] = React.useState("");
    const [engine, setEngine] = React.useState("");
    const [searchInput, setSearchInput] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [partsArray, setPartsArray] = React.useState([]);
    const [completePartsArray, setCompletePartsArray] = React.useState([]);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [searched, setSearched] = React.useState(false);
    const [price, setPrice] = React.useState(0);
    const [isChanged, setIsChanged] = React.useState(false);    




    async function fetchParts(event){
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:5001/api/parts/getParts", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({make, model, year, trim, engine})
            });
            const data = await response.json();
            if(data.status === "ok"){
                setPartsArray(data.data);
                setCompletePartsArray(data.data);
            }
            else{
                console.log(data.message);
                setMessage("No vehicle specified");
            }
        }
        catch(err){
            setMessage("Internal Server Error");
        }
    }

    async function searchParts(event){
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:5001/api/parts/searchPartsByName", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({partName: searchInput})
            });
            const data = await response.json();
            if(data.status === "ok"){
                setPartsArray(data.data);
                setCompletePartsArray(data.data);
            }
            else{
                setMessage("No parts found that match your query");
            }
        }
        catch(err){
            setMessage("Internal Server Error");
            console.log(err);        
        }
    };

    function sortPartsByCategory(category){
        if(category === "All"){
            resetPartsArray();
        }
        else{
            const sortedParts = completePartsArray.filter(part => part["Category"] === category);
            setPartsArray(sortedParts);
            setMessage("");
            if(sortedParts.length === 0){
                setMessage("No parts found in this category");
            }
        }
        
    }

    function sortPartsByPrice(price){
        const sortedParts = completePartsArray.filter(part => parseFloat(part["Price"].replace("$", "")) <= price);
        setPartsArray(sortedParts);
        if(sortedParts.length === 0){
            setMessage("No parts found in this price range");
        }
    }

    function resetPartsArray(){
        setPartsArray(completePartsArray);
        setMessage("");
    }

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


    return (
        <div className="marketplace-background">
            <div className="top-bar">
            
                        <button className="top-button" onClick={() => navigate("/")}>
                            Home
                        </button>
                        <button className="top-button" onClick={() => navigate("/login")}>
                            Login
                        </button>
                        <button className="top-button" onClick={() => navigate("/register")}>
                            Register
                        </button>


            </div>
            <h1>Browse Parts By Vehicle</h1>
            <p>Enter in your car's specifics and view compatible parts</p>
            <input className="searchBar" type="text" placeholder="Search By Part Name or SKU: " value={searchInput} onChange={(event) => setSearchInput(event.target.value)}></input>
            <button className="top-button" onClick={(event) => { searchParts(event); setSearched(true); }}>Search</button>
            <br></br>
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

            <button className="top-button" onClick={(event) => { fetchParts(event); setIsSubmitted(true); }}>Submit</button>
            <p>{message}</p>
            {isSubmitted || searched ? (
                    <div className="sort-buttons">
                        <button className="top-button" onClick={() => sortPartsByCategory("All")}>All</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Belts/Hoses/Cooling")}>Belts/Hoses/Cooling</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Body/Cable/Misc")}>Body/Cable/Misc</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Brake/Wheel Bearing")}>Brake/Wheel Bearing</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Electrical")}>Electrical</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Fuel/Emissions")}>Fuel/Emissions</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Heating/AC")}>Heating/AC</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Ignition/Filters")}>Ignition/Filters</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Tires/Accessories")}>Tires/Accessories</button>
                        <button className="top-button" onClick={() => sortPartsByCategory("Wipers/Lamps/Fuses")}>Wipers/Lamps/Fuses</button>
                    </div>
                ) : null}
            {isSubmitted || searched ? (
                <div className="price-slider">
                    <label>Filter By Price</label>
                    <input type="range" min="0" max="5000" step="1" onChange={(event) => { setPrice(event.target.value); setIsChanged(true); }}></input>

                    {isChanged ? (
                        <label>${price} or less</label>
                    ) : null}
                    <button className="top-button" onClick={() => sortPartsByPrice(price)}>Submit</button>
                </div>
            ) : null}
            <div className="market-grid">
                
                {isSubmitted || searched  ? (
                    partsArray.map((part, index) => (
                        <div key={index} className="part-item">
                            <p><strong>Part Name: {part["Part Name"]}</strong></p>
                            <p><strong>Category: {part["Category"]}</strong></p>
                            <p><strong>Price: {part["Price"]}</strong></p>
                            <p><strong>{part["SKU Number"]}</strong></p>
                            <a href={part["Link"]} target="_blank" rel="noreferrer">Buy Now</a>
                        </div>
                    ))
                ) : null}

            </div>
        </div>

    )
   
}

export default Market;