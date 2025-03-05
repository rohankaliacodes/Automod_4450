import React from "react";
import corsa from "../assets/corsa.png";
import bds from "../assets/bds.png";
import brembo from "../assets/brembo.png";
import rw from "../assets/rw.png";
import af from "../assets/af.png";
import f from "../assets/f.png";

import "../styles/Companies.css";

function Companies() {
  const brands = [
    { name: "Corsa Performance", logo: corsa },
    { name: "BDS", logo: bds },
    { name: "Brembo", logo: brembo },
    { name: "RW Carbon", logo: rw },
    { name: "American Force", logo: af },
    { name: "Forgiato", logo: f },
  ];

  return (
    <div className="companies">
      <h2 className="section-title">Explore Our Premium Brands</h2>
      <div className="brands-container">
        {brands.map((brand, index) => (
          <div key={index} className="brand-card">
            <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
            <p className="brand-name">{brand.name}</p>
          </div>
        ))}
      </div>
      <a href="#" className="show-all-brands">
        Show All Brands →
      </a>
    </div>
  );
}

export default Companies;
