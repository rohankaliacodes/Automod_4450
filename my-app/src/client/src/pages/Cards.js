
import React from "react";
import "../styles/Cards.css";

export default function Cards({ partsArray }) {
  return (
    <div className="cards-container">
      {partsArray.length === 0 ? (
        <p className="no-results">No parts found</p>
      ) : (
        partsArray.map((part, index) => (
          <div key={index} className="card">
            <div className="body">
              <div className="text">
                <span className="title">{part["Part Name"]}</span> {/* ✅ Ensures Part Name is displayed */}
                <span className="body-text">
                  Part Name: {part["Part Name"]} <br/>
                  Category: {part["Category"]} <br />
                  Price: {part["Price"]} <br />
                  {part["SKU Number"]}
                </span>
              </div>
              <div className="button-group">
                <a href={part["Link"]} target="_blank" rel="noreferrer" className="button">
                  Buy here
                </a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
