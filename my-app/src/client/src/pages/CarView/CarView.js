import { Canvas } from '@react-three/fiber';
import '../../styles/CarView.css'; // Import CarView.css !
import Scene from './components/Scene';
import AutoIntelligence from '../AutoIntelligence';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useEffect } from 'react';

function CarView() {
  const location = useLocation(); // Use useLocation hook
  const carData = location.state; // Access state passed from Home

  useEffect(() => {
    if (carData) {
      console.log("Car Data received in CarView:", carData);
      // You can now use carData to dynamically load the model or for other purposes
    }
  }, [carData]);

  return (
    <div className="car-view-container"> {/* Container for layout */}
      <AutoIntelligence /> {/* Chat UI on the left */}
      <div className="canvas-container"> {/* Container for Canvas to handle events */}
        <Canvas>
          <color attach="background" args={["#101010"]}/>
          <fog attach="fog" args={['#101010', 10, 20]} />
          <Scene carData={carData}/> {/* Pass carData to Scene */}
        </Canvas>
      </div>
    </div>
  )
}

export default CarView;