import useFetch from "./useFetch";
import StoredFile from './storedFile';
import React, { useEffect, useState, useRef } from 'react';
import getFileTypeIcon from "./getFileTypeIcon";
import getFileExtension from "./getFileExtension";
import LoadingCircle from "./loadingCircle";
import EmptyCollection from "./emptyCollection";
import DragDropFile from "./dragDropFile";

function FilesContainer(props) {
    const {data: filesData, isLoading} = useFetch(`/api/collections/${props.collectionId}/files/`);
    const [localFilesData, setLocalFilesData] = useState(null);
    const [displayData, setDisplayData] = useState(null);
    const alreadyAnimated = new Set();
    const childRefs = useRef([]);

    const uploadIcon = `${process.env.REACT_APP_STATIC_URL}upload.svg`;


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

    const handleDelete = (_fileId) => {
        var fileToDelete = localFilesData.find(obj => obj.id === _fileId);
        props.onFileDeleted({"title": fileToDelete.title, "id": _fileId});
        const _data = localFilesData.filter(i => i.id !== _fileId);
        setLocalFilesData(_data);
        childRefs.current.forEach(childRef => {
            if (childRef && childRef.getId() === _fileId) {
                childRef.deleteSelf();
            }
        });
        setTimeout(()=>{
            setDisplayData(_data);
        },200);
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
        setLocalFilesData(filesData);
        setDisplayData(filesData);
    }, [filesData]);
    
    useEffect(() => {
        if (props.postDataResponse !== null) {
            var newData = (localFilesData) => {return [...localFilesData, props.postDataResponse]};
            setLocalFilesData(newData);
            setDisplayData(newData);
        }
    }, [props.postDataResponse]);

    return (
    <div className='filesContainer'>
        { isLoading && <LoadingCircle/> }
        { displayData && displayData.length === 0 && <EmptyCollection collectionName={props.collectionData && props.collectionData.name}/> }
        <DragDropFile
            containerRef={props.dragContainerUiRef}
            uploadIcon={uploadIcon}
        />
        { props.currentUser && displayData && displayData.toReversed().map((item, index) => (
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
            handleDelete={handleDelete}
            canDelete={item['user'].id === props.currentUser.id}
            displayIcon={getFileTypeIcon(getFileExtension(item['title']))}
            />
            
        ))}
        <div className="bottomFade"></div>
        <div className="sfcPadder"></div>
    </div>
    )
}

export default FilesContainer;