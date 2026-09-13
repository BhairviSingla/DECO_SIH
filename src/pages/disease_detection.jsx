import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

function DiseaseDetection() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [context, setContext] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setResult(null);
  };

  const handleAnalyze = () => {
    if (!image) return;

    setAnalyzing(true);
    setResult(null);

    // Frontend demo simulation
    setTimeout(() => {
      setAnalyzing(false);

      setResult({
        disease: "Bacterial Infection",
        confidence: 87,
        severity: "Moderate",
        risk: "High",
        recommendation:
          "Isolate affected fish and begin the recommended treatment. Monitor water quality closely.",
      });
    }, 1800);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setContext("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="disease-page">
      {/* Header */}
      <header className="disease-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Disease Detection</h1>
          <p>AI-powered fish health analysis</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="disease-content">
        {/* Intro Card */}
        <section className="disease-intro-card">
          <div className="intro-icon">
            <Sparkles size={25} />
          </div>

          <div>
            <h2>Check your fish health</h2>
            <p>
              Upload a clear photo of the affected fish and DECO AI will
              analyze visible symptoms.
            </p>
          </div>
        </section>

        {/* Upload Section */}
        {!image && (
          <section className="upload-card">
            <div className="upload-icon">
              <Camera size={34} />
            </div>

            <h2>Upload fish photo</h2>

            <p>
              Take a clear photo showing the fish and any visible symptoms.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />

            <button
              className="primary-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={19} />
              Upload Photo
            </button>

            <span className="upload-note">
              JPG, PNG or WEBP • Clear images work best
            </span>
          </section>
        )}

        {/* Image Preview */}
        {image && (
          <section className="preview-card">
            <div className="section-title">
              <h2>Fish photo</h2>

              <button
                className="change-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />

            <div className="image-preview">
              <img src={image} alt="Uploaded fish" />
            </div>
          </section>
        )}

        {/* Context */}
        {image && !result && (
          <section className="context-card">
            <label htmlFor="fish-context">
              Additional information
              <span>Optional</span>
            </label>

            <textarea
              id="fish-context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe anything unusual you noticed..."
              rows="3"
            />
          </section>
        )}

        {/* Analyze Button */}
        {image && !result && (
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing fish...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze with DECO AI
              </>
            )}
          </button>
        )}

        {/* Result */}
        {result && (
          <section className="result-card">
            <div className="result-header">
              <div className="result-success-icon">
                <CheckCircle2 size={25} />
              </div>

              <div>
                <span>AI ANALYSIS COMPLETE</span>
                <h2>Potential condition detected</h2>
              </div>
            </div>

            <div className="diagnosis-box">
              <div>
                <p className="small-label">Likely condition</p>
                <h3>{result.disease}</h3>
              </div>

              <div className="confidence">
                <strong>{result.confidence}%</strong>
                <span>confidence</span>
              </div>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <span>Severity</span>
                <strong>{result.severity}</strong>
              </div>

              <div className="status-item warning">
                <span>Contagion risk</span>
                <strong>
                  <AlertTriangle size={16} />
                  {result.risk}
                </strong>
              </div>
            </div>

            <div className="recommendation-box">
              <div className="recommendation-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <h4>DECO recommendation</h4>
                <p>{result.recommendation}</p>
              </div>
            </div>

            <button
              className="treatment-button"
              onClick={() => navigate("/marketplace")}
            >
              View Recommended Treatment
            </button>

            <button
              className="reset-button"
              onClick={resetAnalysis}
            >
              <RotateCcw size={17} />
              Analyze another fish
            </button>
          </section>
        )}
      </main>

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

        <button className="active">
          <span>✦</span>
          Disease
        </button>

        <button onClick={() => navigate("/aquabot")}>
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

export default DiseaseDetection;