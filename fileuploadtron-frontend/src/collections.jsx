import React from 'react';
import useFetch from './useFetch';
import TopBar from './topBar';
import CollectionsContainer from './collectionsContainer';
import { Navigate } from 'react-router-dom';

function Collections() {
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");

    return (
        <div className='globalContainer'>
            { !currentUser && !isLoadingUser && <Navigate to="/login"/>}
            <TopBar currentUser={currentUser} />
            <CollectionsContainer currentUser={currentUser} />
        </div>
    )
}

export default Collections;