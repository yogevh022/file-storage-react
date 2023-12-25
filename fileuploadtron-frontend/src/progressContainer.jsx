import React, { useState, useEffect } from 'react';

function ProgressContainer(props) {
    var loadingPrecent = Math.round(props.uploadProgress);
    return (
        <div className={`progressContainer ${loadingPrecent !== 0 ? 'Open' : ''}`}>
            <span className='progressTitle'>Uploading filename</span>
            <div className='progressInfo'>
                <span className='progressPrecent'>{loadingPrecent !== 100 ? loadingPrecent+'%' : 'Finalizing...'}</span>
                <div className='progressBarContainer'>
                    <div className='progressBar' style={{width: `${loadingPrecent}%`}}></div>
                    <div className='progressUploadAbort'>X</div>
                </div>
            </div>
        </div>
    )
}

export default ProgressContainer;