import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [litWicks, setLitWicks] = useState(Array(10).fill(false));
  const [showWelcome, setShowWelcome] = useState(false);
  
  const [candlePos, setCandlePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // --- NEW: Curtain State ---
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);

  const audioRef = useRef(null);
  const [hasMusicStarted, setHasMusicStarted] = useState(false);

  const getStartingPosition = () => ({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150
  });

  useEffect(() => {
    setCandlePos(getStartingPosition());
  }, []);

  // --- NEW: Handle Curtain Opening ---
  const handleOpenCurtain = () => {
    setIsCurtainOpen(true);
    
    // Start music as the curtain opens!
    if (!hasMusicStarted && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      setHasMusicStarted(true);
    }
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setCandlePos({ x: e.clientX, y: e.clientY }); 
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    setCandlePos({ x: e.clientX, y: e.clientY });

    const elementsUnderPointer = document.elementsFromPoint(e.clientX, e.clientY);
    const nextValidWickIndex = litWicks.indexOf(false);
    
    elementsUnderPointer.forEach(el => {
      if (el.dataset.wickIndex !== undefined) {
        const index = parseInt(el.dataset.wickIndex);
        
        if (index === nextValidWickIndex) {
          
          setLitWicks(prev => {
            const newWicks = [...prev];
            newWicks[index] = true;
            
            if (newWicks.every(w => w === true)) {
              setTimeout(() => setShowWelcome(true), 1200);
            }
            return newWicks;
          });

          setIsDragging(false);
          setCandlePos(getStartingPosition());
        }
      }
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setCandlePos(getStartingPosition());
  };

  const wickPositions = [
    { left: '15%', top: '50%' }, 
    { left: '30%', top: '53%' }, 
    { left: '50%', top: '55%' }, 
    { left: '70%', top: '53%' }, 
    { left: '85%', top: '50%' }, 

    { left: '10%', top: '68%' }, 
    { left: '28%', top: '72%' }, 
    { left: '50%', top: '75%' }, 
    { left: '72%', top: '72%' }, 
    { left: '90%', top: '68%' }  
  ];

  const nextValidWickIndex = litWicks.indexOf(false);

  return (
    <div 
      className="smart-board-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <audio ref={audioRef} src="/background-music.mp3" loop />

      {/* --- NEW: The Curtain Overlay --- */}
      <div 
        className={`curtain-overlay ${isCurtainOpen ? 'open' : ''}`} 
        onClick={handleOpenCurtain}
      >
        <div className="curtain left"></div>
        <div className="curtain right"></div>
        <div className="curtain-content">
          <h1>K/Talatuoya Tamil Maha Vidyalaya</h1>
          <p>Touch Screen to Begin</p>
        </div>
      </div>

      {!showWelcome ? (
        <>
          <div className="header-text">
            <h1>K/Talatuoya Tamil Maha Vidyalaya</h1>
          </div>

          <div className="main-stage">
            <div className="lamp-wrapper">
              <img src="/oil-lamp.png" alt="Traditional Lamp" className="lamp-image" />
              
              {wickPositions.map((pos, index) => {
                const isTargetWick = index === nextValidWickIndex;

                return (
                  <div 
                    key={index}
                    className="wick-hitbox"
                    data-wick-index={index}
                    style={{ top: pos.top, left: pos.left }}
                  >
                    {isDragging && isTargetWick && (
                      <div className="target-indicator"></div>
                    )}

                    {litWicks[index] && (
                      <div className="flame-container">
                        <div className="flame"></div>
                        <div className="glow"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="progress-text">
            {litWicks.filter(l => l).length} / 10 Lit
          </div>

          <div 
            className={`draggable-candle ${isDragging ? 'dragging' : ''}`}
            style={{ 
              left: `${candlePos.x}px`, 
              top: `${candlePos.y}px` 
            }}
            onPointerDown={handlePointerDown}
          >
            <img src="/candle.png" alt="Lighting Candle" />
            <div className="candle-flame-effect"></div>
          </div>
        </>
      ) : (
        <div className="welcome-screen">
          <h1 className="welcome-text">Welcome to Our Smart Room!</h1>
        </div>
      )}
    </div>
  );
}

export default App;