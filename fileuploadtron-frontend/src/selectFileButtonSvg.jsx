import React from "react";

function SelectFileBorderSvg(props) {
    return (
        <svg className='selectFileButton'>
            <rect className={`selectFileButtonRect ${props.addClass && props.addClass}`} ry={'50%'} fill='none' strokeWidth={props.strokeWidth ? props.strokeWidth : 4}></rect>
        </svg>
    )
}

export default SelectFileBorderSvg;