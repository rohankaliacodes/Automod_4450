import { useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import { Box3, Vector3 } from "three";


const LoadModelView = ({ carIdentifier, onModelClick }) => { // Receive onModelClick
    const carModels = {
        "toyota-gr supra-2020": "Models/toyota_gr_supra/scene.gltf",
        "toyota-corolla-2020": "Models/corolla_2020_free_highpoly/scene.gltf",
        "honda-civic-2023": "Models/custom_honda_civic_type-r_2024/scene.gltf",
        "toyota-86-2020": "Models/toyota_gt86_3d_model_free/scene.gltf",
        "bmw-335i-2007": "Models/bmw_e92_stance/scene.gltf",
        "default-model": "Models/toyota_gr_supra/scene.gltf" // Default model path
    };

    // Use default model if carIdentifier is not found
    const modelPath = carModels[carIdentifier] || carModels["default-model"];


    // Target dimensions in world units (you can adjust these)
    const targetLength = 4.5; // Length of car in meters

    // Load the selected model dynamically based on modelPath
    const { scene } = useGLTF(modelPath);
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

        // Log the car identifier string
        if (carIdentifier) {
            console.log("Car Identifier:", carIdentifier);
        }

        console.log(`Model: ${carIdentifier}, Original size: ${size.x.toFixed(2)}x${size.y.toFixed(2)}x${size.z.toFixed(2)}, Scale: ${scaleFactor.toFixed(4)}`);

    }, [scene, carIdentifier]); // Dependency array now includes carIdentifier

    // Attach the onModelClick handler to the root of the model (the primitive)
    return <primitive object={scene} scale={modelScale} onClick={onModelClick} />;
};

export default LoadModelView;