import React, { useEffect, useState } from 'react';
import useFetch from './useFetch';
import Collection from "./collection";


function CollectionsContainer() {
    const { data: collectionsData, isLoading: isLoadingCollectionsData } = useFetch("/api/collections/");
    const [displayCollections, setDisplayCollections] = useState(null);
    const addIcon = `${process.env.REACT_APP_STATIC_URL}plus.svg`;

    useEffect(()=>{
        setDisplayCollections(collectionsData);
    }, [collectionsData]);

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
            { displayCollections && displayCollections.toReversed().map((item, index) => (
                <Collection key={item['id']} collectionId={item['id']} collectionName={item['name']} collectionMembers={item['users'].length} collectionFiles={item['files'].length} />
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