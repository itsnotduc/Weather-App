// src/components/Rain.jsx

import React, { useEffect, useState } from 'react';
import './Rain.css';

export const createRaindrops = (isRaining) => {
    const drops = [];
    const dropCount = 100; // Total number of raindrops

    for (let i = 0; i < dropCount; i++) {
        drops.push(
            <div
                className="rain__drop"
                style={{
                    left: `${Math.random() * 100}vw`, // Random horizontal position
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`, // Random fall speed
                    animationDelay: `${Math.random() * 2}s`, // Random delay for each drop
                    opacity: isRaining ? 0.7 : 0, // Change opacity based on raining state
                }}
                key={i}
            ></div>
        );
    }
    return drops;
};

const Rain = () => {
    const [isRaining, setIsRaining] = useState(false); // Track if it's raining

    // Use useEffect to set raining state
    useEffect(() => {
        // Set a timeout to start the rain after a brief moment
        const timer = setTimeout(() => {
            setIsRaining(true); // Start raining after a short delay
        }, 500); // Adjust the delay as needed (500ms here)
        
        return () => clearTimeout(timer); // Clean up the timer on unmount
    }, []);

    return (
        <div className="rain" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            {createRaindrops(isRaining)} {/* Pass isRaining state */}
        </div>
    );
};

export default React.memo(Rain); // Optimize with React.memo
