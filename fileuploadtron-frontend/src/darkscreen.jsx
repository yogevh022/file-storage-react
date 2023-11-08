import React from 'react';

function Darkscreen(props) {
    return (
        <div className={`ds ${props.isActive ? 'active' : ''}`}></div>
    )
}

export default Darkscreen;