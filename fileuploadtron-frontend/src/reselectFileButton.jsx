import React from "react";
import SelectFileBorderSvg from "./selectFileButtonSvg";

function ReselectFileButton(props) {
    return (
        <div className={`reselectFileButton ${props.addClass ? props.addClass : ''}`} onClick={props.onClick}>
            <div>
                <img className="uploadImg" src={props.icon}/>
                <div>{props.title}</div>
            </div>
            <SelectFileBorderSvg/>
        </div>
    )
}

export default ReselectFileButton;