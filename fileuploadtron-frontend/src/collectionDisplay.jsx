import React from "react";

function CollectionDisplay(props) {
    const personIcon = `${process.env.REACT_APP_STATIC_URL}group.svg`;
    const fileIcon = `${process.env.REACT_APP_STATIC_URL}document.svg`;

    return (
        <div className="colDisplay">
            <div className="colName">{props.collectionName}</div>
            <div className="colInfo">
                <div className="colch colMembers"><img src={personIcon}/>{props.collectionMembers}</div>
                <div className="colch colFiles"><img src={fileIcon}/>{props.collectionFiles}</div>
            </div>
        </div>
    )
}

export default CollectionDisplay;