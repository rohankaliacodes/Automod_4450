import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const LoadModelView = () => {
  const { scene } = useGLTF("Models/toyota_gr_supra/scene.gltf"); // Verify the path to your GLTF file
  
  const carBodyRef = useRef(null); // Reference to the car's body mesh

  // Initialize the car body reference on first load
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material.name === "CarPaint") { // Adjust material name if different
        carBodyRef.current = child;
      }
    });
  }, [scene]);


  return <primitive object={scene} scale={1} />;
};

export default LoadModelView;