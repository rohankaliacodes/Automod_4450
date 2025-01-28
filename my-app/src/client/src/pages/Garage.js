import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";
import { useState } from "react";
import "../styles/Garage.css";


function CarModel({ modelPath }) {
  // Load the GLB model
  const gltf = useLoader(GLTFLoader, modelPath);
  return <primitive object={gltf.scene} scale={1.5} />;
}


function Garage() {
  const [carType, setCarType] = useState("");
  return (
    <div className="garageBackground">
      <Canvas camera={{ position: [0, 2, 5] }}>
        <color attach={"background"} args={["#000000"]} />


        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Suspense wrapper */}
        <Suspense fallback={"loading..."}>
          <CarModel modelPath="/3DImages/lamborghini_urus_car.glb" />
        </Suspense>

        {/* Orbit controls for interaction */}
        <OrbitControls
            enableDamping={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            />
      </Canvas>
      <div className="overlay">
        <h1 className="garageText">My Garage</h1>
        <p className="garageText">Here you can view your collection of cars</p>
        <select
           className="garageButton" onChange={(e) => setCarType(e.target.value)}
        >
          Select Car
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
        </select>
      </div>
    </div>
  );
}

export default Garage;
