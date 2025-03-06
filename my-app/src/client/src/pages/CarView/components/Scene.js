import { useThree } from '@react-three/fiber';
import { useEffect, startTransition } from 'react'; // <-- Corrected import here!
import {
  MeshReflectorMaterial,
  PresentationControls,
  Stage,
} from "@react-three/drei";
import { Suspense } from "react";
import LoadModelView from "./LoadModelView";


const Scene = () => {
  const { camera } = useThree();

  // Set the initial camera position and orientation
  useEffect(() => {
    startTransition(() => { // Wrap camera position update in startTransition
      camera.position.set(0, 1.5, 5); // Position above and in front of the car
      camera.lookAt(0, 0, 0);         // Look at the car's center
    });
  }, [camera]);

  return (
    <PresentationControls
      speed={1.5}
      global
      zoom={0.7}
      polar={[-0.1, Math.PI / 4]}
    >
      <Stage environment={"city"} intensity={0.6} contactShadow={false}> {/* Changed to "city" for testing */}
      <Suspense fallback={null}> 
          <LoadModelView />
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