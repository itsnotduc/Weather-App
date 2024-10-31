import React, { useState, useEffect } from 'react';
import './Clouds.css';

const Clouds = ({ isCloudy }) => {
    const [clouds, setClouds] = useState([]);

    const createCloud = () => {
        if (isCloudy) {
            const newCloud = {
                left: `${Math.random() * 100}vw`,
                top: `${Math.random() * 20}vh`,
                key: Date.now()
            };
            setClouds(prevClouds => [...prevClouds, newCloud]);
        }
    };

    useEffect(() => {
        if (isCloudy) {
            for (let i = 0; i < 5; i++) {  // Generate initial batch of clouds
                createCloud();
            }
            const interval = setInterval(() => {
                createCloud();
            }, 2000); // Generate a new cloud every 2 seconds
            return () => clearInterval(interval);
        } else {
            const timeoutId = setTimeout(() => setClouds([]), 2000); // Clear clouds after fade-out transition
            return () => clearTimeout(timeoutId);
        }
    }, [isCloudy]);

    return (
        <div 
            className="clouds" 
            style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 0,
                opacity: isCloudy ? 1 : 0, // Adjust opacity based on isCloudy
                transition: 'opacity 2s ease-in-out' // Smooth transition
            }}>
            {clouds.map(cloud => (
                <div
                    className="cloud"
                    style={{ left: cloud.left, top: cloud.top }}
                    key={cloud.key}
                ></div>
            ))}
        </div>
    );
};

export default React.memo(Clouds);
