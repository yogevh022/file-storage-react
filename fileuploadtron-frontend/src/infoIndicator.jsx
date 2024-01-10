import React from "react";

function InfoIndicator(props) {
    return (
        <div className={`infoIndicatorContainer ${props.addClass}`}>
            <img className='infoIndicatorIcon' src={props.icon}/>
            <div>{props.text}</div>
        </div>
    )
}

export default InfoIndicator;