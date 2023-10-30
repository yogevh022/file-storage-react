import useFetch from "./useFetch";
import StoredFile from './storedFile';
import React, { useEffect, useState } from 'react';
import getFileTypeIcon from "./getFileTypeIcon";
import getFileExtension from "./getFileExtension";

function FilesContainer(props) {
    const {data: filesData, isLoading} = useFetch("http://192.168.50.214:8000/files/");
    const [displayData, setDisplayData] = useState(null);
    const alreadyAnimated = new Set();


    const checkIfItemIsNewlyCreated = (item) => {
        if (props.postDataResponse) {
            if (props.postDataResponse['id'] === item['id'] && !alreadyAnimated.has(item['id'])) {
                // props.setPostDataResponse(null);
                // not only does updating postDataResponse here cause problems
                // but its also not necessary, we only start a new render if its
                // updated again in the first place, meaning we dont want it null..
                alreadyAnimated.add(item['id']);
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        setDisplayData(filesData);
    }, [filesData]);
    
    useEffect(() => {
        if (props.postDataResponse !== null) {
            setDisplayData((displayData) => {return [...displayData, props.postDataResponse]});
        }

    }, [props.postDataResponse]);


    const tmpimg = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Ffiles-icon%2Ffiles-icon-6.jpg&f=1&nofb=1&ipt=890f5040352389a84f644d8c03d75652f0647b4f5bb5137e9621f09492cb5c9f&ipo=images";

    return (
    <div className='filesContainer'>
        { isLoading && <h2>Loading...</h2> }
        {/* { postDataResponse && getNewItemJsx(postDataResponse) } */}
        { displayData && displayData.toReversed().map((item, index) => (
            <StoredFile
            key={item['id']}
            fileId={item['id']}
            uploaderName={item['uploaderName']}
            title={item['title']}
            fileData={item['fileData']}
            fileSize={item['fileSize']}
            expirationDateTime={item['expirationDateTime']}
            isNewlyCreated={checkIfItemIsNewlyCreated(item)}
            onCopyClipboard={props.onCopyClipboard}
            onUnableCopyClipboard={props.onUnableCopyClipboard}
            displayIcon={getFileTypeIcon(getFileExtension(item['title']))}
            />
            
        ))}

        <div className="sfcPadder"></div>
    </div>
    )
}

export default FilesContainer;