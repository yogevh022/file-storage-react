import React from "react";
import UserProfileWidget from "./UserProfileWidget";
import { useNavigate } from "react-router-dom";

function TopBar(props) {
    const navigate = useNavigate();
    const appLogo = `${process.env.REACT_APP_STATIC_URL}fileuploadinator.svg`;
    const logoutIcon = `${process.env.REACT_APP_STATIC_URL}logout.svg`;

    const handleLogout = (e) => {
        e.preventDefault();

        var api_logout_url = '/api/logout/';
        
        fetch(api_logout_url, {
            method: 'POST'
        })
        .then(res=>{
            if (res.ok) {
                navigate('/login');
            } else {
                console.log(res);
            }
        })
    }

    const goToUserCollections = () => {
        navigate('/collections');
    }

    return (
        <div className="topBar">
            <div className="topBarWrap">
                {/* { props.isLoadingUser && <div>Loading...</div> } */}
                {/* <img className="logoutButton" onClick={handleLogout} src={logoutIcon}/> */}
                { props.currentUser && 
                    <UserProfileWidget currentUser={props.currentUser} goToUserCollections={goToUserCollections} selectedFileCollection={props.selectedFileCollection} />
                }
                <img className="topBarLogo" src={appLogo} onClick={handleLogout}/>
            </div>
        </div>
    )
}

export default TopBar;