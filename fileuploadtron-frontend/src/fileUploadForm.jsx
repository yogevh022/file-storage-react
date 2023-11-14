import React, { useState, useRef, useEffect } from "react";
import getFileExtension from "./getFileExtension";

function FileUploadForm({ formId, currentUser, collectionId, onPostResponse, onPostFailure, closeTray, trayOpen, setTrayOpen }) {
    const [title, setTitle] = useState('');
    const [titlePlaceholder, setTitlePlaceholder] = useState('');
    const [expiresInDays, setExpiresInDays] = useState(1);
    const [currentFile, setCurrentFile] = useState(null);
    const [fileSize, setFileSIze] = useState(0);
    const fileInputRef = useRef();
    const formRef = useRef();

    const cloudUploadIcon = `${process.env.REACT_APP_STATIC_URL}cloud_upload.svg`;
    const attachFileIcon = `${process.env.REACT_APP_STATIC_URL}attach_file.svg`;

    const uploadButtonLabel = "Select File";
    const reuploadButtonLabel = "Reselect File";
    const submitButtonLabel = "Upload";

    const fileInputIsntEmpty = () => {
        if (fileInputRef.current) {
            return true;
        }
    }

    const clearFileInput = () => {
        fileInputRef.current.value = '';
    }

    const handleFileUpload = (e) => {
        var selected_file;
        if (e.target.files.length > 0) {
            selected_file = e.target.files[0];
            setTitle('');
        } else {
            if (currentFile) {
                selected_file = currentFile;
            } else {
                return;
            }
        }
        setCurrentFile(selected_file);
        setTitlePlaceholder(selected_file.name);
        setFileSIze(selected_file.size);
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

        fetch(`/api/collections/${collectionId}/files/`, {
            method: 'POST',
            'Content-Type': 'multipart/form-data',
            body: newFileFormData
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject("not uploaded successfully");
            }
        })
        .then(uploadSuccess)
        .catch(error => {
            onPostFailure({"title": generatedFileTitle, "id": 1});
            setTitle('');
            console.log("tech error; ", error);
        })
    }

    return (
        <form id={formId} className="uploadForm" ref={formRef}/* onSubmit={handleSubmit}*/ encType="multipart/form-data">
            <button 
            type="button"
            className={`uploadButton ${trayOpen !== 0 ? 'uploadButtonOpen' : ''}`}
            onClick={handleExternalInputButtonClick}>
                <object 
                aria-label="+"
                className="uploadImg"
                data={attachFileIcon}
                type="image/svg+xml"></object>
                {trayOpen === 1 ? reuploadButtonLabel : uploadButtonLabel}
            </button>
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
                <input className="titleInput"
                    type="text"
                    value={title}
                    placeholder={titlePlaceholder}
                    onChange={e => setTitle(e.target.value)}
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
            <button form={formId} className="submitButton" onClick={handleSubmit} type="button" /*type="submit"*/>
            <object 
                className="submitImg"
                data={cloudUploadIcon}
                type="image/svg+xml"
            >
            </object>
                {submitButtonLabel}
            </button>
        </form>
    )

}

export default FileUploadForm;