import React, { useState, useRef, useEffect } from "react";
import getFileExtension from "./getFileExtension";

function FileUploadForm({ formId, onPostResponse, onFileUploadPress, onFileUploadComplete, trayOpen, setTrayOpen }) {
    const [uploaderName, setUploaderName] = useState('default');
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
        onFileUploadPress();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onFileUploadComplete();

        const newFileFormData = new FormData();
        newFileFormData.append('uploaderName', uploaderName);
        newFileFormData.append('title', generateFileTitle(title, titlePlaceholder));
        newFileFormData.append('fileData', currentFile);
        newFileFormData.append('fileSize', fileSize);
        newFileFormData.append('expiresInDays', expiresInDays);

        fetch('http://192.168.50.214:8000/files/', {
            method: 'POST',
            'Content-Type': 'multipart/form-data',
            body: newFileFormData
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((resData)=>{setTitle('');onPostResponse(resData);})
        .catch(error => {
            console.log("tech error; ", error);
        })
    }

    return (
        <form id={formId} className="uploadForm" ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            <button 
            type="button"
            className={`uploadButton ${trayOpen ? 'uploadButtonOpen' : ''}`}
            onClick={handleExternalInputButtonClick}>
                <object 
                aria-label="+"
                className="uploadImg"
                data={attachFileIcon}
                type="image/svg+xml"></object>
                {trayOpen ? reuploadButtonLabel : uploadButtonLabel}
            </button>
            { !trayOpen && fileInputIsntEmpty() && clearFileInput() }
            <input 
                ref={fileInputRef}
                className="fileInput"
                type="file"
                required
                onChange={handleFileUpload}
                multiple={false}
            />
            <label style={{display: 'none'}}>uploaderName</label>
            <input style={{display: 'none'}}
                type="text"
                required
                value={uploaderName}
                onChange={e => setUploaderName(e.target.value)}
            />
            <div className="inputGrid">
                {/* <label className="titleLabel">title</label> */}
                <input className="titleInput"
                    type="text"
                    value={title}
                    placeholder={titlePlaceholder}
                    onChange={e => setTitle(e.target.value)}
                />
                {/* <label className="expireLabel">expires in</label> */}
                <select className="expireSelect"
                    value={expiresInDays}
                    onChange={e => setExpiresInDays(e.target.value)}
                >
                    <option value={1}>1 Day</option>
                    <option value={7}>7 Days</option>
                    <option value={30}>30 Days</option>
                </select>
            </div>
            <button form={formId} className="submitButton" type="submit">
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