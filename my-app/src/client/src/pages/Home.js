import button from "../assets/search-button.png";
import "../styles/Home.css";
import Header from "../pages/Header";
import React, { useState } from "react";
import axios from "axios";

export const Home = () => {
  const categories = ["Interior", "Wheel/Rim", "Engine Mod", "Suspension", "Exterior"];
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [trim, setTrim] = useState("");
  const [engine, setEngine] = useState("");
  const [modificationType, setModificationType] = useState(""); // State for modification type
  const [aiInput, setAiInput] = useState(""); // State to manage AI input
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const RecommendationCard = ({ recommendation }) => (
    <div className="card">
      <div className="content">
        <div>
          <h4>{recommendation["Part Name"]}</h4>
          <p>Price: {recommendation["Estimated Price"]}</p>
          <p>Category: {recommendation["Category"]}</p>
          <p>Effect: {recommendation["Effect on the Car"]}</p>
        </div>
      </div>
    </div>
  );

  const makes = ["Toyota", "Honda"];
  const models = {
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
  };

  const handleMakeChange = (event) => {
    setMake(event.target.value);
    setModel("");
    setYear("");
    setTrim("");
    setEngine("");
    setModificationType("");
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
    setYear("");
    setTrim("");
    setEngine("");
    setModificationType("");
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    setTrim("");
    setEngine("");
    setModificationType("");
  };

  const handleTrimChange = (event) => {
    setTrim(event.target.value);
    setEngine("");
    setModificationType("");
  };

  const handleEngineChange = (event) => {
    setEngine(event.target.value);
  };

  const handleModificationTypeChange = (event) => {
    setModificationType(event.target.value);
  };

  const handleAiInputChange = (event) => {
    setAiInput(event.target.value);
  };

  const handleAiSubmit = async () => {
    const inputData = {
      Make: make,
      Model: model,
      Year: year,
      Trim: trim,
      Engine: engine,
      "Modification Type": modificationType,
      "User Goal": aiInput,
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5001/api/recommendations/getRecommendations", inputData);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getModels = () => (models[make] ? Object.keys(models[make]) : []);
  const getYears = () => (model && models[make][model] ? Object.keys(models[make][model].years) : []);
  const getTrims = () => (year && models[make][model]?.years[year] ? Object.keys(models[make][model].years[year].trims) : []);
  const getEngines = () => (trim && models[make][model]?.years[year]?.trims[trim]?.engine || []);

  return (
    <div className="background">
      <Header />
      <p className="heading-find-your">Find The Perfect Part For Your Car</p>
  
      <div className="form">
        <p className="heading-find-cars">Transforming Cars One Mod At A Time</p>
  
        <div className="dropdowns">
          <select className="dropdown" value={make} onChange={handleMakeChange}>
            <option value="">Select Make</option>
            {makes.map((makeOption) => (
              <option key={makeOption} value={makeOption}>
                {makeOption}
              </option>
            ))}
          </select>
  
          <select
            className="dropdown"
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
  
          <select
            className="dropdown"
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
  
          <select
            className="dropdown"
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
  
          <select
            className="dropdown"
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
  
          <select
            className="dropdown"
            value={modificationType}
            onChange={handleModificationTypeChange}
            disabled={!engine}
          >
            <option value="">Select Modification Type</option>
            <option value="Aesthetics">Aesthetics</option>
            <option value="Performance">Performance</option>
            <option value="Functional">Functional</option>
          </select>
        </div>
  
        <div className="ai-mechanic-section">
          <input
            className="ai-input"
            type="text"
            placeholder="Type your query here..."
            value={aiInput}
            onChange={handleAiInputChange}
            maxLength={100}
          />
          <small
            style={{
              color: "red",
              fontSize: "12px",
              marginTop: "5px",
              display: "block",
            }}
          >
            {100 - aiInput.length} characters remaining
          </small>
          <button
            className="ai-submit-button"
            onClick={handleAiSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
  
        {recommendations && recommendations.length > 0 && (
          <div className="recommendations-grid">
            <h2>Recommendations:</h2>
            <div className="grid">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="card">
                  <div className="content">
                    <div>
                      <h4>{recommendation["Part Name"]}</h4>
                      <p>Price: {recommendation["Estimated Price"]}</p>
                      <p>Category: {recommendation["Category"]}</p>
                      <p>Effect: {recommendation["Effect on the Car"]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
  
        <p className="text-wrapper">Or Browse Part By Category</p>
        <div className="categories">
          {categories.map((category, index) => (
            <div key={index} className="category-button">
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
