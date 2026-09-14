import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/splash";
import Dashboard from "./pages/dashboard";
import TankAnalysis from "./pages/tank_analysis";
import DiseaseDetection from "./pages/disease_detection";
import Marketplace from "./pages/marketplace";
import AquaBot from "./pages/aquabot";
import Actuation from "./pages/actuation";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Language from "./pages/language";


function Placeholder({ title }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
        background: "#f5f8f7",
        color: "#17201d",
      }}
    >
      <h1>{title}</h1>
      <p>This page will be added next.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/tank/:id" element={<TankAnalysis />} />

      <Route path="/analysis" element={<Navigate to="/tank/A" replace />} />

      <Route path="/disease" element={<DiseaseDetection />} />
       <Route
  path="/marketplace"
  element={<Marketplace />}
/>

      <Route
        path="/aquabot"
        element={<AquaBot />}
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/actuation"
        element={<Actuation />}
      />
<Route path="/language" element={<Language />} />
      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>
  );
}

export default App;