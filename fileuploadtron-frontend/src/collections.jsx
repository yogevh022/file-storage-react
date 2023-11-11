import React from 'react';
import useFetch from './useFetch';
import TopBar from './topBar';
import CollectionsContainer from './collectionsContainer';

function Collections() {
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");

    return (
        <div className='globalContainer'>
            <TopBar currentUser={currentUser} />
            <CollectionsContainer />
        </div>
    )
}

export default Collections;