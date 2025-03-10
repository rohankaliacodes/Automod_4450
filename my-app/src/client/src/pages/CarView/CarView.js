import { Canvas } from "@react-three/fiber";
import "../../styles/CarView.css";
import Scene from "./components/Scene";
import Header from "../Header";
import {useState} from "react";
import {db, auth} from "../../config/firebase";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";


function CarView() {

  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState(""); 

  const carOptions = [
    {make: "Toyota", model: "86", year: "2020", trim: "Base", engine: "H4-122cid 2.0L FI FA20 200HP"},
    {make: "Toyota", model: "86", year: "2020", trim: "Base", engine: "H4-122cid 2.0L FI FA20 205HP"},
  ]

  const addCarToGarage = async () => {
    const user = auth.currentUser;
    const userGarage = collection(db, "users/" + user.uid + "/garage");
    const carRef = doc(userGarage)

    const carData = {
      make: selected.split(" ")[0],
      model: selected.split(" ")[1],
      year: selected.split(" ")[2],
      trim: selected.split(" ")[3],
      engine: selected.split(" ")[4],
      timestamp: new Date()
    };

    try {
      await setDoc(carRef, carData);
      console.log("Car added to garage!");
      setMessage("Car added to garage!");
    }
    catch(error){
      console.log("Error adding car to garage:", error);
      setMessage("Error adding car to garage");
    }
  }

  const removeCarFromGarage = async (carID) => {
    const user = auth.currentUser;
    const carRef = doc(db, "users/" + user.uid + "/garage/" + carID);
    try {
      await deleteDoc(carRef);
      console.log("Car removed from garage!");
      setMessage("Car removed from garage!");
    } catch(error){
      console.log("Error removing car from garage:", error);
      setMessage("Error removing car from garage");
    }
  }
 
  return (
    <>
      <Header />
      <div className="App">
        <div className="select-car-container">
          <h1>Manage Garage</h1>
          <select onChange={(e) => setSelected(e.target.value)} className="select-car">
            <option value="">Select Car</option>
            {carOptions.map((car, index) => {
              return (
                <option key={index} value={`${car.make} ${car.model} ${car.year} ${car.trim} ${car.engine}`}>
                  {car.make} {car.model} {car.year} {car.trim} {car.engine}
                </option>
              )
            })}
          </select>
          <button 
            onClick={addCarToGarage}
            disabled={selected === ""}
            className="add-btn">
              Add Car to Garage
          </button>
          <span>{message}</span>
        </div>
        <Canvas>
          <color attach="background" args={["#101010"]} />
          <fog attach="fog" args={["#101010", 10, 20]} />
          <Scene />
        </Canvas>
      </div>
    </>
  );
}

export default CarView;
