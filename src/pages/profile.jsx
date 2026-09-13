
import React, { useState } from "react";
import "./profile.css";

function Profile() {
  const [name, setName] = useState("Aqua User");
  const [email, setEmail] = useState("aquacore@example.com");
  const [location, setLocation] = useState("India");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* Page Header */}
        <div className="profile-heading">
          <div>
            <p className="profile-label">ACCOUNT</p>
            <h1>My Profile</h1>
            <p>Manage your AquaCore account and aquarium preferences.</p>
          </div>
        </div>

        {/* Profile Layout */}
        <div className="profile-grid">

          {/* Left Profile Card */}
          <div className="profile-card profile-overview">

            <div className="profile-avatar">
              🐠
            </div>

            <h2>{name}</h2>
            <p className="profile-email">{email}</p>

            <div className="profile-status">
              <span></span>
              Aquarium monitoring active
            </div>

            <div className="profile-stats">

              <div>
                <strong>1</strong>
                <span>Tank</span>
              </div>

              <div>
                <strong>12</strong>
                <span>Fish</span>
              </div>

              <div>
                <strong>28</strong>
                <span>Days Active</span>
              </div>

            </div>

          </div>

          {/* Right Settings Card */}
          <div className="profile-card profile-settings">

            <div className="section-title">
              <div>
                <h2>Personal Information</h2>
                <p>Update your account details</p>
              </div>

              <span className="edit-icon">✏️</span>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Account Type</label>
                <input
                  type="text"
                  value="AquaCore User"
                  disabled
                />
              </div>

            </div>

            <button className="save-button" onClick={handleSave}>
              {saved ? "✓ Changes Saved" : "Save Changes"}
            </button>

          </div>
        </div>

        {/* Aquarium Preferences */}
        <div className="profile-card preferences-card">

          <div className="section-title">
            <div>
              <h2>Aquarium Preferences</h2>
              <p>Customize how AquaCore monitors your aquarium</p>
            </div>

            <span className="settings-icon">⚙️</span>
          </div>

          <div className="preferences-list">

            <div className="preference-item">
              <div className="preference-icon">🔔</div>

              <div className="preference-text">
                <h3>Health Notifications</h3>
                <p>Receive alerts when unusual tank conditions are detected.</p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-icon">🤖</div>

              <div className="preference-text">
                <h3>AI Recommendations</h3>
                <p>Allow AquaCore to provide personalized aquarium suggestions.</p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-icon">📊</div>

              <div className="preference-text">
                <h3>Tank Monitoring</h3>
                <p>Continuously monitor your aquarium parameters.</p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

          </div>
        </div>

        {/* Account Section */}
        <div className="profile-card account-card">

          <div>
            <h2>Account</h2>
            <p>Manage your AquaCore account</p>
          </div>

          <div className="account-buttons">
            <button className="secondary-button">
              🔒 Change Password
            </button>

            <button className="logout-button">
              ↪ Log Out
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;
