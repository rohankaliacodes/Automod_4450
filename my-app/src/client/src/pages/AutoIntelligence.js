import React, { useState, useRef, useEffect } from 'react';
import '../styles/AutoIntelligence.css';
import autoMechanic from '../assets/SVG/mechanic.svg';
import performanceTuner from '../assets/SVG/performance.svg';
import aesthethics from '../assets/SVG/design.svg';

const AutoIntelligence = () => {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isChatPinned, setIsChatPinned] = useState(isChatVisible);
    const [messages, setMessages] = useState([
        { text: 'Hello, how can I help you modify your car?', sender: 'received', segments: [] },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState('Auto Mechanic');
    const [selectedIconType, setSelectedIconType] = useState('autoMechanic');
    const chatBoxRef = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [currentEventSource, setCurrentEventSource] = useState(null); // Store the current EventSource


    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = { text: inputMessage, sender: 'sent', segments: [] };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputMessage('');
        setLoadingResponse(true);
        setHasError(false);

        // Close any existing EventSource connection before starting a new one
        if (currentEventSource) {
            currentEventSource.close();
            setCurrentEventSource(null); // Clear the old EventSource
        }

        let apiUrl = '';
        if (selectedIconType === 'autoMechanic') {
            apiUrl = 'http://localhost:5001/api/autoMechanic/chat';
        } else if (selectedIconType === 'performanceTuner' || selectedIconType === 'aesthethics') {
            apiUrl = 'http://localhost:5001/api/recommendations/getRecommendations';
        }

        if (!apiUrl) {
            console.error("No API URL defined for selected option.");
            setMessages(prevMessages => [...prevMessages, { text: 'Error: Could not determine AI type.', sender: 'received', segments: [] }]);
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
                    body: JSON.stringify({ message: inputMessage }),
                });

                if (!initResponse.ok) {
                    const errorText = await initResponse.text();
                    throw new Error(`Initial POST failed: ${initResponse.status} - ${errorText}`);
                }

                const { sessionId } = await initResponse.json();
                setSessionId(sessionId);

                eventSource = new EventSource(`http://localhost:5001/api/autoMechanic/chat/stream?sessionId=${sessionId}&message=${encodeURIComponent(inputMessage)}`);
                setCurrentEventSource(eventSource); // Store the new EventSource

                eventSource.onopen = () => {
                    setMessages(prevMessages => [...prevMessages, { text: "Loading...", sender: 'received', segments: [] }]);
                };

                eventSource.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);
                    setMessages(prevMessages => {
                        const lastMessage = prevMessages[prevMessages.length - 1];
                        const processSegments = (text, supports, sources) => {
                            if (!supports || supports.length === 0) {
                                return [{ text: text, sources: [] }];
                            }

                            let segments = [];
                            let lastIndex = 0;

                            supports.sort((a, b) => a.startIndex - b.startIndex);

                            for (const support of supports) {
                                if (support.startIndex > lastIndex) {
                                    segments.push({ text: text.substring(lastIndex, support.startIndex), sources: [] });
                                }

                                const segmentText = text.substring(support.startIndex, support.endIndex);
                                const segmentSources = support.chunkIndices
                                    .map(index => sources[index])
                                    .filter(source => source !== undefined);

                                segments.push({ text: segmentText, sources: segmentSources });
                                lastIndex = support.endIndex;
                            }
                            if (lastIndex < text.length) {
                                segments.push({ text: text.substring(lastIndex), sources: [] });
                            }
                            return segments;
                        };

                        if (lastMessage && lastMessage.sender === 'received' && lastMessage.text === "Loading...") {
                            const newSegments = processSegments(messageData.text, messageData.supports, messageData.sources);
                            return [...prevMessages.slice(0, -1), { text: messageData.text, sender: 'received', segments: newSegments }];
                        } else if (messageData.role === 'model') {
                            const newSegments = processSegments(messageData.text, messageData.supports, messageData.sources);
                            if (lastMessage && lastMessage.sender === 'received') {
                                return prevMessages.map((msg, index) =>
                                    index === prevMessages.length - 1
                                        ? { ...msg, text: msg.text + messageData.text, segments: [...msg.segments, ...newSegments] }
                                        : msg
                                );
                            } else {
                                return [...prevMessages, { text: messageData.text, sender: 'received', segments: newSegments }];
                            }
                        }
                        return prevMessages;
                    });
                };

                eventSource.onerror = (error) => {
                    console.error("SSE error:", error);
                    // Don't add error message here.
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
                setMessages(prevMessages => [...prevMessages, { text: 'Failed to connect to AI service.', sender: 'received', segments: [] }]);
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

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleOptionClick = (option, iconType) => {
        setSelectedOption(option);
        setSelectedIconType(iconType);
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
        setIsChatPinned(!isChatPinned);
        setIsChatVisible(true);
    };

    const handleDocumentClick = (e) => {
        if (!isChatPinned && chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
            setIsChatVisible(false);
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
            className={`chat-box ${isChatVisible ? 'visible' : ''} ${isChatPinned ? 'pinned' : ''}`}
            ref={chatBoxRef}
            onClick={handleChatBoxClick}
        >
            <div className="messages-area">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.segments && message.segments.length > 0 ? (
                            message.segments.map((segment, segmentIndex) => (
                                <React.Fragment key={segmentIndex}>
                                    <span className="segment-text">{segment.text}</span> {/* Wrap text in a span */}
                                    <div className="sources">
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
                                </React.Fragment>
                            ))
                        ) : (
                            message.text
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
                        onKeyPress={(event) => event.key === 'Enter' ? handleSendMessage() : null}
                        className="message-input"
                    />
                    <div className="options-bar">
                        <button className='reset-chat'><svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0" /><g strokeLinecap="round" strokeLinejoin="round" /><path d="M3 1C1.355 1 0 2.355 0 4v6c0 1.645 1.355 3 3 3h1v3l3-3v-1c0-.55-.45-1-1-1H3c-.57 0-1-.43-1-1V4c0-.555.445-1 1-1h10c.555 0 1 .445 1 1v4c0 .55.45 1 1-1V4c0-1.645-1.355-3-3-3zm8 7v3H8v2h3v3h2v-3h3v-2h-3V8zm0 0" fill="#85858a" /></svg></button>
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