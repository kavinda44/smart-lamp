import React, { useState } from 'react';
import './App.css';

function App() {
  const [litLamps, setLitLamps] = useState(Array(10).fill(false));
  const [showWelcome, setShowWelcome] = useState(false);

  const handleTouch = (index) => {
    // Prevent re-triggering if already lit
    if (litLamps[index]) return;

    const newLamps = [...litLamps];
    newLamps[index] = true;
    setLitLamps(newLamps);

    // Check if all 10 wicks are now true
    if (newLamps.every(lamp => lamp === true)) {
      // Add a 1.2-second dramatic pause before showing the welcome message
      setTimeout(() => {
        setShowWelcome(true);
      }, 1200); 
    }
  };

  return (
    <div className="app-container">
      {!showWelcome ? (
        <div className="lamp-section">
          <h1 className="title">Smart Classroom Inauguration</h1>
          <p className="subtitle">Touch a wick to light the lamp</p>
          
          {/* Optional: Add a real lamp image here via CSS background */}
          <div className="lamp-container">
            <div className="wicks-layout">
              {litLamps.map((isLit, index) => (
                <div
                  key={index}
                  onClick={() => handleTouch(index)}
                  className="touch-target"
                >
                  {isLit ? (
                    <div className="flame-container">
                      <div className="flame"></div>
                      <div className="glow"></div>
                    </div>
                  ) : (
                    <div className="unlit-wick"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="progress">
            {litLamps.filter(l => l).length} / 10 Lit
          </div>
        </div>
      ) : (
        <div className="welcome-section">
          <h1 className="welcome-text">Welcome to Our Smart Room!</h1>
        </div>
      )}
    </div>
  );
}

export default App;