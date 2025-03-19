import { Canvas } from '@react-three/fiber';
import '../../styles/CarView.css';
import Scene from './components/Scene';
import AutoIntelligence from '../AutoIntelligence';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../Header';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import  carGarage from '../../assets/SVG/garage.svg'; 

function CarView() {
    const location = useLocation();
    const carData = location.state;
    const [message, setMessage] = useState("");
    const [isChatPinned, setIsChatPinned] = useState(true); // Chat is initially pinned

    useEffect(() => {
        if (carData) {
            console.log("Car Data received in CarView:", carData);
        }
    }, [carData]);

    const addToGarage = async (carData) => {
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
        if (!carQuerySnapshot.empty) {
            setMessage("Car already in garage");
            return;
        }
        try {
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
        } catch (error) {
            setMessage("Error adding car to garage");
        }
    };

    const handleModelClick = () => {
        setIsChatPinned(false); // Unpin the chat when the model is clicked
    };

    const handleChatBoxClick = () => {
        setIsChatPinned(prevPinned => !prevPinned); // Toggle pin state
    };

    // Function to create a car identifier string
    const getCarIdentifier = () => {
        if (carData) {
            return `${carData.make}-${carData.model}-${carData.year}`.toLowerCase();
        }
        return "default-model"; // Return a default if no carData
    };

    const carIdentifier = getCarIdentifier();

    return (
        <div className="car-view-container">
            <Header />
            {/* Pass isChatPinned and the click handler to AutoIntelligence */}
            <AutoIntelligence isChatPinned={isChatPinned} onClick={handleChatBoxClick} />
            <button title="Add the car modification to your garage" onClick={(e) => addToGarage(carData)} className='add-button' >
    <img src={carGarage} alt="Add to Garage" className="add-garage-icon" />
</button>
            <p className='add-garage-message'>{message}</p>
            <div className="canvas-container">
                <Canvas>
                    <color attach="background" args={["#101010"]} />
                    <fog attach="fog" args={['#101010', 10, 20]} />
                    {/* Pass the model click handler down to the Scene */}
                    <Scene carIdentifier={carIdentifier} onModelClick={handleModelClick} />
                </Canvas>
            </div>
        </div>
    )
}

export default CarView;