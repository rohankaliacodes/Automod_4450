// AutoIntelligence.js
import React, { useState, useRef, useEffect } from "react";
import "../styles/AutoIntelligence.css";
import autoMechanic from "../assets/SVG/mechanic.svg";
import performanceTuner from "../assets/SVG/performance.svg";
import aesthethics from "../assets/SVG/design.svg";
import functional from "../assets/SVG/functional.svg";
import MarkdownIt from "markdown-it";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import axios from "axios";
import loadingGif from "../assets/loading.gif";
import uploadIcon from "../assets/SVG/upload.svg";
import closeIcon from "../assets/SVG/close.svg"; // Import the close SVG
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AutoIntelligence = ({ isChatPinned, onClick }) => {
  // ... (all your existing state variables and functions remain unchanged)
    const [isChatVisible, setIsChatVisible] = useState(true);
    const [displayName, setDisplayName] = useState("User");
    const [inputMessage, setInputMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState("Auto Mechanic");
    const [selectedIconType, setSelectedIconType] = useState("autoMechanic");
    const chatBoxRef = useRef(null);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [currentEventSource, setCurrentEventSource] = useState(null);
    const location = useLocation();
    const carData = location.state;
    const [messages, setMessages] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
    });

    const [selectedRecommendation, setSelectedRecommendation] = useState(null);

    const handleRecommendationClick = (recommendation) => {
        setSelectedRecommendation(recommendation);
    };

    const formatDataForChart = (recommendation) => {
        if (!recommendation) return [];

        let data = [];
        for (const key in recommendation["Before Modification"]) {
            data.push({
                attribute: key,
                before: recommendation["Before Modification"][key],
                after: recommendation["After Modification"][key],
                percentageChange: recommendation["Percentage Change"][key] || "N/A",
            });
        }
        return data;
    };

    const [selectedFile, setSelectedFile] = useState(null); // Single state for both image and media

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName || "User");
            } else {
                setDisplayName("User");
            }
        });
        let initialMessageText = `Welcome back, ${displayName}! Auto Intelligence is ready.`;
        if (carData) {
            initialMessageText = `Welcome back, ${displayName}! Auto Intelligence is ready. How can I help with your ${carData.make} ${carData.model} today?`;
        }
        setMessages([{ text: initialMessageText, sender: 'received', segments: [], html: md.render(initialMessageText) }]);
        return () => unsubscribe();
    }, [carData, displayName]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the selected file
            const reader = new FileReader();

            reader.onloadend = () => {
                if (file.type.startsWith("image/")) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: "image", sender: "sent", src: reader.result },
                    ]);
                } else if (file.type.startsWith("video/")) {
                    getVideoThumbnail(file).then((thumbnail) => {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                type: "video",
                                sender: "sent",
                                src: URL.createObjectURL(file),
                                thumbnail: thumbnail,
                            },
                        ]);
                    });
                } else if (file.type.startsWith("audio/")) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: "audio", sender: "sent", src: URL.createObjectURL(file) },
                    ]);
                }
            };

            if (file.type.startsWith("image/")) {
                reader.readAsDataURL(file); // Read image files as Data URL
            } else {
                // For audio/video, we don't need to read as Data URL *here*.
                // The preview is handled by URL.createObjectURL in the message display.
                // Just set the message immediately.
                if (file.type.startsWith("video/")) {
                    getVideoThumbnail(file).then((thumbnail) => {
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                type: "video",
                                sender: "sent",
                                src: URL.createObjectURL(file),
                                thumbnail: thumbnail,
                            },
                        ]);
                    });
                } else {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: "audio", sender: "sent", src: URL.createObjectURL(file) },
                    ]);
                }
            }
        }
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim()) {
            const userMessage = {
                text: inputMessage,
                sender: "sent",
                segments: [],
                html: md.render(inputMessage),
            };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInputMessage("");
        }

        if (!inputMessage.trim() && !selectedFile) {
            // Check for selectedFile
            return;
        }

        setLoadingResponse(true);
        setHasError(false);

        if (currentEventSource) {
            currentEventSource.close();
            setCurrentEventSource(null);
        }

        let apiUrl = "";
        if (selectedIconType === "autoMechanic") {
            apiUrl = "http://localhost:5001/api/autoMechanic/chat";
        } else if (
            selectedIconType === "performanceTuner" ||
            selectedIconType === "aesthethics" ||
            selectedIconType === "functional"
        ) {
            apiUrl = "http://localhost:5001/api/recommendations/getRecommendations";
        }

        if (!apiUrl) {
            console.error("No API URL defined for selected option.");
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    text: "Error: Could not determine AI type.",
                    sender: "received",
                    segments: [],
                    html: "<p>Error: Could not determine AI type.</p>",
                },
            ]);
            setLoadingResponse(false);
            return;
        }

        try {
            if (selectedIconType === "autoMechanic") {
                const formData = new FormData();
                formData.append("message", inputMessage);

                if (selectedFile) {
                    if (selectedFile.type.startsWith("image/")) {
                        formData.append("image", selectedFile); // Append as 'image'
                    } else {
                        formData.append("media", selectedFile); // Append as 'media'
                    }
                }

                if (carData) {
                    formData.append("carData", JSON.stringify(carData));
                }

                const initResponse = await fetch(apiUrl, {
                    method: "POST",
                    body: formData,
                });

                if (!initResponse.ok) {
                    const errorText = await initResponse.text();
                    throw new Error(
                        `Initial POST failed: ${initResponse.status} - ${errorText}`
                    );
                }

                const { sessionId, initialResponse } = await initResponse.json();
                setSessionId(sessionId);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: initialResponse,
                        sender: "received",
                        segments: [],
                        html: md.render(initialResponse),
                    },
                ]);
                setLoadingResponse(false);

                setSelectedFile(null); // Clear the selected file

                let streamUrl = `http://localhost:5001/api/autoMechanic/chat/stream?sessionId=${sessionId}`;

                if (carData) {
                    streamUrl += `&carData=${encodeURIComponent(
                        JSON.stringify(carData)
                    )}`;
                }

                const eventSource = new EventSource(streamUrl);
                setCurrentEventSource(eventSource);

                eventSource.onopen = () => {
                    // console.log("SSE connection opened");
                };

                eventSource.onmessage = (event) => {
                    const messageData = JSON.parse(event.data);
                    if (messageData.role === "model") {
                        setMessages((prevMessages) => {
                            const lastMessage = prevMessages[prevMessages.length - 1];
                            if (lastMessage && lastMessage.sender === "received") {
                                const updatedMessage = {
                                    ...lastMessage,
                                    text: lastMessage.text + messageData.text,
                                    html: md.render(lastMessage.text + messageData.text),
                                    segments: [
                                        ...lastMessage.segments,
                                        ...processSegments(
                                            messageData.text,
                                            messageData.supports,
                                            messageData.sources
                                        ),
                                    ],
                                };
                                return [...prevMessages.slice(0, -1), updatedMessage];
                            } else {
                                return [
                                    ...prevMessages,
                                    {
                                        text: messageData.text,
                                        sender: "received",
                                        segments: processSegments(
                                            messageData.text,
                                            messageData.supports,
                                            messageData.sources
                                        ),
                                        html: md.render(messageData.text),
                                    },
                                ];
                            }
                        });
                    }
                };

                eventSource.onerror = (error) => {
                    console.error("SSE error:", error);
                    setLoadingResponse(false);
                    eventSource.close();
                };
                eventSource.onclose = () => {
                    setLoadingResponse(false);
                    setCurrentEventSource(null);
                };
            } else if (
                selectedIconType === "performanceTuner" ||
                selectedIconType === "aesthethics" ||
                selectedIconType === "functional"
            ) {
                const inputData = {
                    Make: carData.make,
                    Model: carData.model,
                    Year: carData.year,
                    Trim: carData.trim,
                    Engine: carData.engine,
                    "Modification Type": (() => {
                        switch (selectedIconType) {
                            case "performanceTuner":
                                return "Performance";
                            case "aesthethics":
                                return "Aesthetics";
                            case "functional":
                                return "Functional";
                            default:
                                return "Performance";
                        }
                    })(),
                    "User Goal": inputMessage,
                };

                console.log(inputData);

                try {
                    setLoadingResponse(true);
                    const response = await axios.post(apiUrl, inputData);
                    if (response.data && response.data.recommendations) {
                        setRecommendations(response.data.recommendations);
                        let markdownOutput = formatRecommendationsToMarkdown(
                            response.data.recommendations
                        );
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                text: markdownOutput,
                                sender: "received",
                                segments: [],
                                html: md.render(markdownOutput),
                                recommendations: response.data.recommendations
                            },
                        ]);
                    } else {
                        console.warn(
                            "Recommendations API returned an empty or malformed response."
                        );
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            {
                                text: "Recommendations API returned an empty or malformed response.",
                                sender: "received",
                                segments: [],
                                html: "<p>Recommendations API returned an empty or malformed response.</p>",
                            },
                        ]);
                        setHasError(true);
                    }
                } catch (error) {
                    console.error("Error fetching recommendations:", error);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            text: "Failed to fetch recommendations. Please try again.",
                            sender: "received",
                            segments: [],
                            html: "<p>Failed to fetch recommendations. Please try again.</p>",
                        },
                    ]);
                    setHasError(true);
                } finally {
                    setLoadingResponse(false);
                }
            }
        } catch (error) {
            console.error("Error setting up SSE:", error);
            if (!hasError) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: "Failed to connect to AI service.",
                        sender: "received",
                        segments: [],
                        html: "<p>Failed to connect to AI service.</p>",
                    },
                ]);
                setHasError(true);
            }
            setLoadingResponse(false);
            if (currentEventSource) {
                currentEventSource.close();
                setCurrentEventSource(null);
            }
        }
        return () => {
            if (currentEventSource) {
                currentEventSource.close();
                setCurrentEventSource(null);
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
                segments.push({
                    text: plainText,
                    sources: [],
                    html: md.render(plainText),
                });
            }

            const segmentText = text.substring(support.startIndex, support.endIndex);
            const segmentSources = support.chunkIndices
                .map((index) => sources[index])
                .filter((source) => source !== undefined);

            segments.push({
                text: segmentText,
                sources: segmentSources,
                html: md.render(segmentText),
            });
            lastIndex = support.endIndex;
        }
        if (lastIndex < text.length) {
            const plainText = text.substring(lastIndex);
            segments.push({
                text: plainText,
                sources: [],
                html: md.render(plainText),
            });
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

        const triggerArea = {
            width: 700,
            height: 700,
            x: 0,
            y: window.innerHeight - 700,
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
        if (
            !isChatPinned &&
            chatBoxRef.current &&
            !chatBoxRef.current.contains(e.target)
        ) {
            setIsChatVisible(false);
        }
    };

    const handleResetChat = async () => {
        if (currentEventSource) {
            currentEventSource.close();
            setCurrentEventSource(null);
        }

        try {
            const response = await fetch(
                "http://localhost:5001/api/autoMechanic/reset",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Reset failed: ${response.status} - ${errorText}`);
            }
            let initialMessageText = `Welcome back, ${displayName}! Auto Intelligence ready.`;
            if (carData) {
                initialMessageText = `Welcome back, ${displayName}! Auto Intelligence ready.  How can I help with your ${carData.make} ${carData.model} today?`;
            }
            setMessages([
                {
                    text: initialMessageText,
                    sender: "received",
                    segments: [],
                    html: md.render(initialMessageText),
                },
            ]);
            setSessionId(null);
            setInputMessage("");
            setLoadingResponse(false);
        } catch (error) {
            console.error("Error resetting chat:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    text: "Failed to reset chat.",
                    sender: "received",
                    segments: [],
                    html: "<p>Failed to reset chat.</p>",
                },
            ]);
        }
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("click", handleDocumentClick);
            if (currentEventSource) {
                currentEventSource.close();
            }
        };
    }, [isChatPinned, currentEventSource]);

    const getVideoThumbnail = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.currentTime = 1;
            video.addEventListener("loadeddata", () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL("image/jpeg");
                resolve(thumbnail);
            });
            video.addEventListener("error", (e) => {
                console.error("Error loading video for thumbnail:", e);
                reject(e);
            });
        });
    };


  return (
    <div
      className={`chat-box ${isChatVisible ? "visible" : ""} ${
        isChatPinned ? "pinned" : ""
      }`}
      ref={chatBoxRef}
      onClick={onClick}
    >
      <div className="messages-area">
        {messages.map((message, index) => {
          if (message.type === "image") {
            return (
              <div key={index} className={`message ${message.sender}`}>
                <img
                  src={message.src}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            );
          } else if (message.type === "audio") {
            return (
              <div key={index} className={`message ${message.sender}`}>
                <audio controls src={message.src} />
              </div>
            );
          } else if (message.type === "video") {
            return (
              <div key={index} className={`message ${message.sender}`}>
                <video controls width="250">
                  <source src={message.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {message.thumbnail && (
                  <img
                    src={message.thumbnail}
                    alt="Video Thumbnail"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                )}
              </div>
            );
          } else {
            return (
              <div key={index} className={`message ${message.sender}`}>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: message.html }}
                />

                {message.segments &&
                  message.segments.some(
                    (segment) => segment.sources && segment.sources.length > 0
                  ) && (
                    <div className="message-sources">
                      {message.segments.map(
                        (segment, segmentIndex) =>
                          segment.sources &&
                          segment.sources.length > 0 && (
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
                      )}
                    </div>
                  )}
                {message.recommendations && (
                  <div className="recommendations-list">
                    <h4>Click to visualize changes:</h4>
                    {message.recommendations.map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecommendationClick(rec)}
                      >
                        {rec["Part Name"]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
        {loadingResponse && (
          <div className="message received">
            <img
              src={loadingGif}
              alt="Loading..."
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        )}

        {/* Wrap the conditional sections in a React Fragment */}
        <>
        {selectedRecommendation && (
  <div className="graph-container">
    <div className="graph-header">
      <h3>Modification Impact Visualization</h3>
      <button
        onClick={() => setSelectedRecommendation(null)}
        className="graph-close-button"
      >
        <img src={closeIcon} alt="Close" />
      </button>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formatDataForChart(selectedRecommendation)}>
        <XAxis dataKey="attribute" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="before" fill="#8884d8" name="Before Modification" />
        <Bar dataKey="after" fill="#82ca9d" name="After Modification" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
        </>
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            className="message-input"
          />

          <div className="options-bar">
            <div className="options-bar-group">
              <button title = "Clear Chat"className="reset-chat" onClick={handleResetChat}>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <g strokeWidth="0" />
                  <g strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M3 1C1.355 1 0 2.355 0 4v6c0 1.645 1.355 3 3 3h1v3l3-3v-1c0-.55-.45-1-1-1H3c-.57 0-1-.43-1-1V4c0-.555.445-1 1-1h10c.555 0 1 .445-1 1v4c0 .55.45 1 1-1V4c0-1.645-1.355-3-3-3zm8 7v3H8v2h3v3h2v-3h3v-2h-3V8zm0 0"
                    fill="#85858a"
                  />
                </svg>
              </button>
              <span className="option-name">{selectedOption}</span>
              <div className="option-icons" >
                <img
                  src={autoMechanic}
                  alt="Auto Mechanic"
                  title="Auto Mechanic: helps you figure issues with your car, how to fix them, and provides sources."
                  className={`option-icon ${
                    selectedIconType === "autoMechanic" ? "selected-icon" : ""
                   }`}
                  onClick={() =>
                    handleOptionClick("Auto Mechanic", "autoMechanic")
                  }
                />
                <img
                  src={performanceTuner}
                  alt="Performance Tuner"
                  title = "Performance Tuner: helps you provide specific performance upgrades for your car based on your needs"
                  className={`option-icon ${
                    selectedIconType === "performanceTuner" ? "selected-icon" : ""
                  }` }
                  onClick={() =>
                    handleOptionClick("Performance Tuner", "performanceTuner")
                  }
                />
                <img
                  src={aesthethics}
                  alt="Aesthethics"
                  title ="Aesthetics: helps you provide aesthetics upgrades for your car based on your needs"
                  className={`option-icon ${
                    selectedIconType === "aesthethics" ? "selected-icon" : ""
                  }`}
                  onClick={() => handleOptionClick("Aesthethics", "aesthethics")}
                />
                <img
                  src={functional}
                  alt="Functional Tuner"
                  title = "Functional Tuner: helps you provide functional upgrades for your car based on your needs"
                  className={`option-icon ${
                    selectedIconType === "functional" ? "selected-icon" : ""
                  }`}
                  onClick={() => handleOptionClick("Functional", "functional")}
                />
              </div>
            </div>
            <div className="upload-container">
              <input
                type="file"
                accept="image/*, audio/*, video/*"
                onChange={handleFileChange}
                id="combined-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="combined-upload" className="upload-button">
                <img
                  src={uploadIcon}
                  alt="Upload"
                  title= "Upload your video/photo"
                  className="upload-icon option-icon"
                />
              </label>
          </div>
          </div>
        </div>
        <button onClick={handleSendMessage} title = "Send your query" className="send-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-send -mb-0.5 -ml-0.5 !size-5"
          >
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </svg>
        </button>
      </div>
    </div>
  );
};

function formatRecommendationsToMarkdown(recommendations) {
  let markdownString = "## Recommendations:\n\n";

  recommendations.forEach((rec, index) => {
    markdownString += `### ${index + 1}.  ${rec["Part Name"]}\n\n`;
    markdownString += `* **Estimated Price:** ${rec["Estimated Price"]}\n`;
    markdownString += `* **Category:** ${rec["Category"]}\n`;
    markdownString += `* **Effect on the Car:** ${rec["Effect on the Car"]}\n\n`;

    if (rec["Before Modification"]) {
      markdownString += "**Before Modification:**\n";
      for (const key in rec["Before Modification"]) {
        markdownString += `    * ${key}: ${rec["Before Modification"][key]}\n`;
      }
      markdownString += "\n";
    }

    if (rec["After Modification"]) {
      markdownString += "**After Modification:**\n";
      for (const key in rec["After Modification"]) {
        markdownString += `    * ${key}: ${rec["After Modification"][key]}\n`;
      }
      markdownString += "\n";
    }

    if (rec["Percentage Change"]) {
      markdownString += "**Percentage Change:**\n";
      for (const key in rec["Percentage Change"]) {
        markdownString += `    * ${key}: ${rec["Percentage Change"][key]}\n`;
      }
      markdownString += "\n";
    }
    markdownString += "---\n";
  });

  return markdownString;
}

export default AutoIntelligence;