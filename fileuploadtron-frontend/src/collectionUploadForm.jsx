import React, { useState, useRef, useEffect } from "react";
import { getFileTypeGroup } from "./getFileTypeIcon";
import getFileExtension from "./getFileExtension";
import { useNavigate } from 'react-router-dom';
import FormInput from "./formInput";
import ReselectFileButton from "./reselectFileButton";


var trayLevelFreezes = {
    0: '',
    1: '',
    2: ''
}

function CollectionUploadForm(props) {
    const [collectionName, setCollectionName] = useState('');
    const [collectionPassword, setCollectionPassword] = useState('');
    const [collectionVerifyPassword, setCollectionVerifyPassword] = useState('');
    const [currentCollectionImage, setCurrentCollectionImage] = useState(null);
    const collectionImageInputRef = useRef();
    const collectionNameInputRef = useRef();
    const submitButtonRef = useRef();
    const navigate = useNavigate();
    
    const postCollectionUrl = '/api/collections/';

    const joinCollectionButtonTitle = 'Existing Collection';
    const createCollectionButtonTitle = 'New Collection';
    const joinCollectionSubmitTitle = 'Join';
    const createCollectionSubmitTitle = 'Create';
    const collectionNameTitle = 'Collection Name';
    const collectionPasswordTitle = 'Collection Password';
    const collectionVerifyPasswordTitle = 'Verify Password';
    const defaultCollectionImageText = 'No Thumbnail';

    const imgIcon = `${process.env.REACT_APP_STATIC_URL}image.svg`;
    const passwordIcon = `${process.env.REACT_APP_STATIC_URL}lock.svg`;
    const nameIcon = `${process.env.REACT_APP_STATIC_URL}tag.svg`;


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

    const canSubmit = () => {
        return submitButtonRef.current.classList.contains('__create') || submitButtonRef.current.classList.contains('__join');
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

    const submitEnterListener = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (canSubmit()) {    // create or join collection screen
                submitButtonRef.current.click();
            }
        }
    }

    useEffect(()=>{
        window.addEventListener('keydown', submitEnterListener);
        return () => {
            window.removeEventListener('keydown', submitEnterListener);
        }
    }, []);

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
            } else if (res.status === 409) {
                return Promise.reject({"conflict": "useralreadyincollection"});
            } else if (res.status === 404) {
                return Promise.reject({"conflict": "collectiondoesnotexist"});
            } else if (res.status === 422) {
                return Promise.reject({"conflict": "collectionnameshort"});
            }
            else {
                return Promise.reject({"conflict": "other"});
            }
        })
        .then(joinSuccess)
        .catch(error => {
            var conflict = error.conflict;
            props.onPostFailure({"title": collectionName, "id": 1}, conflict);
            if (conflict === 'other') {
                console.log("tech error; ", error);
            }
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
            } else if (res.status === 409) {
                return Promise.reject({"conflict": "name"});
            } else if (res.status === 422) {
                return Promise.reject({"conflict": "collectionnameshort"});
            }
            else {
                return Promise.reject({"conflict": "other"});
            }
        })
        .then(uploadSuccess)
        .catch(error => {
            var conflict = error.conflict;
            props.onPostFailure({"title": collectionName, "id": 1}, conflict);
            if (conflict === 'other') {
                console.log("tech error; ", error);
            }
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
        setTimeout(()=>{collectionNameInputRef.current.focus()}, 50); // bugs out if i focus immediatly.
        props.setMenuOpen(2);
    }
    const handleCreateCollectionPress = () => {
        cleanForm();
        setTimeout(()=>{collectionNameInputRef.current.focus()}, 50); // bugs out if i focus immediatly.
        props.setMenuOpen(3);
    }

    return (
        <form id={props.formId} className="uploadForm">
            <button 
                type="button"
                onClick={handleJoinCollectionPress}
                className={`uploadButton joinCollection colGap ${isHidden(props.trayLevel >= 2, 0)}`}
                >
                <img className="uploadCollectionImg" src={props.joinCollectionIcon}/>
                {joinCollectionButtonTitle}
            </button>
            <button 
                type="button"
                onClick={handleCreateCollectionPress}
                className={`submitButton createCollection colGap ${isHidden(props.trayLevel >= 2, 0)}`}
                >
                <img className="uploadCollectionImg" src={props.createCollectionIcon}/>
                {createCollectionButtonTitle}
            </button>
            <FormInput
                icon={nameIcon}
                iconAdjustment={'tagIconAdjustment'}
                title={collectionNameTitle}
                value={collectionName}
                setValue={setCollectionName}
                mandatory={`${isHidden(props.trayLevel === 2, 2) === '' ? 'active' : ''}`}
                inputRef={collectionNameInputRef}
                required
            />
            <FormInput
                icon={passwordIcon}
                title={collectionPasswordTitle}
                value={collectionPassword}
                setValue={setCollectionPassword}
                autoComplete={'new-password'}
                required
                isPassword={true}
            />
            <FormInput
                icon={passwordIcon}
                title={collectionVerifyPasswordTitle}
                value={collectionVerifyPassword}
                setValue={setCollectionVerifyPassword}
                autoComplete={'new-password'}
                required
                isPassword={true}
                addClass={`${isHidden(props.trayLevel !== 3, 1)}`}
            />
            <input 
                ref={collectionImageInputRef}
                className="fileInput"
                type="file"
                accept="image/*"
                onChange={handleCollectionImageUpload}
                multiple={false}
            />
            <ReselectFileButton
                icon={imgIcon}
                title={currentCollectionImage ? currentCollectionImage.name : defaultCollectionImageText}
                onClick={handleCollectionImageClick}
                addClass={`${isHidden(props.trayLevel !== 3, 1)}`}
            />
            <button 
                ref={submitButtonRef}
                type="button"
                className={`colGap ${props.trayLevel === 2 && 'uploadButton __join'} ${props.trayLevel === 3 && 'submitButton __create'}`}
                onClick={handleSubmit}
                >
                {props.trayLevel === 2 &&
                <>
                    <img className="uploadCollectionImg" src={props.joinCollectionIcon}/>
                    {joinCollectionSubmitTitle}
                </>
                }
                {props.trayLevel === 3 &&
                <>
                    <img className="uploadCollectionImg" src={props.createCollectionIcon}/>
                    {createCollectionSubmitTitle}
                </>
                }
            </button>
        </form>
    )
}

export default CollectionUploadForm;