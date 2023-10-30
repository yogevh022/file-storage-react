import React, { useEffect, useState } from "react";
import FileUploadForm from "./fileUploadForm";
import PopupTray from "./popupTray";

function BottomBar(props) {

    
    const getPopupText = (popupType, dynamicText) => {
        if (popupType === 'upload') {
            return ['Uploaded ', dynamicText];
        } else if (popupType === 'copy') {
            return ['Copied ', dynamicText, " to clipboard."];
        } else if (popupType === '!copy') {
            return ['Unable to copy to ', 'clipboard.'];
        } else {
            console.log("SKULL");
        }
    }
    
    const [trayOpen, setTrayOpen] = useState(false);
    
    const uploadCompleteIcon = `${process.env.REACT_APP_STATIC_URL}cloud_check.svg`;
    const copyCompleteIcon = `${process.env.REACT_APP_STATIC_URL}copy.svg`;
    const warningTriangleIcon = `${process.env.REACT_APP_STATIC_URL}warning_triangle.svg`;
    const popupLifespanMili = 2000;
    const [popupIcon, setPopupIcon] = useState(uploadCompleteIcon);
    const [popupText, setPopupText] = useState([]);
    const [popupId, setPopupId] = useState(null);
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [isPopupInitial, setIsPopupInitial] = useState(true);

    const popupIcons = {
        "upload": uploadCompleteIcon,
        "copy": copyCompleteIcon,
        "!copy": warningTriangleIcon
    }
    const formId = "fuForm";
    
    const handleFileUploadPress = () => {
        setTrayOpen(true);
        props.setMenuActive(true);
    }

    const handleFileUploadComplete = () => {
        setTrayOpen(false);
        props.setMenuActive(false);
    }

    const handleUnableToCopy = () => {
        //
    }

    const callPopup = (popupType, fileData) => {
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
            if (bottomTrayElem && !bottomTrayElem.contains(e.target) && e.target && e.target.id !== 'botTray') {
                setTrayOpen(false);
                props.setMenuActive(false);
            }
        });
    },[]);

    const onPostResponseReceivedWrapper = (fileData) => {
        callPopup("upload", fileData);
        props.onPostResponseReceived(fileData);
    }


    return (
        <div className="bottomBar">
            <div id="botTray" className={`bottomTray ${trayOpen ? 'bottomTrayOpen' : ''}`}>
                <PopupTray key={`${popupId}`} popupIconUrl={popupIcon} popupTextList={popupText} isPopupActive={isPopupActive} setIsPopupActive={setIsPopupActive} popupLifespanMili={popupLifespanMili}/>
                <FileUploadForm formId={formId} trayOpen={trayOpen} setTrayOpen={setTrayOpen} onFileUploadPress={handleFileUploadPress} onFileUploadComplete={handleFileUploadComplete} onPostResponse={onPostResponseReceivedWrapper}/>
            </div>
        </div>
    )
}

export default BottomBar;