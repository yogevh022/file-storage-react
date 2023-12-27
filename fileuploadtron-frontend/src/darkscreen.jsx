import React, { useEffect, useState } from 'react';

function Darkscreen(props) {

    const [lastIsActive, setLastIsActive] = useState(false);

    useEffect(()=>{
        if (props.isMenuForced === false) {
            setLastIsActive(props.isActive);
        } else {
            setLastIsActive(true);
        }
    }, [props.isActive, props.isMenuForced])

    return (
        <div className={`ds ${lastIsActive ? 'active' : ''}`}></div>
    )
}

export default Darkscreen;