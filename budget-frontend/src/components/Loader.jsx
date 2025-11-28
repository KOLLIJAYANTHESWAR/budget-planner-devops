// src/components/Loader.jsx
import React from 'react';
import '../styles/components.css';

const Loader = () => {
    return (
        <div className="loader-overlay" aria-label="Loading...">
            <div className="loader-spinner"></div>
        </div>
    );
};

export default Loader;
