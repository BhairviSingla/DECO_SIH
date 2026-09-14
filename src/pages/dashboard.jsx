import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  Droplets,
  Fish,
  Mic,
  Plus,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Waves,
  Activity,
} from "lucide-react";



function Parameter({ icon: Icon, label, value }) {
  return (
    <div className="tank-parameter">
      <Icon size={14} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [tanks, setTanks] = useState([]);
  const [aiAlert, setAiAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const response = await fetch(
          "http://100.83.222.33:8000/api/tanks"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tank data");
        }

        const data = await response.json();

        setTanks(data);
      } catch (err) {
        console.error("Error fetching tanks:", err);
        setError("Unable to connect to AquaCore backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchTanks();
  }, []);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/ai-alert")
    .then((res) => res.json())
    .then((data) => {
      setAiAlert(data);
    })
    .catch((error) => {
      console.error("Error fetching AI alert:", error);
    });
}, []);

  const healthyCount = tanks.filter(
    (tank) => tank.status?.toLowerCase() === "good"
  ).length;

  const warningCount = tanks.filter(
    (tank) => tank.status?.toLowerCase() === "warning"
  ).length;

  const criticalCount = tanks.filter(
    (tank) => tank.status?.toLowerCase() === "critical"
  ).length;

  const criticalTank = tanks.find(
    (tank) => tank.status?.toLowerCase() === "critical"
  );

  return (
    <div className="app-page">
      <main className="dashboard-container">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <div className="brand-small">
              <Droplets size={19} />
              <span>DECO</span>
            </div>

            <h1>Good morning 👋</h1>
            <p>Here's your farm health overview.</p>
          </div>

          <button className="notification-button">
            <Bell size={21} />
            <span className="notification-dot"></span>
          </button>
        </header>

        {/* FARM HEALTH SUMMARY */}
        <section className="farm-summary-card">
          <div className="summary-top">
            <div>
              <p className="eyebrow">FARM HEALTH</p>
              <h2>Overall status</h2>
            </div>

            <div className="overall-status">
              <span></span>
              Good
            </div>
          </div>

          <div className="health-stats">
  <div>
    <strong>{healthyCount}</strong>
    <span>Healthy</span>
  </div>

  <div>
    <strong>{warningCount}</strong>
    <span>Warning</span>
  </div>

  <div>
    <strong>{criticalCount}</strong>
    <span>Critical</span>
  </div>
</div>
          <div className="health-progress">
            <div className="health-progress-good"></div>
            <div className="health-progress-warning"></div>
            <div className="health-progress-critical"></div>
          </div>
        </section>

        {/* AI ALERT */}
        <section className="ai-alert-card">
          <div className="ai-alert-icon">
            <Sparkles size={19} />
          </div>

          <div className="ai-alert-content">
            <div className="ai-alert-title">
              <span>AI EARLY WARNING</span>
              <span className="live-pill">LIVE</span>
            </div>

            <h3>
  {criticalTank
    ? `${criticalTank.name} needs attention`
    : warningCount > 0
    ? "Some tanks need attention"
    : "All tanks are looking good"}
</h3>

            <p>
              {criticalTank
                ? `Ammonia level is ${criticalTank.ammonia} ppm and requires immediate attention.`
                : warningCount > 0
                ? "Some tanks have warning-level conditions that should be monitored."
                : "All tanks are currently within safe conditions."}
            </p>

            <button
              className="text-button"
              onClick={() =>
  criticalTank && navigate(`/tank/${criticalTank.id}`)
}
            >
              View prediction
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* TANK SECTION */}
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR FARM</p>
              <h2>Tank monitoring</h2>
            </div>

            <button className="add-button">
              <Plus size={18} />
            </button>
          </div>

          <div className="tank-list">
            {tanks.map((tank) => (
              <button
                key={tank.id}
                className={`tank-card ${
                  tank.status === "good" ? "healthy" : tank.status
                }`}
                onClick={() => navigate(`/tank/${tank.id}`)}
              >
                <div className="tank-card-header">
                  <div className="tank-name-wrapper">
                    <div className="tank-icon">
                      <Waves size={19} />
                    </div>

                    <div>
                      <h3>{tank.name}</h3>
                      <span>Freshwater pond</span>
                    </div>
                  </div>

                  <div
                    className={`status-pill ${
                      tank.status === "good" ? "healthy" : tank.status
                    }`}
                  >
                    <span></span>
                    {tank.status === "good"
                      ? "Healthy"
                      : tank.status === "warning"
                      ? "Warning"
                      : "Critical"}
                  </div>
                </div>

                <div className="tank-parameters">
                  <Parameter
                    icon={Thermometer}
                    label="Temp"
                    value={`${tank.temperature}°C`}
                  />

                  <Parameter
                    icon={Activity}
                    label="pH"
                    value={tank.ph}
                  />

                  <Parameter
                    icon={Waves}
                    label="O₂"
                    value={`${tank.oxygen} mg/L`}
                  />

                  <Parameter
                    icon={Droplets}
                    label="NH₃"
                    value={`${tank.ammonia} ppm`}
                  />
                </div>

                <div className="tank-card-footer">
                  <span>Updated just now</span>
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">QUICK ACTIONS</p>
              <h2>What do you need?</h2>
            </div>
          </div>

          <div className="quick-actions">

            <button
              className="quick-action disease-action"
              onClick={() => navigate("/disease")}
            >
              <div className="quick-action-icon">
                <Fish size={22} />
              </div>

              <div>
                <strong>Disease Detection</strong>
                <span>Analyze a fish photo</span>
              </div>

              <ChevronRight size={17} />
            </button>

            <button
              className="quick-action bot-action"
              onClick={() => navigate("/aquabot")}
            >
              <div className="quick-action-icon">
                <Mic size={22} />
              </div>

              <div>
                <strong>Ask AquaBot</strong>
                <span>Get instant AI assistance</span>
              </div>

              <ChevronRight size={17} />
            </button>

            <button
              className="quick-action market-action"
              onClick={() => navigate("/marketplace")}
            >
              <div className="quick-action-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <strong>Verified Treatments</strong>
                <span>Browse recommended products</span>
              </div>

              <ChevronRight size={17} />
            </button>

          </div>
        </section>

        {/* AI ANALYSIS BUTTON */}
        <button
          className="full-analysis-button"
          onClick={() => navigate("/analysis")}
        >
          <div className="analysis-button-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <strong>AI Tank Analysis</strong>
            <span>View predictions & farm insights</span>
          </div>

          <ChevronRight size={20} />
        </button>

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
          <Fish size={21} />
          <span>Detect</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => navigate("/marketplace")}
        >
          <ShieldCheck size={21} />
          <span>Market</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => navigate("/aquabot")}
        >
          <Mic size={21} />
          <span>AquaBot</span>
        </button>

      </nav>
    </div>
  );
}