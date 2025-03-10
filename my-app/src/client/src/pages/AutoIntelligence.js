import React, { useState, useRef, useEffect } from 'react';
import '../styles/AutoIntelligence.css';

import autoMechanic from '../assets/SVG/mechanic.svg';
import performanceTuner from '../assets/SVG/performance.svg';
import aesthethics from '../assets/SVG/design.svg';

const AutoIntelligence = () => {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isChatPinned, setIsChatPinned] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hello, how can I help you modify your car?', sender: 'received' },
        { text: 'I want to make it look more sporty.', sender: 'sent' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('Option Name Here');
    const [selectedIconType, setSelectedIconType] = useState(null); // Track selected icon type
    const chatBoxRef = useRef(null);

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { text: inputMessage, sender: 'sent' }]);
            setInputMessage('');
            // Simulate AI response (replace with actual AI logic)
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: 'Great choice!', sender: 'received' }]);
            }, 1000);
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleOptionClick = (option, iconType) => { // Add iconType parameter
        setSelectedOption(option);
        setSelectedIconType(iconType); // Set the selected icon type
    };

       const handleMouseMove = (e) => {
        if (isChatPinned) return;
        const containerRect = chatBoxRef.current.getBoundingClientRect();
         if (e.clientX < containerRect.width + 20) {
            setIsChatVisible(true);
        } else {
            setIsChatVisible(false);
        }
    };

    const handleChatBoxClick = (e) => {
        e.stopPropagation();
        setIsChatPinned(true);
        setIsChatVisible(true);
    };
     const handleDocumentClick = (e) => {
        if (isChatPinned && chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
            setIsChatPinned(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [isChatPinned]);

    return (
        <div
            className={`chat-box ${isChatVisible ? 'visible' : ''}`}
            ref={chatBoxRef}
            onClick={handleChatBoxClick}
        >
            <div className="messages-area">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <div className="input-container"> {/* NEW CONTAINER - wraps input and options */}
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyPress={(event) => event.key === 'Enter' ? handleSendMessage() : null}
                        className="message-input"
                    />
                    <div className="options-bar"> {/* Options bar INSIDE input-container */}
                        <span className="option-name">{selectedOption}</span>
                        <div className="option-icons">
                            <img
                                src={autoMechanic}
                                alt="Auto Mechanic"
                                className={`option-icon ${selectedIconType === 'autoMechanic' ? 'selected-icon' : ''}`} // Conditional class
                                onClick={() => handleOptionClick('Auto Mechanic', 'autoMechanic')} // Pass icon type
                            />
                            <img
                                src={performanceTuner}
                                alt="Performance Tuner"
                                className={`option-icon ${selectedIconType === 'performanceTuner' ? 'selected-icon' : ''}`} // Conditional class
                                onClick={() => handleOptionClick('Performance Tuner', 'performanceTuner')} // Pass icon type
                            />
                            <img
                                src={aesthethics}
                                alt="Aesthethics"
                                className={`option-icon ${selectedIconType === 'aesthethics' ? 'selected-icon' : ''}`} // Conditional class
                                onClick={() => handleOptionClick('Aesthethics', 'aesthethics')} // Pass icon type
                            />
                        </div>
                    </div>
                </div>
                <button onClick={handleSendMessage} className="send-button"></button>
            </div>
        </div>
    );
};

export default AutoIntelligence;