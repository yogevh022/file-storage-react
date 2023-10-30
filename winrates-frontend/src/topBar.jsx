import React from "react";

function TopBar(props) {
    return (
        <div className="topBar">
            <div className="selectedFileCollection">{props.selectedFileCollection}</div>
        </div>
    )
}

export default TopBar;