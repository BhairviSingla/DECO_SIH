import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Gauge,
  Power,
  Sparkles,
  Thermometer,
  Waves,
  Wind,
  Clock3,
} from "lucide-react";

const tankData = {
  A: {
    name: "Tank A",
    status: "healthy",
    temperature: "27.4°C",
    ph: "7.2",
    oxygen: "6.8",
    ammonia: "0.15",
    salinity: "6.2",
    turbidity: "18",
    prediction: "Stable",
    predictionText:
      "Water conditions are expected to remain within the optimal range over the next 48 hours.",
  },

  B: {
    name: "Tank B",
    status: "healthy",
    temperature: "28.1°C",
    ph: "7.5",
    oxygen: "6.1",
    ammonia: "0.21",
    salinity: "7.1",
    turbidity: "21",
    prediction: "Stable",
    predictionText:
      "No major water-quality changes are predicted over the next 48 hours.",
  },

  C: {
    name: "Tank C",
    status: "critical",
    temperature: "29.2°C",
    ph: "6.4",
    oxygen: "2.1",
    ammonia: "0.71",
    salinity: "8.2",
    turbidity: "38",
    prediction: "Risk increasing",
    predictionText:
      "Ammonia is trending upward and may reach an unsafe level within the next 24 hours.",
  },
};

function ParameterCard({ icon: Icon, label, value, unit, danger }) {
  return (
    <div className={`analysis-parameter ${danger ? "danger" : ""}`}>
      <div className="analysis-parameter-icon">
        <Icon size={17} />
      </div>

      <span>{label}</span>

      <div>
        <strong>{value}</strong>
        {unit && <small>{unit}</small>}
      </div>
    </div>
  );
}

