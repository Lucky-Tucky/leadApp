import React from 'react';
import './Watermark.css';

const Watermark = ({ name, email }) => {
    return (
        <div className="watermark-container">
            <div className="watermark-text">
                {name} <br /> {email}
            </div>
        </div>
    );
};

export default Watermark;
