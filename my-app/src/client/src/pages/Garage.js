import {query, where, getDocs, collection, deleteDoc, doc} from 'firebase/firestore';
import {db, auth} from '../config/firebase';
import {useEffect, useState} from 'react';
import Header from './Header';
import '../styles/Garage.css';


function Garage(){

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

      return (
        <div className='garage-container'>
          <Header />
          <div className='garage-contents'>
            <h1 className="garage-heading">{auth.currentUser.displayName}'s Garage</h1>
                {garageContents.map((car) => (
                <div key={car.id} className="garage-car">
                    <h2>{car.year} {car.make} {car.model} {car.trim} {car.engine}</h2>
                    <button
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
                ))}
            </div>
        </div>
      )
      
    }
export default Garage;