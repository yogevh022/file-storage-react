import React from "react";

function StoredFileInfo(props) {
    return (
        <>
            <div className={`sfTitle ${props.isInitial === false ? 'fadeIn25' : ''}`}>{props.title}</div>
            <div className={`sfInfoContainer ${props.isInitial === false ? 'fadeIn25' : ''}`}>
                <span className='sfUploader'>{props.user ? props.user.username : 'unknown'}</span>
                <div className='sfSize'>{props.fileSizeNum}{props.fileSizeUnit}</div>
            </div>
        </>
    )
}

export default StoredFileInfo;