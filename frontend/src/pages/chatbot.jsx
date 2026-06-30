import { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm Xplain AI. Ask me anything about your studies.",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/chatbot/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Unable to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer,
          confidence: data.confidence,
          matched: data.matched_question,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">

        <div className="chat-header">
          <div>
            <h2>Xplain AI</h2>
            <p>Your educational assistant</p>
          </div>

          <div className="status">
            <span className="online-dot"></span>
            Online
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.sender}`}
            >
              <div className={`message ${msg.sender}`}>
                {msg.text}

                {msg.sender === "bot" && msg.confidence && (
                  <div className="meta">
                    <small>
                      Confidence: {(msg.confidence * 100).toFixed(1)}%
                    </small>

                    <small>
                      Matched: {msg.matched}
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-wrapper bot">
              <div className="message bot typing">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}