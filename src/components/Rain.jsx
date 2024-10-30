import React from 'react';
import './Rain.css'
export const createRaindrops = () => {
    const drops = [];
    const dropCount = 100;

    for (let i = 0; i < dropCount; i++) {
        drops.push(
            <div
                className="rain__drop"
                style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                }}
                key={i}
            ></div>
        );
    }
    return drops;
};
const Rain = () => {
    return <div className="rain">{createRaindrops()}</div>;
};

export default Rain;