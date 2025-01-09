
import button from "../assets/search-button.png";
import "../styles/Home.css";
import Header from "../pages/Header"
import React, { useState } from "react";






export const Home = () => {
  const categories = ["Interior", "Wheel/Rim", "Engine Mod", "Suspension", "Exterior"];
  const [aiInput, setAiInput] = useState(""); // State to hold input for AI mechanic
 
  const handleCategoryClick = (category) => {
    console.log(`Category Selected: ${category}`);
  };

  const handleSearchClick = () => {
    console.log("Search button clicked!");
  };

  const handleAiInputChange = (event) => {
    setAiInput(event.target.value);
  };

  const handleAiSubmit = () => {
    console.log(`AI Mechanic Input: ${aiInput}`);
    // Implement the logic to process the input through your AI system
  };




  return (
    <div className="background">
        <Header/>

      <p className="heading-find-your">Find The Perfect Part For Your Car</p>

      <br>
      </br>
      <br></br>
      <br></br>

      <p className="heading-find-cars">
        Transforming Cars One Mod At A Time
      </p>


      <div className="form">
        <div className="list">

        </div>

        <div className="div-2">
          <div className="dropdowns">
            <select className="dropdown">
              <option value="" disabled selected>
                Make
              </option>
              <option value="Toyota">Toyota</option>
              <option value="Ford">Ford</option>
              <option value="BMW">BMW</option>
            </select>
            <select className="dropdown">
              <option value="" disabled selected>
                Model
              </option>
              <option value="Corolla">Corolla</option>
              <option value="Mustang">Mustang</option>
              <option value="M3">M3</option>
            </select>
            <select className="dropdown">
              <option value="" disabled selected>
                Year
              </option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
            <select className="dropdown">
              <option value="" disabled selected>
                Trim
              </option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Sport">Sport</option>
            </select>
            <select className="dropdown">
              <option value="" disabled selected>
                Modification Type
              </option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Sport">Sport</option>
            </select>


          </div>


        </div>

        <div className="ai-chat-section">
        <h2 className="ai-chat-header">Chat with our AI mechanic Tony</h2>
        <input
          className="ai-input"
          placeholder="Ask Tony for recommendations..."
          value={aiInput}
          onChange={handleAiInputChange}
        />
        <button className="ai-submit-button" onClick={handleAiSubmit}>
          Send
        </button>
      </div>

      
      <p className="text-wrapper">Or Browse Part By Category</p>


<div className="categories">
{categories.map((category, index) => (
  <div
    key={index}
    className="category-button"
    onClick={() => handleCategoryClick(category)}
  >
    {category}
  </div>
))}
    </div>


      </div>

      </div>
  
  );
};

export default Home;