import React, { useState } from 'react';
import useFetch from './useFetch';
import TopBar from './topBar';
import BottomBar from './bottomBar';
import Darkscreen from './darkscreen';
import CollectionsContainer from './collectionsContainer';
import { Navigate } from 'react-router-dom';

function Collections() {
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");
    const [postData, setPostData] = useState(null);
    const [lastClipboard, setLastClipboard] = useState(null);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [unableClipboard, setUnableClipboard] = useState(false);
    const [isOpenNewCollection, setIsOpenNewCollection] = useState(false);

    const openNewCollection = () => {
        setIsOpenNewCollection(isOpenNewCollection=>{return !isOpenNewCollection});
    }

    const handlePostedDataResponse = (data) => {
        setPostData(data);
    }

    const setMenuActive = (isActive) =>{
        setIsMenuActive(isActive);
    }

    return (
        <div className='globalContainer'>
            { !currentUser && !isLoadingUser && <Navigate to="/login"/>}
            <Darkscreen isActive={isMenuActive}/>
            <TopBar currentUser={currentUser} />
            <CollectionsContainer currentUser={currentUser} openNewCollection={openNewCollection} postData={postData} />
            <BottomBar
                currentUser={currentUser}
                onPostResponseReceived={handlePostedDataResponse}
                lastClipboardCopy={lastClipboard}
                setMenuActive={setMenuActive}
                unableClipboard={unableClipboard}
                formType='collection'
                isOpenNewCollection={isOpenNewCollection}
            />
        </div>
    )
}

export default Collections;