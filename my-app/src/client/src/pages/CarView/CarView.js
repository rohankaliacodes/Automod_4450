import { Canvas } from '@react-three/fiber';
import '../../styles/CarView.css'; // Import CarView.css !
import Scene from './components/Scene';
import AutoIntelligence from '../AutoIntelligence';

function CarView() {
  return (
    <div className="car-view-container"> {/* Container for layout */}
      <AutoIntelligence /> {/* Chat UI on the left */}
      <div className="canvas-container"> {/* Container for Canvas to handle events */}
        <Canvas>
          <color attach="background" args={["#101010"]}/>
          <fog attach="fog" args={['#101010', 10, 20]} />
          <Scene/>
        </Canvas>
      </div>
    </div>
  )
}

export default CarView;