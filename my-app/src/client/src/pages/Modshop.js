import React, { useState, useEffect } from "react";
import "../styles/Modshop.css";
import Header from "../pages/Header";
import { useLocation } from "react-router-dom";
import Cards from "../pages/Cards";

export default function Modshop() {
  const location = useLocation();
  const category = location.state?.category || "";

  // State variables
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [trim, setTrim] = useState("");
  const [engine, setEngine] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [message, setMessage] = useState("");
  const [partsArray, setPartsArray] = useState([]);
  const [completePartsArray, setCompletePartsArray] = useState([]);

  useEffect(() => {
    if (make && model && year && trim && engine) {
        fetchParts(new Event("click"));  // Simulate an event trigger
    }
}, [make, model, year, trim, engine]);

  // Fetch all parts
  async function fetchAllParts() {
    try {
      const response = await fetch("http://localhost:5001/api/parts/getAllParts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.status === "ok") {
        setPartsArray(data.data);
        setCompletePartsArray(data.data);
        console.log("All parts retrieved:", data.data);
      } else {
        setMessage("No parts found");
      }
    } catch (err) {
      setMessage("Internal Server Error");
      console.error(err);
    }
  }

  // Fetch parts by vehicle details
  async function fetchParts(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/parts/getParts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ make, model, year, trim, engine }),
      });
      const data = await response.json();
      if (data.status === "ok") {
        setPartsArray(data.data);
        setCompletePartsArray(data.data);
        console.log("Filtered parts:", data.data);
      } else {
        setMessage("No vehicle specified");
      }
    } catch (err) {
      setMessage("Internal Server Error");
      console.error(err);
    }
  }

  // Search parts by name
  async function searchParts(event) {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/parts/searchPartsByName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partName: searchInput }),
      });
      const data = await response.json();
      if (data.status === "ok") {
        setPartsArray(data.data);
        setCompletePartsArray(data.data);
        console.log("Search results:", data.data);
      } else {
        setMessage("No parts found that match your query");
      }
    } catch (err) {
      setMessage("Internal Server Error");
      console.error(err);
    }
  }

  // Filter by category
  function sortPartsByCategory(category, data = completePartsArray) {
    if (category === "All") {
        setPartsArray(data);
    } else {
      const sortedParts = completePartsArray.filter((part) => part["Category"] === category);
      setPartsArray(sortedParts);
      setMessage(sortedParts.length === 0 ? "No parts found in this category" : "");
    }
  }

  // Handle vehicle dropdown selections
  const makes = ["Toyota", "Honda", "BMW"];
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
    },
    BMW: {
        "335i":{
            years: {
                "2007": {
                    trims: {
                        Base: {
                            engine: ["N54B30"]
                        }
                    }
                }
            }
        }
    }
}


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

  const getModels = () => (models[make] ? Object.keys(models[make]) : []);
  const getYears = () => (model && models[make][model] ? Object.keys(models[make][model].years) : []);
  const getTrims = () => (year && models[make][model]?.years[year] ? Object.keys(models[make][model].years[year].trims) : []);
  const getEngines = () => (trim && models[make][model]?.years[year]?.trims[trim] ? models[make][model].years[year].trims[trim].engine : []);

  return (
    <div className="main-container">
      <Header />

      {/* Search Box Section */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search By Part Name or SKU"
          className="search-input"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <div className="dropdown-container">
          <select className="dropdown" value={make} onChange={handleMakeChange}>
            <option value="">Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          <select className="dropdown" value={model} onChange={handleModelChange}>
            <option value="">Model</option>
            {getModels().map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <select className="dropdown" value={year} onChange={handleYearChange}>
            <option value="">Year</option>
            {getYears().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select className="dropdown" value={trim} onChange={handleTrimChange}>
            <option value="">Trim</option>
            {getTrims().map((trim) => (
              <option key={trim} value={trim}>{trim}</option>
            ))}
          </select>
          <select className="dropdown" value={engine} onChange={handleEngineChange}>
            <option value="">Engine</option>
            {getEngines().map((engine) => (
              <option key={engine} value={engine}>{engine}</option>
            ))}
          </select>
        </div>
        <button className="search-button" onClick={searchParts}>
          <span className="search-icon">🔍</span>
        </button>
      </div>

      {/* Categories Section */}
      <div className="category-container">
        {["Heating/AC", "Belts/Hoses/Cooling", "Body/Cable/Misc", "Brake/Wheel Bearing", "Electrical",
          "Ignition/Filters", "Tires/Accessories", "Wipers/Lamps/Fuses", "Fuel/Emissions", "All"].map((cat) => (
            <span key={cat} className="category" onClick={() => sortPartsByCategory(cat)}>{cat}</span>
        ))}
      </div>

       {/* Parts Display Section */}
       <div className="cards-scroll-container">
  <Cards partsArray={partsArray} />
</div>

    </div>
  );
}
