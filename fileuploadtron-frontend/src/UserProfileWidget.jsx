import React from "react";

function UserProfileWidget(props) {
    const tmpimg = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Ffiles-icon%2Ffiles-icon-6.jpg&f=1&nofb=1&ipt=890f5040352389a84f644d8c03d75652f0647b4f5bb5137e9621f09492cb5c9f&ipo=images";
    const logoutIcon = `${process.env.REACT_APP_STATIC_URL}logout.svg`;

    return (
        <div className="userProfileWidget">
            {/* <img className="logoutButton" src={logoutIcon}/> */}
            { props.currentUser && <div className="currentUsername">{props.currentUser.username}</div>}
            <div className="widgetSep">•</div>
            <div className="selectedFileCollection">{props.selectedFileCollection}</div>
        </div>
    )
}

export default UserProfileWidget;