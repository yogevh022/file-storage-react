import React, { useEffect, useState } from 'react';
import useFetch from './useFetch';
import Collection from "./collection";
import CollectionDisplay from './collectionDisplay';


function CollectionsContainer(props) {
    const { data: collectionsData, isLoading: isLoadingCollectionsData } = useFetch("/api/collections/");
    const [localCollectionsData, setLocalCollectionsData] = useState(null);
    const [localFavorites, setLocalFavorites] = useState([]);
    const [displayCollections, setDisplayCollections] = useState(null);
    const addIcon = `${process.env.REACT_APP_STATIC_URL}plus.svg`;

    const updateCollectionsRender = (collections_data, favorites) => {
        var favCollections = collections_data.filter(collection => favorites.includes(collection.id));
        var otherCollections = collections_data.filter(collection => !favorites.includes(collection.id));
        favCollections.sort();
        otherCollections.sort()
        setDisplayCollections([...otherCollections, ...favCollections]);    // gets reversed
    }

    useEffect(()=>{
        if (props.currentUser && collectionsData) {
            setLocalCollectionsData(collectionsData);
            setLocalFavorites(props.currentUser.favorite_collections);
            updateCollectionsRender(collectionsData, props.currentUser.favorite_collections);
        }
    }, [collectionsData, props.currentUser]);

    useEffect(()=>{
        if (localCollectionsData && localFavorites) {
            updateCollectionsRender(localCollectionsData, localFavorites);
        }
    }, [localCollectionsData, localFavorites]);

    const handleCreate = () => {
        return;
        const newCollectionFormData = new FormData();
        newCollectionFormData.append('name', "testing this rn");

        fetch('/api/collections/', {
            method: 'POST',
            'Content-Type': 'multipart/form-data',
            body: newCollectionFormData
        })
        .then((res)=>{res.json()})
        .then((resj)=>{console.log(resj)})
        .catch((e)=>{console.log(e)});
    }

    return (
        <div className='collectionsContainer'>
            { isLoadingCollectionsData && <h2>LOADING COLLECTIONS</h2>}
            { props.currentUser && displayCollections && displayCollections.toReversed().map((item, index) => (
                <Collection 
                    key={item['id']}
                    collectionId={item['id']}
                    collectionName={item['name']}
                    collectionMembers={item['users'].length}
                    collectionFiles={item['files'].length}
                    currentUser={props.currentUser}
                    updateCollectionsRender={updateCollectionsRender}
                    localCollectionsData={localCollectionsData}
                    setLocalCollectionsData={setLocalCollectionsData}
                    localFavoriteCollections={localFavorites}
                    setLocalFavoriteCollections={setLocalFavorites}
                    isFavorite={localFavorites.includes(item['id'])}
                />
            ))}
            { !isLoadingCollectionsData &&
                <div className='collectionItem newCollection' onClick={handleCreate}>
                    <img src={addIcon}/>
                </div>
            }
        </div>
    )
}

export default CollectionsContainer;