import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/language");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <div className="water-drop">
            <span>〰</span>
          </div>
        </div>

        <h1>DECO</h1>

        <p>Smart Aquaculture Health System</p>

        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>

        <span className="splash-tagline">
          Detect • Predict • Act • Protect
        </span>
      </div>
    </div>
  );
}