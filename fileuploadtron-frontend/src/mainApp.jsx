import FilesContainer from './filesContainer';
import ProgressContainer from "./progressContainer";
import React, { useEffect, useState,useRef } from 'react';
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
    const [lastDeleted, setLastDeleted] = useState(null);
    const [unableClipboard, setUnableClipboard] = useState(false);
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isMenuForced, setIsMenuForced] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0.0);
    const filesContainerRef = useRef();
    const dragContainerUiRef = useRef();
    const bottomBarRef = useRef();

    useEffect(()=>{
        if (uploadProgress > 0) {
            setIsMenuActive(true);
            setIsMenuForced(true);
        } else {
            setIsMenuActive(false);
            setIsMenuForced(false);
        }
    }, [uploadProgress]);

    const handlePostedDataResponse = (data) => {
        setPostData(data);
    }

    const handleCopyClipboard = (fileCopied) => {
        setLastClipboard(fileCopied);
    }

    const handleUnableToCopy = () => {
        setUnableClipboard((unableClipboard)=>{return !unableClipboard});
    }

    const handleOnDeleteFile = (fileDeleted) => {
        setLastDeleted(fileDeleted);
    }

    const setMenuActive = (isActive) =>{
        setIsMenuActive(isActive);
    }

    return (
        <div className='globalContainer'>
        <Darkscreen
            isActive={isMenuActive}
            isMenuForced={isMenuForced}
        />
        <TopBar selectedFileCollection={fileCollection} currentUser={currentUser}/>
        <FilesContainer
            currentUser={currentUser}
            collectionId={collectionId}
            collectionData={fileCollection}
            postDataResponse={postData}
            setPostDataResponse={setPostData}
            onCopyClipboard={handleCopyClipboard}
            onUnableCopyClipboard={handleUnableToCopy}
            onFileDeleted={handleOnDeleteFile}
            filesContainerRef={filesContainerRef}
            dragContainerUiRef={dragContainerUiRef}
        />
        <BottomBar
            currentUser={currentUser}
            collectionId={collectionId}
            onPostResponseReceived={handlePostedDataResponse}
            lastClipboardCopy={lastClipboard}
            lastDeleted={lastDeleted}
            setMenuActive={setMenuActive}
            setUploadProgress={setUploadProgress}
            unableClipboard={unableClipboard}
            filesContainerRef={filesContainerRef}
            dragContainerUiRef={dragContainerUiRef}
            bottomBarRef={bottomBarRef}
            formType='file'
        />
        <ProgressContainer
            uploadProgress={uploadProgress}
        />
        </div>
    )
}

export default MainApp;