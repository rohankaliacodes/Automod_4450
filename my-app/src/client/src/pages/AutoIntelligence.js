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
    const [selectedOption, setSelectedOption] = useState('Auto Mechanic');
    const [selectedIconType, setSelectedIconType] = useState('autoMechanic'); // Track selected icon type
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
                    <div className="options-bar">
                        <button className='reset-chat'><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path d="M3 1C1.355 1 0 2.355 0 4v6c0 1.645 1.355 3 3 3h1v3l3-3v-1c0-.55-.45-1-1-1H3c-.57 0-1-.43-1-1V4c0-.555.445-1 1-1h10c.555 0 1 .445 1 1v4c0 .55.45 1 1 1s1-.45 1-1V4c0-1.645-1.355-3-3-3zm8 7v3H8v2h3v3h2v-3h3v-2h-3V8zm0 0" fill="#85858a"/></svg></button>
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
                <button onClick={handleSendMessage} className="send-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send -mb-0.5 -ml-0.5 !size-5"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg></button>
            </div>
        </div>
    );
};

export default AutoIntelligence;