import { Canvas } from '@react-three/fiber';
import '../../styles/CarView.css';
import Scene from './components/Scene';
import AutoIntelligence from '../AutoIntelligence';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../Header';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

function CarView() {
  const location = useLocation();
  const carData = location.state;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (carData) {
      console.log("Car Data received in CarView:", carData);
    }
  }, [carData]);

  const addToGarage = async(carData) => {
    const user = auth.currentUser;
    if (!user) return;
    const userGarageRef = collection(db, `users/${user.uid}/garage`);

    const carQuery = query(
      userGarageRef,
      where("make", "==", carData.make),
      where("model", "==", carData.model),
      where("year", "==", carData.year),
      where("trim", "==", carData.trim),
      where("engine", "==", carData.engine)
    );

    const carQuerySnapshot = await getDocs(carQuery);
    if(!carQuerySnapshot.empty){
      setMessage("Car already in garage");
      return;
    }
    try{
      const carRef = doc(userGarageRef);
      await setDoc(carRef, {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        trim: carData.trim,
        engine: carData.engine,
        timestamp: new Date(),
      });
      setMessage("Car added to garage!");
    } catch(error) {
      setMessage("Error adding car to garage");
    }
  };

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
      <Header />
      <AutoIntelligence />
      <button onClick={() => addToGarage(carData)} className='add-button'>Add to Garage</button>
      <p className='add-garage-message'>{message}</p>
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