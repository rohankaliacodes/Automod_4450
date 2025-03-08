import { useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import { Box3, Vector3 } from "three";

const LoadModelView = ({ selectedModel = "Supra" }) => {
  const carModels = {
    "Supra": "Models/toyota_gr_supra/scene.gltf",
    "Corrola": "Models/corolla_2020_free_highpoly/scene.gltf",
    "Typer": "Models/custom_honda_civic_type-r_2024/scene.gltf",
    "Eightsix": "Models/toyota_gt86_3d_model_free/scene.gltf",
    "Tacoma": "Models/01- Toyota.Tacoma.TRD.2020/718c52293bab4087a11464fbbd41465f_Textured.gltf"
  };
  
  // Target dimensions in world units (you can adjust these)
  const targetLength = 4.5; // Length of car in meters
  
  // Load the selected model
  const { scene } = useGLTF(carModels[selectedModel]);
  const [modelScale, setModelScale] = useState(1);
  const carBodyRef = useRef(null);

  // Calculate appropriate scale on model load
  useEffect(() => {
    // Find the car body for material adjustments (if needed)
    scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.name === "CarPaint") {
        carBodyRef.current = child;
      }
    });
    
    // Calculate model dimensions using bounding box
    const boundingBox = new Box3().setFromObject(scene);
    const size = new Vector3();
    boundingBox.getSize(size);
    
    // Determine the longest dimension (typically length for cars)
    const maxDimension = Math.max(size.x, size.z);
    
    // Calculate scale factor to normalize to target length
    const scaleFactor = targetLength / maxDimension;
    
    // Set the normalized scale
    setModelScale(scaleFactor);

    
    console.log(`Model: ${selectedModel}, Original size: ${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)}, Scale: ${scaleFactor.toFixed(4)}`);
    
  }, [scene, selectedModel]);

  return <primitive object={scene} scale={modelScale} />;
};

export default LoadModelView;
