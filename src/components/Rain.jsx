import React, { useEffect, useState } from 'react';
import './Rain.css';

export const createRaindrops = (isRaining, isHeartRain) => {
    const drops = [];
    const dropCount = 100;
    for (let i = 0; i < dropCount; i++) {
        drops.push(
            <div
                className={`rain__drop ${isHeartRain ? 'heart__drop' : ''}`}
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${isHeartRain ? Math.random() * 1.5 + 4 : Math.random() * 0.5 + 0.5}s`, // Corrected syntax
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: isRaining ? 0.7 : 0,
                }}
                key={i}
            ></div>
        );
    }
    return drops;
};

const Rain = ({ isRaining, isHeartRain }) => {
    return (
        <div className="rain" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: isRaining ? 1 : 0,
            transition: 'opacity 2s ease-in-out'
        }}>
            {createRaindrops(isRaining, isHeartRain)}
        </div>
    );
};

export default React.memo(Rain);
