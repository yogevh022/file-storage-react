import React, { useState, useRef, useEffect } from "react";
import getFileExtension from "./getFileExtension";
import FormInput from './formInput';
import ReselectFileButton from "./reselectFileButton";

function FileUploadForm({ formId, currentUser,bottomBarRef, filesDragHitboxRef,dragContainerUiRef,setMenuActive, collectionId, setUploadProgress, onPostResponse, onPostFailure, closeTray, trayOpen, setTrayOpen, setTrayOpenPreview }) {
    const [title, setTitle] = useState('');
    const [titlePlaceholder, setTitlePlaceholder] = useState('_'); // has to be not empty before initial set
    const [expiresInDays, setExpiresInDays] = useState(1);
    const [currentFile, setCurrentFile] = useState(null);
    const [fileSize, setFileSize] = useState(0);
    const [isUploadButtonActive, setIsUploadButtonActive] = useState(true);
    const [isDraggingFile, setIsDraggingFile] = useState(0);
    const fileInputRef = useRef();
    const formRef = useRef();
    const submitButtonRef = useRef();
    const fileNameInputRef = useRef();

    const cloudUploadIcon = `${process.env.REACT_APP_STATIC_URL}cloud_upload.svg`;
    const attachFileIcon = `${process.env.REACT_APP_STATIC_URL}attach_file.svg`;
    const attachFileIconDark = `${process.env.REACT_APP_STATIC_URL}attach_file_dark.svg`;
    const fileNameIcon = `${process.env.REACT_APP_STATIC_URL}form.svg`;

    const uploadButtonLabel = "Select File";
    const reuploadButtonLabel = "Reselect File";
    const submitButtonLabel = "Upload";

    const submitEnterListener = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (fileInputIsntEmpty()) {
                submitButtonRef.current.click();
            }
        }
    }

    const onFileDrag = (e) => {
        e.preventDefault();
        if (filesDragHitboxRef.current === e.target || bottomBarRef.current === e.target ||
            filesDragHitboxRef.current.contains(e.target) || bottomBarRef.current.contains(e.target) ||
            e.target.classList.contains('ds')) {
            setIsDraggingFile(1);
            setMenuActive(true);
            setTrayOpenPreview(-1);
        } else {
            setIsDraggingFile(0);
            setMenuActive(false);
            setTrayOpenPreview(0);
        }
    }

    const onFileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setIsDraggingFile(2);
            setTimeout(()=>{
                handleFileUpload(e, files);
            }, 50);
        } else {
            setIsDraggingFile(0);
            setMenuActive(false);
        }
    }

    const onMouseLeaveWindow = (e) => {
        if (e.clientX === 0) {
            setIsDraggingFile(0);
            setMenuActive(false);
            setTrayOpenPreview(0);
        }
    }

    useEffect(()=>{
        if (dragContainerUiRef.current) {
            if (isDraggingFile === 1) {
                dragContainerUiRef.current.classList.add('active');
            } else if (isDraggingFile === 0) {
                dragContainerUiRef.current.classList.remove('active');
                setTrayOpenPreview(0);
            } else {
                dragContainerUiRef.current.classList.remove('active');
                setTrayOpen(2);
            }
        }
    }, [isDraggingFile]);

    useEffect(()=>{
        window.addEventListener('dragover', onFileDrag);
        window.addEventListener('drop', onFileDrop);
        return () => {
            window.removeEventListener('dragover', onFileDrag);
            window.removeEventListener('drop', onFileDrop);
        }
    }, [filesDragHitboxRef.current]);

    useEffect(()=>{
        window.addEventListener('keydown', submitEnterListener);
        window.addEventListener('dragleave', onMouseLeaveWindow);
        return () => {
            window.removeEventListener('keydown', submitEnterListener);
            window.removeEventListener('dragleave', onMouseLeaveWindow);
        }
    },[]);

    const fileInputIsntEmpty = () => {
        if (fileInputRef.current && fileInputRef.current.value && fileInputRef.current.value !== '') {
            return true;
        }
    }

    const clearFileInput = () => {
        fileInputRef.current.value = '';
    }

    const handleFileUpload = (e, other_files=null) => {
        var selected_file;
        if (other_files) {
            fileInputRef.current.files = other_files;
            selected_file = other_files[0];
            setTitle('');
        } else if (e.target.files.length > 0) {
            selected_file = e.target.files[0];
            setTitle('');
        } else {
            if (currentFile) {
                selected_file = currentFile;
            } else {
                return;
            }
        }
        setTimeout(()=>{fileNameInputRef.current.focus()}, 50); // bugs out if i focus immediatly.
        setCurrentFile(selected_file);
        setTitlePlaceholder(selected_file.name);
        setFileSize(selected_file.size);
        setTrayOpen(2);
    }

    const handleExternalInputButtonClick = (e) => {
        fileInputRef.current.click();
    }

    const generateFileTitle = (_title, _titlePlaceholder) => {
        if (_title !== '') {
            const titleExt = getFileExtension(_title);   // user chosen file name
            const titlePlaceholderExt = getFileExtension(_titlePlaceholder); // original filename
            if (titleExt === titlePlaceholderExt) {
                // if file extension matches original file then valid.
                return _title;
            }
            // if wrong or non existent file extension, make it
            return `${_title}.${titlePlaceholderExt}`;
        }
        return _titlePlaceholder;
    }

    const uploadSuccess = (responseData) => {
        setTitle('');
        onPostResponse(responseData);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        closeTray();
        var generatedFileTitle = generateFileTitle(title, titlePlaceholder);

        const newFileFormData = new FormData();
        newFileFormData.append('title', generatedFileTitle);
        newFileFormData.append('collection', collectionId);
        newFileFormData.append('fileData', currentFile);
        newFileFormData.append('fileSize', fileSize);
        newFileFormData.append('expiresInDays', expiresInDays);

        setIsUploadButtonActive(false);
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const precentComplete = (e.loaded / e.total) * 100;
                setUploadProgress(Math.max(0.001, precentComplete));
            }
        })

        xhr.onload = function() {
            if (xhr.status === 200) {
                uploadSuccess(JSON.parse(xhr.responseText));
            } else {
                onPostFailure({"title": generatedFileTitle, "id": 1});
                setTitle('');
                console.log("tech error; ", xhr.statusText);
            }
            setUploadProgress(0.0);
            setIsUploadButtonActive(true);
        }

        xhr.onerror = function() {
            console.error("network error during upload (xhr)");
            setUploadProgress(0.0);
            setIsUploadButtonActive(true);
        }

        xhr.open('POST', `/api/collections/${collectionId}/files/`, true);
        xhr.send(newFileFormData);
    }

    return (
        <form id={formId} className="uploadForm" ref={formRef}/* onSubmit={handleSubmit}*/ encType="multipart/form-data">
            {trayOpen === 0 || trayOpen === -1 ?
            <button 
                type="button"
                className={`uploadButton ${trayOpen !== 0 ? 'uploadButtonOpen' : ''} ${isUploadButtonActive === true ? '' : 'disabled'}`}
                disabled={!isUploadButtonActive}
                onClick={handleExternalInputButtonClick}>
                <img className="uploadImg" src={attachFileIcon}/>
                {uploadButtonLabel}
            </button>
            :
            <ReselectFileButton
                title={reuploadButtonLabel}
                icon={attachFileIconDark}
                onClick={handleExternalInputButtonClick}
            />
            }
            
            { trayOpen === 0 && fileInputIsntEmpty() && clearFileInput() }
            <input 
                ref={fileInputRef}
                className="fileInput"
                type="file"
                required
                onChange={handleFileUpload}
                multiple={false}
            />
            <div className="inputGrid">
                <FormInput
                    icon={fileNameIcon}
                    title='FILE NAME'
                    value={title}
                    setValue={setTitle}
                    placeholder={titlePlaceholder}
                    addClass={'formTextInputRoundLeft'}
                    inputRef={fileNameInputRef}
                    required
                />
                <select className="expireSelect"
                    value={expiresInDays}
                    onChange={e => setExpiresInDays(e.target.value)}
                >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                </select>
            </div>
            <button ref={submitButtonRef} form={formId} className="submitButton" onClick={handleSubmit} type="button" /*type="submit"*/>
            <img className="submitImg"src={cloudUploadIcon}/>
                <div>{submitButtonLabel}</div>
            </button>
        </form>
    )

}

export default FileUploadForm;