import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function App(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function logIn(event) {
        event.preventDefault();

        try{
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });
            const data = await response.json();
            if(data.status === "ok"){
                alert("User logged in");
                sessionStorage.setItem("email", email);
                navigate("/homepage");
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
            <h1>Login</h1>
            <form onSubmit={logIn}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type='submit'>Login</button>
                <br />
            </form>
            <p>{error}</p>
            <br />
        </div>
    )
}

export default App;