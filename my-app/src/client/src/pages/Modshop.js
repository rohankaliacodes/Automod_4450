
import React, { useState, useEffect } from "react";
import "../styles/Modshop.css";
import Header from "../pages/Header";
import { useLocation } from "react-router-dom";
import Cards from "../pages/Cards";

import { auth, db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";


export default function Modshop() {
  const location = useLocation();
  const category = location.state?.category || null;

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
  const [recommendations, setRecommendations] = useState([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

   // ----- States to track user actions (same as Market.js) -----

   const [searched, setSearched] = useState(false);       // user clicked search
 

  const [price, setPrice] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if(category){
        fetchAllParts();
    }
  }, [category]);



 // 🔹 If we have a category from Home and we have parts, sort them
 useEffect(() => {
    if (category && completePartsArray.length > 0) {
      setIsSubmitted(true);
      sortPartsByCategory(category, completePartsArray);
    }
  }, [category, completePartsArray]);


useEffect(() => {
    const fetchGarageContents = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userGarageRef = collection(db, `users/${user.uid}/garage`);
        const userGarageSnapshot = await getDocs(userGarageRef);
        const cars = userGarageSnapshot.docs.map((doc) => doc.data());

        if(cars.length > 0){
            fetchRecommendations(cars);
        }
    };
    fetchGarageContents();
}, []);

async function fetchRecommendations(cars){
    try{
        const response = await fetch("http://localhost:5001/api/parts/getRecommendations", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({cars})
        });
        const data = await response.json();
        if(data.status === "ok"){
            setRecommendations(data.data);
        }
        else{
            setRecommendations([]);
        }
    } catch(err){
        console.log(err);
    }
}
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
        setIsSubmitted(true);
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
        setSearched(true);
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

// Real-time filter by price
function sortPartsByPrice(val) {
    const sortedParts = completePartsArray.filter((part) => {
      const numericPrice = parseFloat(part["Price"].replace("$", ""));
      return numericPrice <= val;
    });
    setPartsArray(sortedParts);
    if (sortedParts.length === 0) {
      setMessage("No parts found in this price range");
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
        <button className="search-button" title="Search for parts by name or SKU" onClick={searchParts}>
          <span className="search-icon">🔍</span
          ></button>
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
          <button className="search-button" title="Search for parts based on your car"onClick={fetchParts}>
          <span className="search-icon">🔍</span>
        </button>
        </div>
       
      </div>

      {/* Categories Section */}
      <div className="category-container">
        {["Heating/AC", "Belts/Hoses/Cooling", "Body/Cable/Misc", "Brake/Wheel Bearing", "Electrical",
          "Ignition/Filters", "Tires/Accessories", "Wipers/Lamps/Fuses", "Fuel/Emissions", "All"].map((cat) => (
            <span key={cat} className="category" title={`Display parts in the ${cat} category`}onClick={() => sortPartsByCategory(cat)}>{cat}</span>
        ))}
      </div>

         {/* Only show price slider if user has submitted or searched */}
         {isSubmitted || searched ? (
        <div className="price-slider">
          <label className="price-label">Filter By Price</label>
          <input
            className="slider"
            type="range"
            min="0"
            max="500"
            step="1"
            value={price} // Keep the slider controlled
            onChange={(event) => {
              const val = event.target.value;
              setPrice(val);
              setIsChanged(true);
              // Filter in real time:
              sortPartsByPrice(val);
            }}
          />
          {isChanged ? <label className="range-slider">${price} or less</label> : null}
        </div>
      ) : null}



      {/* Main Content: Parts + Recommendations side-by-side */}
      <div className="modshop-content">
        {/* Parts Display */}
        <div className="cards-scroll-container">
          <Cards partsArray={partsArray} />
        </div>

        {/* Recommendations UI - on the right side */}
        <div className="recommendations">
          <h2 className="rec-header">Recommended Parts for You</h2>
          <div className="recommendations-container">
          {recommendations.length > 0 ? (
            <div className="recommendations-list">
              {recommendations.map((data, index) => (
                <div key={index} className="part-item">
                  <p>
                    Part Name: {data.part["Part Name"]}
                  </p>
                  <p>
                    
                      For: {data.car.year} {data.car.make} {data.car.model}{" "}
                      {data.car.trim} {data.car.engine}
                
                  </p>
                  <p>
                    Category: {data.part["Category"]}
                  </p>
                  <p>
                    Price: {data.part["Price"]}
                  </p>
                  <p>
                    {data.part["SKU Number"]}
                  </p>
                  <a href={data.part["Link"]} target="_blank" rel="noreferrer">
                    Buy Now
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No recommendations found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}