export default function TankAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  const tank = tankData[id?.toUpperCase()] || tankData.C;

  const critical = tank.status === "critical";

  return (
    <div className="app-page">
      <main className="analysis-container">

        {/* HEADER */}
        <header className="inner-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="inner-header-title">
            <span>LIVE MONITORING</span>
            <h1>{tank.name}</h1>
          </div>

          <div className={`header-status ${tank.status}`}>
            <span></span>
            {critical ? "Critical" : "Healthy"}
          </div>
        </header>

        {/* TANK VISUAL */}
        <section className={`tank-hero ${critical ? "critical" : ""}`}>
          <div className="tank-hero-top">
            <div>
              <span className="eyebrow">WATER HEALTH</span>
              <h2>{critical ? "Attention required" : "Conditions optimal"}</h2>
            </div>

            <div className="live-indicator">
              <span></span>
              LIVE
            </div>
          </div>

          <div className="water-visual">
            <div className="water-circle">
              <Waves size={43} />
            </div>

            <div className="water-ripples ripple-one"></div>
            <div className="water-ripples ripple-two"></div>
          </div>

          <p>
            Last updated <strong>just now</strong>
          </p>
        </section>

        {/* PARAMETERS */}
        <section className="analysis-section">
          <div className="analysis-section-heading">
            <div>
              <span className="eyebrow">SENSOR DATA</span>
              <h2>Water parameters</h2>
            </div>

            <Activity size={18} />
          </div>

          <div className="analysis-parameters-grid">

            <ParameterCard
              icon={Thermometer}
              label="Temperature"
              value={tank.temperature}
            />

            <ParameterCard
              icon={Gauge}
              label="pH Level"
              value={tank.ph}
              danger={critical}
            />

            <ParameterCard
              icon={Wind}
              label="Dissolved O₂"
              value={tank.oxygen}
              unit="mg/L"
              danger={critical}
            />

            <ParameterCard
              icon={Droplets}
              label="Ammonia"
              value={tank.ammonia}
              unit="ppm"
              danger={critical}
            />

            <ParameterCard
              icon={Waves}
              label="Salinity"
              value={tank.salinity}
              unit="ppt"
            />

            <ParameterCard
              icon={Activity}
              label="Turbidity"
              value={tank.turbidity}
              unit="NTU"
              danger={critical}
            />

          </div>
        </section>

        {/* AI PREDICTION */}
        <section className={`prediction-card ${critical ? "critical" : ""}`}>

          <div className="prediction-header">
            <div className="prediction-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>AI PREDICTION</span>
              <h2>Next 48 hours</h2>
            </div>
          </div>

          <div className="prediction-status">
            <div className={`prediction-status-icon ${critical ? "danger" : ""}`}>
              {critical ? (
                <AlertTriangle size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </div>

            <div>
              <strong>{tank.prediction}</strong>
              <p>{tank.predictionText}</p>
            </div>
          </div>

          {/* GRAPH */}
          <div className="prediction-graph">

            <div className="graph-y-labels">
              <span>1.2</span>
              <span>0.9</span>
              <span>0.6</span>
              <span>0.3</span>
              <span>0</span>
            </div>

            <div className="graph-area">

              <div className="graph-grid-line line-1"></div>
              <div className="graph-grid-line line-2"></div>
              <div className="graph-grid-line line-3"></div>
              <div className="graph-grid-line line-4"></div>

              <svg
                className="prediction-line"
                viewBox="0 0 500 160"
                preserveAspectRatio="none"
              >
                {critical ? (
                  <path
                    d="M0,125 C80,120 120,112 170,105 C230,95 260,85 310,72 C370,57 410,35 500,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                ) : (
                  <path
                    d="M0,90 C80,85 130,92 190,87 C260,82 320,88 390,84 C440,80 470,85 500,82"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                )}
              </svg>

              {critical && (
                <div className="danger-threshold">
                  <span>Unsafe threshold</span>
                </div>
              )}

            </div>
          </div>

          <div className="graph-labels">
            <span>Now</span>
            <span>12h</span>
            <span>24h</span>
            <span>36h</span>
            <span>48h</span>
          </div>

        </section>

        {/* RECOMMENDED ACTION */}
        {critical && (
          <section className="recommended-card">

            <div className="recommended-header">
              <div className="recommended-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <span>AI RECOMMENDATION</span>
                <h2>Recommended action</h2>
              </div>
            </div>

            <p>
              Start aeration and perform a partial water exchange to
              reduce stress and prevent further deterioration.
            </p>

            <div className="recommended-actions">

              <div className="recommended-action">
                <div>
                  <Wind size={18} />
                </div>

                <span>
                  <strong>Aerator</strong>
                  Turn ON
                </span>

                <CheckCircle2 size={18} />
              </div>

              <div className="recommended-action">
                <div>
                  <Droplets size={18} />
                </div>

                <span>
                  <strong>Water Pump</strong>
                  Partial exchange
                </span>

                <CheckCircle2 size={18} />
              </div>

            </div>

            <button
              className="activate-button"
              onClick={() => navigate("/actuation")}
            >
              <Power size={18} />
              View autonomous action
              <ChevronRight size={18} />
            </button>

          </section>
        )}

        {/* ACTION LOG */}
        <section className="action-log-section">

          <div className="analysis-section-heading">
            <div>
              <span className="eyebrow">SYSTEM ACTIVITY</span>
              <h2>Recent actions</h2>
            </div>

            <Clock3 size={18} />
          </div>

          <div className="action-timeline">

            <div className="timeline-item">
              <div className="timeline-dot success"></div>

              <div>
                <strong>Water parameters updated</strong>
                <span>Sensor network • Just now</span>
              </div>
            </div>

            {critical && (
              <>
                <div className="timeline-item">
                  <div className="timeline-dot warning"></div>

                  <div>
                    <strong>Ammonia trend detected</strong>
                    <span>AI Prediction • 2 min ago</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot action"></div>

                  <div>
                    <strong>Aerator recommendation generated</strong>
                    <span>AI Agent • 3 min ago</span>
                  </div>
                </div>
              </>
            )}

          </div>

        </section>

      </main>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">

        <button
          className="bottom-nav-item active"
          onClick={() => navigate("/dashboard")}
        >
          <Activity size={21} />
          <span>Home</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => navigate("/disease")}
        >
          <span className="nav-fish-icon">🐟</span>
          <span>Detect</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => navigate("/marketplace")}
        >
          <Droplets size={21} />
          <span>Market</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => navigate("/aquabot")}
        >
          <span className="nav-bot-icon">✦</span>
          <span>AquaBot</span>
        </button>

      </nav>
    </div>
  );
}