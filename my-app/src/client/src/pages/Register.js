import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 


function App(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    async function registerUser(event){
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password, username})
            });
            const data = await response.json();
            if(data.status === "ok"){
                alert("User registered");
                navigate("/login");
            }
            else{
                console.log(data.message);
                setError(data.message);
            }
        }
        catch(err){
            console.log(err);
            setError("Internal Server Error");
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={registerUser}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type='submit'>Register</button>
                <br />
            </form>
            <p>{error}</p>
            <br />
        </div>
    )
}

export default App;