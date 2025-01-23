import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { useLoader } from "@react-three/fiber";

function GLBCarModel({ modelPath }) {
  // Load the GLB model
  const gltf = useLoader(GLTFLoader, modelPath);
  return <primitive object={gltf.scene} scale={1.5} />;
}

function OBJCarModel({ modelPath }) {
    const obj = useLoader(OBJLoader, modelPath);
    return <primitive object={obj} scale={1.5} />;
}

function Garage() {
  return (
    <div style={{ height: "150vh", width: "100%" }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <color attach={"background"} args={["#f0f0f0"]} />


        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Suspense wrapper */}
        <Suspense fallback={"loading..."}>
          <OBJCarModel modelPath="/3DImages/bugatti.obj" />
        </Suspense>

        {/* Orbit controls for interaction */}
        <OrbitControls
            enableDamping={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            />
      </Canvas>
    </div>
  );
}

export default Garage;
