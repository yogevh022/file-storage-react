import React from "react";

function LoadingCircle(props) {
    return (
        <svg className='loadingSpinner' viewBox='0 0 50 50'>
            <circle className='innerPath' cx={25} cy={25} r={20} fill='none' strokeWidth={5}></circle>
        </svg>
    )
}

export default LoadingCircle;