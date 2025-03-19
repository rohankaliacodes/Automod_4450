import {query, where, getDocs, collection, deleteDoc, doc} from 'firebase/firestore';
import {db, auth} from '../config/firebase';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from './Header';
import '../styles/Garage.css';
import {Tooltip} from "react-tooltip";


function Garage(){
    const navigate = useNavigate();

    const [garageContents, setGarageContents] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGarageContents = async () => {
          const user = auth.currentUser;
          if (!user) return;
          const userGarageRef = collection(db, `users/${user.uid}/garage`);
          const userGarageSnapshot = await getDocs(userGarageRef);
          const cars = userGarageSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setGarageContents(cars);
          setMessage(cars.length === 0 ? 'Your garage is empty!' : '');
          
        }
        fetchGarageContents();
      }, []);

    const handleCarClick = (car) => {
      const carData ={
        make: car.make,
        model: car.model,
        year: car.year,
        trim: car.trim,
        engine: car.engine
      };
      navigate('/carView', {state: carData});
    };

    const getCarImage = (car) => {
        return `/carImages/${car.make} ${car.model} ${car.trim}.png`;
    };

      return (
        <div className='garage-container'>
          <Header />
          <div className='garage-contents'>
          <h1 className="garage-heading">{auth.currentUser ? `${auth.currentUser.displayName}'s Garage` : "Your Garage"}</h1>
              <p>{message}</p>
              <button className="info-tooltip" data-tooltip-id="test-tooltip" data-tooltip-content="Welcome to your garage! Click a car to view a 3D model of it.">
                    ?
                  </button>
                  <Tooltip id="test-tooltip" />

              <div className='garage-grid'>
                {garageContents.map((car) => (
                <div key={car.id} className="garage-car">
                  <div className='car-box'>
                    <img onClick={() => handleCarClick(car)} className="car-image" src={getCarImage(car)} alt="Car" />
                    <h2 className="car-name-header">{car.year} {car.make} {car.model} {car.trim}</h2>
                    <button
                    className='remove-button'
                    onClick={async () => {
                        const user = auth.currentUser;
                        if (!user) return;
                        const userGarageRef = doc(db, `users/${user.uid}/garage`, car.id);
                        await deleteDoc(userGarageRef);
                        setGarageContents((prev) => {
                          const updatedContents = prev.filter((c) => c.id !== car.id)
                          setMessage(updatedContents.length === 0 ? 'Your garage is empty!' : '');
                          return updatedContents;
                        });
                    }}
                    >
                    Remove
                    </button>
                    
                  </div>
                </div>
                ))}
            </div>
            </div>
        </div>
      )
      
    }
export default Garage;