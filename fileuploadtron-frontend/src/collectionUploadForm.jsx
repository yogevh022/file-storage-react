import React, { useState, useRef, useEffect } from "react";
import { getFileTypeGroup } from "./getFileTypeIcon";
import getFileExtension from "./getFileExtension";
import { useNavigate } from 'react-router-dom';


var trayLevelFreezes = {
    0: '',
    1: ''
}

function CollectionUploadForm(props) {
    const [collectionName, setCollectionName] = useState('');
    const [collectionPassword, setCollectionPassword] = useState('');
    const [collectionVerifyPassword, setCollectionVerifyPassword] = useState('');
    const [currentCollectionImage, setCurrentCollectionImage] = useState(null);
    const collectionImageInputRef = useRef();
    const navigate = useNavigate();
    
    const postCollectionUrl = '/api/collections/';

    const joinCollectionSubmitTitle = 'Join Collection';
    const createCollectionSubmitTitle = 'Create Collection';
    const collectionTitlePlaceholder = 'Collection Name';
    const collectionPasswordPlaceholder = 'Collection Password';
    const collectionVerifyPasswordPlaceholder = 'Verify Password';
    const defaultCollectionImageText = 'Collection Image';

    const imgIcon = `${process.env.REACT_APP_STATIC_URL}image.svg`;


    const isHidden = (condition, trayLevelNum) => {
        if (props.trayLevel === 0) {
            return trayLevelFreezes[trayLevelNum];
        }
        if (condition) {
            trayLevelFreezes[trayLevelNum] = 'hidden';
            return 'hidden';
        }
        trayLevelFreezes[trayLevelNum] = '';
        return '';
    }

    const fileInputIsntEmpty = () => {
        if (collectionImageInputRef.current) {
            return true;
        }
    }

    const clearFileInput = () => {
        setCurrentCollectionImage(null);
        collectionImageInputRef.current.value = '';
    }

    const cleanForm = () => {
        setCollectionName('');
        setCollectionPassword('');
        setCollectionVerifyPassword('');
    }

    const uploadSuccess = (responseData) => {
        props.onPostResponse(responseData);
        props.setMenuClose();
    }

    const joinSuccess = (responseData) => {
        if (responseData.status === 1) {
            // user already in collection popup
            return;
        }
        navigate(`/collections/${responseData.id}`);
        props.setMenuClose();
    }

    useEffect(()=>{
        if (props.trayLevel === 0 && fileInputIsntEmpty()) {
            clearFileInput();
        }
    }, [props.trayLevel]);

    const handleCollectionImageClick = () => {
        collectionImageInputRef.current.click();
    }
    const handleCollectionImageUpload = (e) => {
        var selected_file;
        var check_last_image = true;
        if (e.target.files.length > 0) {
            if (getFileTypeGroup(getFileExtension(e.target.files[0].name)) !== 'rasterImageTypes') {
                props.onFileNotImage();
                clearFileInput();
                return;
            } else {
                check_last_image = false;
                selected_file = e.target.files[0];
            }
        }
        if (check_last_image) {
            if (currentCollectionImage) {
                selected_file = currentCollectionImage;
            } else {
                return;
            }
        }
        setCurrentCollectionImage(selected_file);
    }

    const handleJoinSubmit = (e) => {
        e.preventDefault();

        const newCollectionFormData = new FormData();
        newCollectionFormData.append('name', collectionName);
        newCollectionFormData.append('password', collectionPassword);

        fetch(postCollectionUrl, {
            method: 'PUT',
            'Content-Type': 'multipart/form-data',
            body: newCollectionFormData
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject("not uploaded successfully");
            }
        })
        .then(joinSuccess)
        .catch(error => {
            // error indication
            console.log(error);
        })
    }

    const handleCreateSubmit = (e) => {
        e.preventDefault();

        const newCollectionFormData = new FormData();
        newCollectionFormData.append('name', collectionName);
        if (collectionPassword === collectionVerifyPassword) {
            newCollectionFormData.append('password', collectionPassword);
        } else {
            props.onPasswordsDontMatch();
            return;
        }
        if (currentCollectionImage) {
            newCollectionFormData.append('image', currentCollectionImage);
        }

        fetch(postCollectionUrl, {
            method: 'POST',
            'Content-Type': 'multipart/form-data',
            body: newCollectionFormData
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
            props.onPostFailure({"title": collectionName, "id": 1});
            console.log("tech error; ", error);
        })
    }

    const handleSubmit = (e) => {
        var btn = e.target;
        if (btn.classList.contains('__create')) {
            handleCreateSubmit(e);
        } else if (btn.classList.contains('__join')) {
            handleJoinSubmit(e);
        }
    }

    const handleJoinCollectionPress = () => {
        cleanForm();
        props.setMenuOpen(2);
    }
    const handleCreateCollectionPress = () => {
        cleanForm();
        props.setMenuOpen(3);
    }

    return (
        <form id={props.formId} className="uploadForm">
            <button 
                type="button"
                onClick={handleJoinCollectionPress}
                className={`uploadButton uiButton joinCollection ${isHidden(props.trayLevel >= 2, 0)}`}
                >
                Join Collection
            </button>
            <button 
                type="button"
                onClick={handleCreateCollectionPress}
                className={`uploadButton uiButton createCollection ${isHidden(props.trayLevel >= 2, 0)}`}
                >
                Create Collection
            </button>
            <input
                // ref={fileInputRef}
                className="textInput"
                type="text"
                required
                placeholder={collectionTitlePlaceholder}
                onChange={e=>setCollectionName(e.target.value)}
                value={collectionName}
                spellCheck={false}
            />
            <input
                // ref={fileInputRef}
                className={`textInput ${collectionPassword !== '' ? 'passwordOn' : ''}`}
                type="password"
                autoComplete="new-password"
                required
                placeholder={collectionPasswordPlaceholder}
                onChange={e=>setCollectionPassword(e.target.value)}
                value={collectionPassword}
            />
            <input
                // ref={fileInputRef}
                className={`textInput ${collectionVerifyPassword !== '' ? 'passwordOn' : ''} ${isHidden(props.trayLevel !== 3, 1)}`}
                type="password"
                autoComplete="new-password"
                required
                placeholder={collectionVerifyPasswordPlaceholder}
                onChange={e=>setCollectionVerifyPassword(e.target.value)}
                value={collectionVerifyPassword}
            />
            <input 
                ref={collectionImageInputRef}
                className="fileInput"
                type="file"
                accept="image/*"
                onChange={handleCollectionImageUpload}
                multiple={false}
            />
            <button 
                type="button"
                className={`uploadButton uploadButtonOpen uiButton collectionImageButton ${isHidden(props.trayLevel !== 3, 1)}`}
                onClick={handleCollectionImageClick}
                >
                <img className="collectionImageButtonIcon" src={imgIcon} alt="i"/>
                <span>
                    {currentCollectionImage && currentCollectionImage.name}
                    {!currentCollectionImage && defaultCollectionImageText}
                </span>
            </button>
            <button 
                type="button"
                className={`uploadButton uiButton ${props.trayLevel === 2 && '__join'} ${props.trayLevel === 3 && '__create'}`}
                onClick={handleSubmit}
                // style={{'margin-bottom': 'var(--uipad)'}}
                >
                {props.trayLevel === 2 && joinCollectionSubmitTitle}
                {props.trayLevel === 3 && createCollectionSubmitTitle}
            </button>
        </form>
    )
}

export default CollectionUploadForm;