import React from "react";
import SelectFileBorderSvg from "./selectFileButtonSvg";

function DragDropFile(props) {
    return (
        <div ref={props.containerRef} className="dragDropFileContainer">
            <div className="dragDropSvgContainer">
                <img className="dragDropUploadImage" src={props.uploadIcon}/>
                <SelectFileBorderSvg
                    addClass={'dragBorderCorrection'}
                    strokeWidth={8}
                />
            </div>
        </div>
    )
}

export default DragDropFile;