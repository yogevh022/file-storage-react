import React, { useState, useEffect } from 'react';
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
    const [isMenuForced, setIsMenuForced] = useState(false);
    const [unableClipboard, setUnableClipboard] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const [isOpenNewCollection, setIsOpenNewCollection] = useState(false);

    useEffect(()=>{
        if (uploadProgress > 0) {
            setIsMenuActive(true);
            setIsMenuForced(true);
        } else {
            setIsMenuActive(false);
            setIsMenuForced(false);
        }
    }, [uploadProgress]);

    const openNewCollection = () => {
        setIsOpenNewCollection(isOpenNewCollection=>{return !isOpenNewCollection});
    }

    const handlePostedDataResponse = (data) => {
        setPostData(data);
    }

    const setMenuActive = (isActive) =>{
        if (isMenuForced === false) {
            setIsMenuActive(isActive);
        }
    }

    return (
        <div className='globalContainer'>
            { !currentUser && !isLoadingUser && <Navigate to="/login"/>}
            <Darkscreen
                isActive={isMenuActive}
                isMenuForced={isMenuForced}
            />
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