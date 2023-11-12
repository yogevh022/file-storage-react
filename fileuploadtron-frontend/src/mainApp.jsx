import FilesContainer from './filesContainer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from './topBar';
import BottomBar from './bottomBar';
import Darkscreen from './darkscreen';
import useFetch from './useFetch';

function MainApp(props) {
    const { collectionId } = useParams();
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");
    const { data: fileCollection, isLoading: isLoadingFileCollection} = useFetch(`/api/collections/${collectionId}/`);
    const [postData, setPostData] = useState(null);
    const [lastClipboard, setLastClipboard] = useState(null);
    const [unableClipboard, setUnableClipboard] = useState(false);
    const [isMenuActive, setIsMenuActive] = useState(false);

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
        <TopBar selectedFileCollection={fileCollection} currentUser={currentUser}/>
        <FilesContainer collectionId={collectionId} postDataResponse={postData} setPostDataResponse={setPostData} onCopyClipboard={handleCopyClipboard} onUnableCopyClipboard={handleUnableToCopy} />
        <BottomBar currentUser={currentUser} collectionId={collectionId} onPostResponseReceived={handlePostedDataResponse} lastClipboardCopy={lastClipboard} setMenuActive={setMenuActive} unableClipboard={unableClipboard}/>
        </div>
    )
}

export default MainApp;