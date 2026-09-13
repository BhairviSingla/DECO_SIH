import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Mic,
  Send,
  Sparkles,
  Droplets,
  Thermometer,
  Activity,
  AlertTriangle,
} from "lucide-react";

function AquaBot() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm AquaBot. I can help you monitor your tanks, understand alerts, and manage fish health.",
    },
  ]);

  const quickActions = [
    {
      icon: <Droplets size={17} />,
      text: "Check water quality",
    },
    {
      icon: <AlertTriangle size={17} />,
      text: "Explain today's alert",
    },
    {
      icon: <Activity size={17} />,
      text: "Tank health summary",
    },
    {
      icon: <Thermometer size={17} />,
      text: "Check temperature",
    },
  ];

  const getBotReply = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("water")) {
      return "Your water quality is currently stable. pH is 7.2, dissolved oxygen is 6.8 mg/L, and ammonia is within the safe range.";
    }

    if (lower.includes("alert")) {
      return "Tank 03 has an early-warning alert. Ammonia is showing an upward trend. DECO recommends checking filtration and increasing aeration.";
    }

    if (lower.includes("temperature")) {
      return "Tank temperatures are currently between 27°C and 29°C. Tank 02 is at 29°C and should be monitored.";
    }

    if (lower.includes("health")) {
      return "Overall tank health is good. 3 tanks are healthy, 1 needs monitoring, and no critical alerts are active.";
    }

    return "I can help with water quality, tank health, disease alerts, and recommended actions. Try one of the quick actions below.";
  };

  const sendMessage = (text = message) => {
    const finalMessage = text.trim();

    if (!finalMessage) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: finalMessage,
      },
    ]);

    setMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: getBotReply(finalMessage),
        },
      ]);
    }, 700);
  };

  return (
    <div className="aquabot-page">

      {/* Header */}
      <header className="aquabot-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="aquabot-avatar">
          <Bot size={22} />
        </div>

        <div className="aquabot-title">
          <h1>AquaBot</h1>
          <p>
            <span className="online-dot"></span>
            AI assistant • Online
          </p>
        </div>
      </header>

      {/* Chat */}
      <main className="aquabot-content">

        <div className="ai-welcome">
          <div className="welcome-sparkle">
            <Sparkles size={20} />
          </div>

          <div>
            <h2>Your aquaculture assistant</h2>
            <p>
              Ask me anything about your tanks, water quality, or fish health.
            </p>
          </div>
        </div>

        {/* Messages */}
        <section className="chat-area">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.type === "user" ? "user-message" : "bot-message"
              }`}
            >
              {msg.type === "bot" && (
                <div className="mini-bot-icon">
                  <Bot size={15} />
                </div>
              )}

              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="quick-section">
          <div className="quick-title">
            <h3>Quick actions</h3>
            <span>Tap to ask</span>
          </div>

          <div className="quick-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => sendMessage(action.text)}
                className="quick-action"
              >
                <span>{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Input */}
      <div className="aquabot-input-area">

        <div className="aquabot-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask AquaBot..."
          />

          <button className="voice-button">
            <Mic size={19} />
          </button>

          <button
            className="send-button"
            onClick={() => sendMessage()}
          >
            <Send size={18} />
          </button>
        </div>

        <p className="voice-note">
          You can also use voice commands in your local language
        </p>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/dashboard")}>
          <span>⌂</span>
          Home
        </button>

        <button onClick={() => navigate("/analysis")}>
          <span>◉</span>
          Analysis
        </button>

        <button onClick={() => navigate("/disease")}>
          <span>✦</span>
          Disease
        </button>

        <button className="active">
          <span>◌</span>
          AquaBot
        </button>

        <button onClick={() => navigate("/profile")}>
          <span>○</span>
          Profile
        </button>
      </nav>

    </div>
  );
}

export default AquaBot;