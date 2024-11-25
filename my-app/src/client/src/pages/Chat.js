import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

function Chat() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="chat-container">
            <h1>Chat with AI Mechanic</h1>
            <p>
                Our AI mechanic is here to assist you with all your car modification needs.
                Start a conversation to get personalized recommendations.
            </p>
            <button className="custom-button" onClick={handleBack}>
                Back to Home
            </button>
        </div>
    );
}

export default Chat;
