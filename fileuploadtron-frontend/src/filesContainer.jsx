import useFetch from "./useFetch";
import StoredFile from './storedFile';
import React, { useEffect, useState, useRef } from 'react';
import getFileTypeIcon from "./getFileTypeIcon";
import getFileExtension from "./getFileExtension";

function FilesContainer(props) {
    const {data: filesData, isLoading} = useFetch(`/api/collections/${props.collectionId}/files/`);
    const [displayData, setDisplayData] = useState(null);
    const alreadyAnimated = new Set();
    const childRefs = useRef([]);


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

    const handleCopy = () => {
        childRefs.current.forEach((childRef) => {
            if (childRef) {
                childRef.handleCopyEvent();
            }
        });
    }
    const handleClickAnywhere = (e) => {
        childRefs.current.forEach((childRef) => {
            if (childRef) {
                childRef.handleClickAnywhere(e.target);
            }
        });
    }

    useEffect(()=>{
        document.addEventListener("click", handleClickAnywhere);
        document.addEventListener("copy", handleCopy);
        return () => {
            document.removeEventListener("click", handleClickAnywhere);
            document.removeEventListener("copy", handleCopy);
        }
    }, []);

    useEffect(() => {
        setDisplayData(filesData);
    }, [filesData]);
    
    useEffect(() => {
        if (props.postDataResponse !== null) {
            setDisplayData((displayData) => {return [...displayData, props.postDataResponse]});
        }
    }, [props.postDataResponse]);

    return (
    <div className='filesContainer'>
        { isLoading && <h2>Loading...</h2> }
        {/* { postDataResponse && getNewItemJsx(postDataResponse) } */}
        { displayData && displayData.toReversed().map((item, index) => (
            <StoredFile
            ref={(ref)=>{childRefs.current[index] = ref}}
            key={item['id']}
            fileId={item['id']}
            collectionId={props.collectionId}
            user={item['user']}
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