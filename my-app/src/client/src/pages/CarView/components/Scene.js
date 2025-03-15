import { useThree } from '@react-three/fiber';
import { useEffect, startTransition } from 'react';
import {
    MeshReflectorMaterial,
    PresentationControls,
    Stage,
} from "@react-three/drei";
import { Suspense } from "react";
import LoadModelView from "./LoadModelView";


const Scene = ({ carIdentifier, onModelClick }) => { // Receive onModelClick
    const { camera } = useThree();

    // Set the initial camera position and orientation
    useEffect(() => {
        startTransition(() => {
            camera.position.set(0, 1.5, 5);
            camera.lookAt(0, 0, 0);
        });
    }, [camera]);

    return (
        <PresentationControls
            speed={1.5}
            global
            zoom={0.7}
            polar={[-0.1, Math.PI / 4]}
        >
            <Stage environment={"city"} intensity={0.6} contactShadow={false}>
                <Suspense fallback={null}>
                    {/*Pass onModelClick to LoadModelView*/}
                    <LoadModelView carIdentifier={carIdentifier} onModelClick={onModelClick} />
                </Suspense>
            </Stage>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
                <planeGeometry args={[170, 170]} />
                <MeshReflectorMaterial
                    blur={[0, 50]}
                    resolution={2048}
                    mixBlur={1}
                    mixStrength={45}
                    roughness={0.8}
                    depthScale={2}
                    minDepthThreshold={0.3}
                    maxDepthThreshold={1.5}
                    color="#101010"
                    metalness={0.8}
                />
            </mesh>
        </PresentationControls>
    );
};

export default Scene;