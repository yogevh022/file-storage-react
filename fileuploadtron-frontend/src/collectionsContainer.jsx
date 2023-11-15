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
        // favCollections.sort();
        // otherCollections.sort();
        setDisplayCollections([...favCollections, ...otherCollections]);
    }

    const addCollectionToLocal = (new_collection) => {
        if (localCollectionsData) {
            setLocalCollectionsData([...localCollectionsData, new_collection]);
        }
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

    useEffect(()=>{
        if (props.postData) {
            addCollectionToLocal(props.postData);
        }
    }, [props.postData])

    const handleCreate = () => {
        props.openNewCollection();
    }

    return (
        <div className='collectionsContainer'>
            { isLoadingCollectionsData && <h2>LOADING COLLECTIONS</h2>}
            { props.currentUser && displayCollections && displayCollections.map((item, index) => (
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
                <div id='newCollectionButton' className='collectionItem newCollection' onClick={handleCreate}>
                    <img src={addIcon}/>
                </div>
            }
            <div className='collectionsContainerPadder'></div>
        </div>
    )
}

export default CollectionsContainer;