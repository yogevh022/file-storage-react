import FilesContainer from './filesContainer';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './topBar';
import BottomBar from './bottomBar';
import Darkscreen from './darkscreen';
import useFetch from './useFetch';

function MainApp() {
    const navigate = useNavigate();
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");
    const [postData, setPostData] = useState(null);
    const [lastClipboard, setLastClipboard] = useState(null);
    const [unableClipboard, setUnableClipboard] = useState(false);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [selectedFileCollection, setSelectedFileCollection] = useState("Public file collection");

    const handlePostedDataResponse = (data) => {
        setPostData(data);
    }

    const handleCopyClipboard = (fileCopied) => {
        setLastClipboard(fileCopied);
    }

    const handleUnableToCopy = () => {
        setUnableClipboard((unableClipboard)=>{return !unableClipboard});
    }

    const setMenuActive = (isActive) =>{
        setIsMenuActive(isActive);
    }

    return (
        <div className='globalContainer'>
        <Darkscreen isActive={isMenuActive}/>
        <TopBar selectedFileCollection={selectedFileCollection} currentUser={currentUser} isLoadingUser={isLoadingUser}/>
        <FilesContainer postDataResponse={postData} setPostDataResponse={setPostData} onCopyClipboard={handleCopyClipboard} onUnableCopyClipboard={handleUnableToCopy} />
        <BottomBar onPostResponseReceived={handlePostedDataResponse} lastClipboardCopy={lastClipboard} setMenuActive={setMenuActive} unableClipboard={unableClipboard}/>
        </div>
    )
}

export default MainApp;