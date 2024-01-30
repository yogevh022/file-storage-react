import React from "react";

function EmptyCollection(props) {
    const handleMessageLinkClick = () => {
        // 
    }

    return (
        <div className="emptyCollectionContainer">
            <div>It looks like {props.collectionName} is empty!</div>
            <div className="messageLink" onClick={handleMessageLinkClick}>:D</div>
        </div>
    )
}

export default EmptyCollection;
