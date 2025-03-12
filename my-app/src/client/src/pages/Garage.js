import {query, where, getDocs, collection, deleteDoc, doc} from 'firebase/firestore';
import {db, auth} from '../config/firebase';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from './Header';
import '../styles/Garage.css';


function Garage(){
    const navigate = useNavigate();

    const [garageContents, setGarageContents] = useState([]);

    useEffect(() => {
        const fetchGarageContents = async () => {
          const user = auth.currentUser;
          if (!user) return;
          const userGarageRef = collection(db, `users/${user.uid}/garage`);
          const userGarageSnapshot = await getDocs(userGarageRef);
          const cars = userGarageSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setGarageContents(cars);
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
        return `/carImages/${car.year} ${car.make} ${car.model} ${car.trim}.png`;
    };

      return (
        <div className='garage-container'>
          <Header />
          <div className='garage-contents'>
            <h1 className="garage-heading">{auth.currentUser.displayName}'s Garage</h1>
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
                        setGarageContents((prev) => prev.filter((c) => c.id !== car.id));
                    }}
                    >
                    Remove
                    </button>
                  </div>
                </div>
                ))}
            </div>
        </div>
      )
      
    }
export default Garage;