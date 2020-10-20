import React from 'react';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <div className="br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3"> 
                    <img style={{paddingTop: '5px'}}src={brain} alt="brain"></img> 
                </div>
            </div>
        </div>
    )
}

export default Logo;