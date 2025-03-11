import { Canvas } from '@react-three/fiber';
import '../../styles/CarView.css';
import Scene from './components/Scene';
import AutoIntelligence from '../AutoIntelligence';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function CarView() {
  const location = useLocation();
  const carData = location.state;

  useEffect(() => {
    if (carData) {
      console.log("Car Data received in CarView:", carData);
    }
  }, [carData]);

  // Function to create a car identifier string (Correctly called now)
  const getCarIdentifier = () => {
    if (carData) {
      console.log(`${carData.make}-${carData.model}-${carData.year}`.toLowerCase())
      return `${carData.make}-${carData.model}-${carData.year}`.toLowerCase();
    }
  };

  const carIdentifier = getCarIdentifier(); // Call the function to get carIdentifier

  return (
    <div className="car-view-container">
      <AutoIntelligence />
      <div className="canvas-container">
        <Canvas>
          <color attach="background" args={["#101010"]}/>
          <fog attach="fog" args={['#101010', 10, 20]} />
          <Scene carIdentifier={carIdentifier}/> {/* Pass the correctly derived carIdentifier */}
        </Canvas>
      </div>
    </div>
  )
}

export default CarView;