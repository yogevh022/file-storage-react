import React, { useEffect, useRef } from 'react';

function StoredFile({fileId, onUnableCopyClipboard,onCopyClipboard,isNewlyCreated, uploaderName, title, fileData, fileSize, expirationDateTime, displayIcon}) {
    const sfcRef = useRef(null);

    useEffect(() => {
        if (isNewlyCreated) {
            sfcRef.current.classList.add('newlyCreatedAnim');
        }
    }, [isNewlyCreated]);
    

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
            onUnableCopyClipboard();
        }
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (e.target.classList.contains('shareBtnContainer')) { // share btn clicked
            var currentUrl = window.location.href;
            if (currentUrl.endsWith('/')) {
                currentUrl = currentUrl.slice(0, -1);
            }
            copyToClipboard(`${currentUrl}/files/${fileId}`);
            return;
        }

        fetch(`/files/${fileId}`)
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
        <div ref={sfcRef} className='storedFileContainer' onClick={handleClick}>
            <img className='fileImg' src={displayIcon} alt="no img"/>
            <div className='storedFileInfoContainer'>
                <div className='sfTitle'>{title}</div>
                <div className='sfInfoContainer'>
                    <span className='sfUploader'>{uploaderName}</span>
                    <div className='sfSize'>{fileSizeNum}{fileSizeUnit}</div>
                </div>
                {/* <span>{fileData}</span> */}
                {/* <span>{expirationDateTime}</span> */}
            </div>
            <div className='shareBtnContainer'>
                <img className='shareBtn' src={`${process.env.REACT_APP_STATIC_URL}copy_clipboard.svg`} alt="no img"/>
            </div>
        </div>
    )
}

export default StoredFile;