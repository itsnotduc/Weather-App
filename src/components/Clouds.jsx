import React from 'react';
import './Clouds.css';

const Clouds = () => {
    const createClouds = () => {
        const clouds = [];
        const cloudCount = 6;

        for (let i = 0; i < cloudCount; i++) {
            clouds.push(
                <div
                    className="cloud"
                    style={{
                        left: `${Math.random() * 100}vw`, 
                        top: `${Math.random() * 20}vh`,
                    }}
                    key={i}
                ></div>
            );
        }
        return clouds;
    };

    return (
        <div className="clouds" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 }}>
            {createClouds()}
        </div>
    );
};

export default React.memo(Clouds);
