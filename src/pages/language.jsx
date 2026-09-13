import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./language.css";

function Language() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="language-page">

      <div className="language-container">

        {/* Logo */}
        <div className="language-logo">
          <div className="language-logo-icon">🐠</div>
          <h1>AquaCore</h1>
        </div>

        {/* Progress */}
        <div className="language-progress">
          <span className="active"></span>
          <span></span>
          <span></span>
        </div>

        {/* Question */}
        <div className="language-heading">
          <p className="question-label">ONE QUICK QUESTION</p>

          <h2>What’s your<br />preferred language?</h2>

          <p>
            Choose the language you’d like<br />
            to use in AquaCore.
          </p>
        </div>

        {/* Options */}
        <div className="language-options">

          <button
            className={`language-option ${
              language === "English" ? "selected" : ""
            }`}
            onClick={() => setLanguage("English")}
          >
            <span className="language-flag">🇬🇧</span>

            <span className="language-name">
              English
              <small>English</small>
            </span>

            <span className="language-check">
              {language === "English" ? "✓" : ""}
            </span>
          </button>

          <button
            className={`language-option ${
              language === "Hindi" ? "selected" : ""
            }`}
            onClick={() => setLanguage("Hindi")}
          >
            <span className="language-flag">🇮🇳</span>

            <span className="language-name">
              हिंदी
              <small>Hindi</small>
            </span>

            <span className="language-check">
              {language === "Hindi" ? "✓" : ""}
            </span>
          </button>

          <button
            className={`language-option ${
              language === "Other" ? "selected" : ""
            }`}
            onClick={() => setLanguage("Other")}
          >
            <span className="language-flag">🌐</span>

            <span className="language-name">
              Other
              <small>More languages</small>
            </span>

            <span className="language-check">
              {language === "Other" ? "✓" : ""}
            </span>
          </button>

        </div>

        {/* Continue */}
        <button
          className="language-continue"
          onClick={handleContinue}
        >
          Continue
          <span>→</span>
        </button>

        <p className="language-footer">
          You can change this later in your profile.
        </p>

      </div>

    </div>
  );
}

export default Language;