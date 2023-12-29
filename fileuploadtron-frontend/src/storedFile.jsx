import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import CopyTextWindow from './copyTextWindow';
import StoredFileInfo from './storedFileInfo';

const StoredFile = forwardRef(({fileId, user, collectionId, onUnableCopyClipboard,onCopyClipboard,isNewlyCreated, title, fileData, fileSize, expirationDateTime, displayIcon}, ref) => {
    const sfcRef = useRef(null);
    const [animClass, setAnimClass] = useState("");
    const [isCopyWindowActive, setIsCopyWindowActive] = useState(false);
    const [copyLink, setCopyLink] = useState('');

    const copyClipboardIcon = `${process.env.REACT_APP_STATIC_URL}copy_clipboard.svg`;
    const downloadIcon = `${process.env.REACT_APP_STATIC_URL}download.svg`;
    const closeIcon = `${process.env.REACT_APP_STATIC_URL}cancel.svg`;

    const removeAnimationClassAndListener = () => {
        setAnimClass('');
        sfcRef.current.removeEventListener('animationend', removeAnimationClassAndListener);
    }

    useEffect(() => {
        if (isNewlyCreated) {
            setAnimClass('newlyCreatedAnim');
            sfcRef.current.addEventListener('animationend', removeAnimationClassAndListener);
        }
    }, [isNewlyCreated]);
    
    const getFileUrl = (_fileId) => {
        var coreUrl = window.location.protocol + '//' + window.location.host;
        return `${coreUrl}/api/collections/${collectionId}/files/${_fileId}/`;
    }

    const copyToClipboard = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
            .catch(err => {
                console.log("clipboard ERR; ", err);
            });
            onCopyClipboard({'id': fileId, 'title': title});
        } else if (navigator.share) {   // if no clipboard/premissions, try share
            navigator.share({
                url: text
            })
            .catch(err => {
                console.log("share ERR; ", err);
            });
        } else {
            setCopyLink(text);
            setIsCopyWindowActive(true);
            // onUnableCopyClipboard();
        }
    }

    const getSelectedText = () => {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            return document.selection.createRange().text;
        }
        return "";
    }

    const handleCopyEvent = () => {
        if (getSelectedText() == copyLink) {
            onCopyClipboard({"title": title, "id": fileId});
        }
        setTimeout(()=>setIsCopyWindowActive(false), 50);
    }

    const handleClickAnywhere = (target) => {
        if (sfcRef.current.contains(target) === false && isCopyWindowActive === true) {
            setIsCopyWindowActive(false);
        }
    }

    useImperativeHandle(ref, ()=>({
        handleCopyEvent,
        handleClickAnywhere,
    }));

    const handleClick = (e) => {
        e.preventDefault();
        if (e.target.classList.contains('shareBtn')) { // share btn clicked
            if (isCopyWindowActive === true) {
                setIsCopyWindowActive(false);
            } else {
                copyToClipboard(getFileUrl(fileId));
            }
            return;
        }
        if (e.target.classList.contains('downloadBtn')) { // download btn clicked
            var __DEBUG = false;
            if (!__DEBUG) { window.location.href = `/api/collections/${collectionId}/files/${fileId}/`; return; }

            fetch(`/api/collections/${collectionId}/files/${fileId}/`)
            .then(res => res.blob())
            .then(blob => {
                const fileurl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = fileurl;
                a.download = title;
                a.style.display = 'none';
                document.body.appendChild(a);
    
                const aClickHandler = () => {
                    a.removeEventListener('click', aClickHandler);
                    document.body.removeChild(a);
                    setTimeout(()=>{window.URL.revokeObjectURL(fileurl);},50);
                };
    
                a.addEventListener('click', aClickHandler);
    
                a.click();
            })
        }

    }

    const determineNumFixed = (num, divisor) => {
        var fs = num / divisor;
        if (fs >= 10) {
            return Math.round(fs);
        } else {
            return fs.toFixed(1);
        }
    }

    const getFileSizeDisplay = (fileSizeBytes) => {
        const binN = 1024;
        if (fileSizeBytes <= 1_000) {
            return {"size": Math.round(fileSizeBytes), "unit": "B"}
        } else if (fileSizeBytes <= 1_000_000) {
            return {"size": Math.round(fileSizeBytes / (binN**1)), "unit": "K"}
        } else if (fileSizeBytes <= 1_000_000_000) {
            return {"size": determineNumFixed(fileSizeBytes, binN**2), "unit": "M"}
        } else if (fileSizeBytes <= 1_000_000_000_000) {
            return {"size": determineNumFixed(fileSizeBytes, binN**3), "unit": "G"}
        } else if (fileSizeBytes <= 1_000_000_000_000_000) {
            return {"size": determineNumFixed(fileSizeBytes, binN**4), "unit": "T"}
        } else if (fileSizeBytes <= 1_000_000_000_000_000_000) {    // :skull:
            return {"size": determineNumFixed(fileSizeBytes, binN**5), "unit": "P"}
        } else {
            return {"size": 0, "unit": "skull"}
        }
    }

    const {size: fileSizeNum, unit: fileSizeUnit} = getFileSizeDisplay(fileSize);

    return (
        <div ref={sfcRef} className={`storedFileContainer ${animClass}`} onClick={handleClick}>
            <img className='fileImg' src={displayIcon} alt="no img"/>
            <div className='storedFileInfoContainer'>
                { isCopyWindowActive === false && 
                    <StoredFileInfo
                        title={title}
                        user={user}
                        fileSizeNum={fileSizeNum}
                        fileSizeUnit={fileSizeUnit}
                        isInitial={copyLink === '' ? true : false}
                    />
                }
                { isCopyWindowActive === true &&
                    <CopyTextWindow
                        link={copyLink}
                    />
                }
                {/* <span>{expirationDateTime}</span> */}
            </div>
            <div className='downloadBtn sfBtnContainer'>
                <img className='sfDlBtn sfBtn' src={downloadIcon} alt="V"/>
            </div>
            <div className='shareBtn sfBtnContainer'>
                <img className='sfShrBtn sfBtn' src={isCopyWindowActive === true ? closeIcon : copyClipboardIcon} alt="S"/>
            </div>
        </div>
    )
});

export default StoredFile;