import React, { useState, useRef, useEffect } from 'react';
import '../styles/AutoIntelligence.css';
import autoMechanic from '../assets/SVG/mechanic.svg';
import performanceTuner from '../assets/SVG/performance.svg';
import aesthethics from '../assets/SVG/design.svg';
import MarkdownIt from 'markdown-it';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from 'react-router-dom';


const AutoIntelligence = ({ isChatPinned, onClick }) => { // Receive isChatPinned and onClick
    const [isChatVisible, setIsChatVisible] = useState(true); //  Keep local visibility state
    const [displayName, setDisplayName] = useState("User");
    const [inputMessage, setInputMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('Auto Mechanic');
    const [selectedIconType, setSelectedIconType] = useState('autoMechanic');
    const chatBoxRef = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [currentEventSource, setCurrentEventSource] = useState(null);
    const location = useLocation();
    const carData = location.state;
    const [messages, setMessages] = useState([]);

    // Initialize markdown-it
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true
    });

    // useEffect for setting the initial message and user authentication
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName || "User"); // Use displayName if available
            } else {
                setDisplayName("User");
            }
        });
        // Construct the initial message based on carData and displayName
        let initialMessageText = `Welcome back, ${displayName}! Auto Intelligence is ready.`;
        if (carData) {
            initialMessageText = `Welcome back, ${displayName}! Auto Intelligence is ready. How can I help with your ${carData.make} ${carData.model} today?`;
        }
        setMessages([{ text: initialMessageText, sender: 'received', segments: [], html: md.render(initialMessageText) }]);
        return () => unsubscribe(); // Cleanup the auth listener
    }, [carData, displayName]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, sender: 'sent', segments: [], html: md.render(inputMessage) };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputMessage('');
        setLoadingResponse(true);
        setHasError(false);

        // Close any existing EventSource connection
        if (currentEventSource) {
            currentEventSource.close();
            setCurrentEventSource(null);
        }

        let apiUrl = '';
        if (selectedIconType === 'autoMechanic') {
            apiUrl = 'http://localhost:5001/api/autoMechanic/chat';
        } else if (selectedIconType === 'performanceTuner' || selectedIconType === 'aesthethics') {
            apiUrl = 'http://localhost:5001/api/recommendations/getRecommendations';
        }

        if (!apiUrl) {
            console.error("No API URL defined for selected option.");
            setMessages(prevMessages => [...prevMessages, { text: 'Error: Could not determine AI type.', sender: 'received', segments: [], html: '<p>Error: Could not determine AI type.</p>' }]);
            setLoadingResponse(false);
            return;
        }

        let eventSource;

        try {
            if (selectedIconType === 'autoMechanic') {
                const initResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: inputMessage, carData: carData }),
                });

                if (!initResponse.ok) {
                    const errorText = await initResponse.text();
                    throw new Error(`Initial POST failed: ${initResponse.status} - ${errorText}`);
                }

                const { sessionId } = await initResponse.json();
                setSessionId(sessionId);

                let streamUrl = `http://localhost:5001/api/autoMechanic/chat/stream?sessionId=${sessionId}&message=${encodeURIComponent(inputMessage)}`;
                if (carData) {
                    streamUrl += `&carData=${encodeURIComponent(JSON.stringify(carData))}`;
                }
                eventSource = new EventSource(streamUrl);

                setCurrentEventSource(eventSource);

                eventSource.onopen = () => {
                    // No "Loading..." message here
                };

                eventSource.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);

                    setMessages(prevMessages => {
                        if (messageData.role === 'model') {
                            const lastMessage = prevMessages[prevMessages.length - 1];

                            if (lastMessage && lastMessage.sender === 'received') {
                                const updatedMessage = {
                                    ...lastMessage,
                                    text: lastMessage.text + messageData.text,
                                    html: md.render(lastMessage.text + messageData.text),
                                    segments: [...lastMessage.segments, ...processSegments(messageData.text, messageData.supports, messageData.sources)],
                                };
                                return [...prevMessages.slice(0, -1), updatedMessage];
                            } else {
                                return [...prevMessages, {
                                    text: messageData.text,
                                    sender: 'received',
                                    segments: processSegments(messageData.text, messageData.supports, messageData.sources),
                                    html: md.render(messageData.text)
                                }];
                            }
                        }
                        return prevMessages;

                    });
                };

                eventSource.onerror = (error) => {
                    console.error("SSE error:", error);
                    setLoadingResponse(false);
                    if (eventSource) {
                        eventSource.close();
                    }
                };

            } else if (selectedIconType === 'performanceTuner' || selectedIconType === 'aesthethics') {
                // ... recommendation API call (unchanged) ...
            }
        } catch (error) {
            console.error('Error setting up SSE:', error);
            if (!hasError) {
                setMessages(prevMessages => [...prevMessages, { text: 'Failed to connect to AI service.', sender: 'received', segments: [], html: '<p>Failed to connect to AI service.</p>' }]);
                setHasError(true);
            }
            setLoadingResponse(false);
            if (eventSource) {
                eventSource.close();
            }
        }
        return () => {
            if (currentEventSource) {
                currentEventSource.close();
            }
        };
    };
    const processSegments = (text, supports, sources) => {
        if (!supports || supports.length === 0) {
            return [{ text: text, sources: [], html: md.render(text) }];
        }

        let segments = [];
        let lastIndex = 0;

        supports.sort((a, b) => a.startIndex - b.startIndex);

        for (const support of supports) {
            if (support.startIndex > lastIndex) {
                const plainText = text.substring(lastIndex, support.startIndex);
                segments.push({ text: plainText, sources: [], html: md.render(plainText) });
            }

            const segmentText = text.substring(support.startIndex, support.endIndex);
            const segmentSources = support.chunkIndices
                .map(index => sources[index])
                .filter(source => source !== undefined);

            segments.push({ text: segmentText, sources: segmentSources, html: md.render(segmentText) });
            lastIndex = support.endIndex;
        }
        if (lastIndex < text.length) {
            const plainText = text.substring(lastIndex);
            segments.push({ text: plainText, sources: [], html: md.render(plainText) });
        }
        return segments;
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleOptionClick = (option, iconType) => {
        setSelectedOption(option);
        setSelectedIconType(iconType);
    };

     const handleMouseMove = (e) => {
        if (isChatPinned) return;

        // Larger trigger area in the bottom-left corner
        const triggerArea = {
            width: 700,  
            height: 700,
            x: 0,       // Starts at the left edge
            y: window.innerHeight - 700, // Starts 300px from the bottom
        };

        if (
            e.clientX >= triggerArea.x &&
            e.clientX <= triggerArea.x + triggerArea.width &&
            e.clientY >= triggerArea.y &&
            e.clientY <= triggerArea.y + triggerArea.height
        ) {
            setIsChatVisible(true);
        } else {
            setIsChatVisible(false);
        }
    };



    const handleDocumentClick = (e) => {
        // Hide only if NOT pinned, and click is outside chatBoxRef
        if (!isChatPinned && chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
            setIsChatVisible(false);
        }
    };

    // --- Reset Chat Handler ---
    const handleResetChat = async () => {
        if (currentEventSource) {
            currentEventSource.close();
            setCurrentEventSource(null);
        }

        try {
            const response = await fetch('http://localhost:5001/api/autoMechanic/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Reset failed: ${response.status} - ${errorText}`);
            }
            let initialMessageText = `Welcome back, ${displayName}! Auto Intelligence ready.`;
            if (carData) {
                initialMessageText = `Welcome back, ${displayName}! Auto Intelligence ready. How can I help with your ${carData.make} ${carData.model} today?`;
            }
            setMessages([{ text: initialMessageText, sender: 'received', segments: [], html: md.render(initialMessageText) }]);
            setSessionId(null);
            setInputMessage('');
            setLoadingResponse(false)

        } catch (error) {
            console.error('Error resetting chat:', error);
            setMessages(prevMessages => [...prevMessages, { text: 'Failed to reset chat.', sender: 'received', segments: [], html: '<p>Failed to reset chat.</p>' }]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleDocumentClick);
            if (currentEventSource) {
                currentEventSource.close();
            }
        };
    }, [isChatPinned, currentEventSource]);


    return (
        <div
            className={`chat-box ${isChatVisible ? 'visible' : ''} ${isChatPinned ? 'pinned' : ''}`}
            ref={chatBoxRef}
            onClick={onClick} // Use the passed onClick prop
        >
            <div className="messages-area">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="message-content" dangerouslySetInnerHTML={{ __html: message.html }} />

                        {message.segments && message.segments.some(segment => segment.sources && segment.sources.length > 0) && (
                            <div className="message-sources">
                                {message.segments.map((segment, segmentIndex) => (
                                    segment.sources && segment.sources.length > 0 && (
                                        <div key={segmentIndex} className="sources">
                                            {segment.sources.map((source, sourceIndex) => (
                                                <a
                                                    key={sourceIndex}
                                                    href={source.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="source-link"
                                                    title={source.uri}
                                                >
                                                    [{source.title}]
                                                </a>
                                            ))}
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loadingResponse && <div className="message received">Loading...</div>}
            </div>

            <div className="input-area">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyPress={(event) => { if (event.key === 'Enter') { event.preventDefault(); handleSendMessage(); } }}
                        className="message-input"
                    />
                    <div className="options-bar">
                        <button className='reset-chat' onClick={handleResetChat}><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M3 1C1.355 1 0 2.355 0 4v6c0 1.645 1.355 3 3 3h1v3l3-3v-1c0-.55-.45-1-1-1H3c-.57 0-1-.43-1-1V4c0-.555.445-1 1-1h10c.555 0 1 .445 1 1v4c0 .55.45 1 1-1V4c0-1.645-1.355-3-3-3zm8 7v3H8v2h3v3h2v-3h3v-2h-3V8zm0 0" fill="#85858a" /></svg></button>
                        <span className="option-name">{selectedOption}</span>
                        <div className="option-icons">
                            <img
                                src={autoMechanic}
                                alt="Auto Mechanic"
                                className={`option-icon ${selectedIconType === 'autoMechanic' ? 'selected-icon' : ''}`}
                                onClick={() => handleOptionClick('Auto Mechanic', 'autoMechanic')}
                            />
                            <img
                                src={performanceTuner}
                                alt="Performance Tuner"
                                className={`option-icon ${selectedIconType === 'performanceTuner' ? 'selected-icon' : ''}`}
                                onClick={() => handleOptionClick('Performance Tuner', 'performanceTuner')}
                            />
                            <img
                                src={aesthethics}
                                alt="Aesthethics"
                                className={`option-icon ${selectedIconType === 'aesthethics' ? 'selected-icon' : ''}`}
                                onClick={() => handleOptionClick('Aesthethics', 'aesthethics')}
                            />
                        </div>
                    </div>
                </div>
                <button onClick={handleSendMessage} className="send-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send -mb-0.5 -ml-0.5 !size-5"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg></button>
            </div>
        </div>
    );
};

export default AutoIntelligence;