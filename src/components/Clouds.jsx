import React, { useState, useEffect, useRef } from 'react';
import './Clouds.css';

const Clouds = ({ isCloudy }) => {
    const [clouds, setClouds] = useState([]);
    const intervalRef = useRef(null); // Use ref to store interval
    const cloudCount = 10; // Adjust the total number of clouds

    const createCloud = () => {
        const newCloud = {
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 20}vh`,
            key: Date.now() + Math.random()
        };
        setClouds(prevClouds => [...prevClouds, newCloud]);
    };

    useEffect(() => {
        if (isCloudy) {
            setClouds([]); // Clear existing clouds
            for (let i = 0; i < cloudCount; i++) {
                createCloud(); // Create initial batch of clouds
            }
            intervalRef.current = setInterval(createCloud, 2000); // Generate a new cloud every 2 seconds
        } else {
            clearInterval(intervalRef.current); // Clear interval when not cloudy
        }
        return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
    }, [isCloudy]);

    return (
        <div
            className="clouds"
            style={{
                position: 'absolute',
                top: '10%', /* Adjusted top value */
                left: 0,
                right: 0,
                pointerEvents: 'none',
                justifyContent: 'space-around',
                opacity: isCloudy ? 1 : 0,
                transition: 'opacity 2s ease-in-out'
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
