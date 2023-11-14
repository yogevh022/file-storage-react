import React, { useEffect, useState } from "react";
import FileUploadForm from "./fileUploadForm";
import CollectionUploadForm from "./collectionUploadForm";
import PopupTray from "./popupTray";

function BottomBar(props) {

    const getPopupText = (popupType, dynamicText) => {
        return {
            'upload': ['Uploaded ', dynamicText],
            '!upload': ['Unable to Upload ', dynamicText],
            'copy': ['Copied ', dynamicText, " to clipboard."],
            '!copy': ['Unable to copy to ', 'clipboard.'],
            '!image': ['The chosen file is not an image.'],
            '!password': ['Passwords entered for verification do not match.'],
            '!uploadcollection': ['Unable to create ', dynamicText],
            'uploadcollection': ['', dynamicText, ' has been successfully created'],
        }[popupType];
    }
    
    const [trayOpen, setTrayOpen] = useState(0);
    
    const uploadCompleteIcon = `${process.env.REACT_APP_STATIC_URL}cloud_check.svg`;
    const copyCompleteIcon = `${process.env.REACT_APP_STATIC_URL}copy.svg`;
    const warningTriangleIcon = `${process.env.REACT_APP_STATIC_URL}warning_triangle.svg`;
    const popupLifespanMili = 2000;
    const [popupIcon, setPopupIcon] = useState(uploadCompleteIcon);
    const [popupText, setPopupText] = useState([]);
    const [popupId, setPopupId] = useState(null);
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [isPopupInitial, setIsPopupInitial] = useState(true);
    const [isMenuInitial, setIsMenuInitial] = useState(true);

    const popupIcons = {
        "upload": uploadCompleteIcon,
        "!upload": warningTriangleIcon,
        "copy": copyCompleteIcon,
        "!copy": warningTriangleIcon,
        '!image': warningTriangleIcon,
        '!password': warningTriangleIcon
    }
    const fileFormId = "fuForm";
    const collectionFormId = 'cuForm';

    const handleMenuOpen = (menuLevel) => {
        setTrayOpen(menuLevel);
        props.setMenuActive(true);
    }
    const handleMenuClose = () => {
        setTrayOpen(0);
        props.setMenuActive(false);
    }

    const callPopup = (popupType, fileData={'title': '', 'id': 0}) => {
        setIsPopupActive(true);
        setPopupText(getPopupText(popupType, fileData['title']));
        setPopupIcon(popupIcons[popupType]);
        if (popupId === fileData['id']) {
            setPopupId(fileData['id']+1);
        } else {
            setPopupId(fileData['id']);
        }
    }

    useEffect(()=>{
        if (isMenuInitial) {
            setIsMenuInitial(false);
        } else if (props.formType === 'collection') {
            handleMenuOpen(1);
        }
    }, [props.isOpenNewCollection]);

    useEffect(()=>{
        if (props.lastClipboardCopy) {
            callPopup("copy", props.lastClipboardCopy);
        }
    },[props.lastClipboardCopy]);

    useEffect(()=>{
        if (isPopupInitial) {
            // this code will run at initial render, and then all subsequent updates to
            // props.unableClipboard. this is to avoid calling popup on the initial render.
            setIsPopupInitial(false);
        } else {
            callPopup("!copy", {"title": "", "id": 0});
        }
    }, [props.unableClipboard]);
    
    useEffect(()=>{
        const bottomTrayElem = document.getElementById('botTray');
        document.addEventListener('click', (e) => {
            if (bottomTrayElem && !bottomTrayElem.contains(e.target) && e.target && e.target.id !== 'botTray' 
                && e.target.id !== 'newCollectionButton') {
                handleMenuClose();
            }
        });
    },[]);

    const onPostResponseReceivedWrapper = (fileData) => {
        callPopup("upload", fileData);
        props.onPostResponseReceived(fileData);
    }

    const onCollectionPostResponseReceivedWrapper = (fileData) => {
        callPopup("uploadcollection" , {'title': fileData['name'], 'id': fileData['id']});
        props.onPostResponseReceived(fileData);
    }

    const onPostFailure = (fileData) => {
        callPopup("!upload", fileData);
    }

    const onFileNotImage = () => {
        callPopup("!image");
    }

    const onPasswordsDontMatch = () => {
        callPopup("!password");
    }

    const onCollectionPostFailure = (fileData) => {
        callPopup("!uploadcollection", fileData);
    }

    const trayLevels = {
        0: props.formType === 'file' ? '' : 'bottomTrayFullyClosed',
        1: 'bottomTrayOpenMinimal',
        2: 'bottomTrayOpen',
        3: 'bottomTrayOpenExtended',
    }


    return (
        <div className="bottomBar">
            <div id="botTray" className={`bottomTray ${trayLevels[trayOpen]}`}>
                <PopupTray key={`${popupId}`} popupIconUrl={popupIcon} popupTextList={popupText} isPopupActive={isPopupActive} setIsPopupActive={setIsPopupActive} popupLifespanMili={popupLifespanMili}/>
                { props.formType === 'file' && 
                <FileUploadForm
                    formId={fileFormId}
                    currentUser={props.currentUser}
                    collectionId={props.collectionId}
                    trayOpen={trayOpen}
                    setTrayOpen={setTrayOpen}
                    closeTray={handleMenuClose}
                    onPostResponse={onPostResponseReceivedWrapper}
                    onPostFailure={onPostFailure}
                />}
                { props.formType === 'collection' && 
                <CollectionUploadForm 
                    formId={collectionFormId}
                    setMenuOpen={handleMenuOpen}
                    setMenuClose={handleMenuClose}
                    trayLevel={trayOpen}
                    onFileNotImage={onFileNotImage}
                    onPasswordsDontMatch={onPasswordsDontMatch}
                    onPostResponse={onCollectionPostResponseReceivedWrapper}
                    onPostFailure={onCollectionPostFailure}
                />}
            </div>
        </div>
    )
}

export default BottomBar;