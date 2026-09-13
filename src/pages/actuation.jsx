import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wind,
  Waves,
  Utensils,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

function Actuation() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState({
    aerator: true,
    pump: false,
    feeder: false,
    exchange: false,
  });

  const toggleDevice = (device) => {
    setDevices((prev) => ({
      ...prev,
      [device]: !prev[device],
    }));
  };

  const controls = [
    {
      id: "aerator",
      name: "Aerator",
      description: "Increase dissolved oxygen",
      icon: <Wind size={22} />,
      active: devices.aerator,
    },
    {
      id: "pump",
      name: "Water Pump",
      description: "Circulate tank water",
      icon: <Waves size={22} />,
      active: devices.pump,
    },
    // {
    //   id: "feeder",
    //   name: "Auto Feeder",
    //   description: "Scheduled fish feeding",
    //   icon: <Utensils size={22} />,
    //   active: devices.feeder,
    // },
    // {
    //   id: "exchange",
    //   name: "Water Exchange",
    //   description: "Replace part of tank water",
    //   icon: <RefreshCw size={22} />,
    //   active: devices.exchange,
    // },
  ];

  return (
    <div className="actuation-page">

      {/* Header */}
      <header className="actuation-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Autonomous Control</h1>
          <p>DECO smart tank management</p>
        </div>
      </header>

      <main className="actuation-content">

        {/* AI Status */}
        <section className="autonomous-card">
          <div className="autonomous-top">
            <div className="zap-icon">
              <Zap size={23} />
            </div>

            <div>
              <span>AUTONOMOUS MODE</span>
              <h2>DECO is monitoring your tank</h2>
            </div>

            <div className="active-indicator">
              ACTIVE
            </div>
          </div>

          <p>
            Sensors continuously monitor water conditions and automatically
            activate connected equipment when action is required.
          </p>
        </section>

        {/* Current Action */}
        <section className="current-action-card">
          <div className="action-heading">
            <div className="action-status-icon">
              <Wind size={20} />
            </div>

            <div>
              <span>AI ACTION IN PROGRESS</span>
              <h2>Increasing aeration</h2>
            </div>
          </div>

          <div className="action-progress">
            <div className="progress-top">
              <span>Reason</span>
              <strong>Low oxygen trend detected</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>

            <div className="progress-bottom">
              <span>Started 4 min ago</span>
              <span>Monitoring...</span>
            </div>
          </div>
        </section>

        {/* Device Controls */}
        <section className="controls-section">
          <div className="section-heading">
            <h2>Tank equipment</h2>
            <span>Manual override</span>
          </div>

          <div className="controls-grid">
            {controls.map((control) => (
              <div
                className={`control-card ${
                  control.active ? "control-active" : ""
                }`}
                key={control.id}
              >
                <div className="control-top">
                  <div className="control-icon">
                    {control.icon}
                  </div>

                  <button
                    className={`toggle ${
                      control.active ? "toggle-on" : ""
                    }`}
                    onClick={() => toggleDevice(control.id)}
                    aria-label={`Toggle ${control.name}`}
                  >
                    <span></span>
                  </button>
                </div>

                <h3>{control.name}</h3>
                <p>{control.description}</p>

                <div
                  className={`device-status ${
                    control.active ? "device-on" : ""
                  }`}
                >
                  <span></span>
                  {control.active ? "Running" : "Standby"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Safety */}
        <section className="safety-card">
          <ShieldCheck size={21} />

          <div>
            <h3>AI safety protection</h3>
            <p>
              DECO prevents unsafe equipment combinations and stops actions
              automatically when sensor readings return to safe levels.
            </p>
          </div>
        </section>

        {/* Action Log */}
        <section className="action-log-section">
          <div className="section-heading">
            <h2>Recent actions</h2>
            <span>Today</span>
          </div>

          <div className="log-card">

            <div className="log-item">
              <div className="log-icon">
                <Wind size={16} />
              </div>

              <div className="log-info">
                <strong>Aerator activated</strong>
                <span>Low oxygen trend</span>
              </div>

              <div className="log-time">
                <Clock3 size={13} />
                10:42 AM
              </div>
            </div>

            <div className="log-item">
              <div className="log-icon">
                <RefreshCw size={16} />
              </div>

              <div className="log-info">
                <strong>Water circulation started</strong>
                <span>Ammonia trend detected</span>
              </div>

              <div className="log-time">
                <Clock3 size={13} />
                09:15 AM
              </div>
            </div>

            <div className="log-item">
              <div className="log-icon">
                <Utensils size={16} />
              </div>

              <div className="log-info">
                <strong>Feeding completed</strong>
                <span>Scheduled action</span>
              </div>

              <div className="log-time">
                <Clock3 size={13} />
                08:00 AM
              </div>
            </div>

          </div>
        </section>

        <div className="automation-note">
          <CheckCircle2 size={16} />
          All automated actions are recorded in your activity log.
        </div>

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

        <button onClick={() => navigate("/disease")}>
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

export default Actuation;