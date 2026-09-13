import React from "react";
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

const tanks = [
  {
    id: "A",
    name: "Tank A",
    status: "healthy",
    statusText: "Healthy",
    temperature: "27.4°C",
    ph: "7.2",
    oxygen: "6.8",
    ammonia: "0.15",
  },
  {
    id: "B",
    name: "Tank B",
    status: "healthy",
    statusText: "Healthy",
    temperature: "28.1°C",
    ph: "7.5",
    oxygen: "6.1",
    ammonia: "0.21",
  },
  {
    id: "C",
    name: "Tank C",
    status: "critical",
    statusText: "Critical",
    temperature: "29.2°C",
    ph: "6.4",
    oxygen: "2.1",
    ammonia: "0.71",
  },
];

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
              <strong>3</strong>
              <span>Healthy</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Warning</span>
            </div>

            <div>
              <strong>1</strong>
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

            <h3>Tank C needs attention</h3>

            <p>
              Ammonia is trending upward and may reach an unsafe
              level within the next 24 hours.
            </p>

            <button
              className="text-button"
              onClick={() => navigate("/tank/C")}
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
                className={`tank-card ${tank.status}`}
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

                  <div className={`status-pill ${tank.status}`}>
                    <span></span>
                    {tank.statusText}
                  </div>
                </div>

                <div className="tank-parameters">
                  <Parameter
                    icon={Thermometer}
                    label="Temp"
                    value={tank.temperature}
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