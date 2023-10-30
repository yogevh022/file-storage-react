import FilesContainer from './filesContainer';
import React, { useState } from 'react';
import TopBar from './topBar';
import BottomBar from './bottomBar';
import Darkscreen from './darkscreen';

function App() {

  const [postData, setPostData] = useState(null);
  const [lastClipboard, setLastClipboard] = useState(null);
  const [unableClipboard, setUnableClipboard] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [selectedFileCollection, setSelectedFileCollection] = useState("Public");

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
      <TopBar selectedFileCollection={selectedFileCollection}/>
      <FilesContainer postDataResponse={postData} setPostDataResponse={setPostData} onCopyClipboard={handleCopyClipboard} onUnableCopyClipboard={handleUnableToCopy} />
      <BottomBar onPostResponseReceived={handlePostedDataResponse} lastClipboardCopy={lastClipboard} setMenuActive={setMenuActive} unableClipboard={unableClipboard}/>
    </div>
  )
}

export default App;