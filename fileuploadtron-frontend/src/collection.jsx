import React, { useState, useEffect } from 'react';
import CollectionDisplay from './collectionDisplay';
import { useNavigate } from 'react-router-dom';

function Collection(props) {

    const navigate = useNavigate();
    const collectionImage = `/api/collections/${props.collectionId}/picture`;
    const starIcon = `${process.env.REACT_APP_STATIC_URL}star.svg`;
    const starFillIcon = `${process.env.REACT_APP_STATIC_URL}star_fill.svg`;

    const isCollectionFavorited = () => {
        return props.localFavoriteCollections.includes(props.collectionId);
    }

    const handleFavorite = (e) => {
        var collection_favorited = isCollectionFavorited();
        var favCollectionObj = {'favoriteCollection':  {
                "id": props.collectionId,
                "isFavorite": !collection_favorited
            }
        };
        
        fetch(`/api/current_user/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(favCollectionObj)
        })
        .then(res=>{
            if (res.ok) {
                if (collection_favorited) {
                    props.setLocalFavoriteCollections(props.localFavoriteCollections.filter(i => i !== props.collectionId));
                } else {
                    props.setLocalFavoriteCollections([...props.localFavoriteCollections, props.collectionId]);
                }
            }
        })
        .catch(e=>{
            console.log(`err; ${e}`);
        })

    }   

    const handleClick = (e) => {
        if (e.target.classList.contains('favoriteButton')) {
            e.stopPropagation();
            handleFavorite(e);
        } else {
            navigate(`${props.collectionId}/`);
        }
    }

    return (
        <div className={`collectionItem ${props.isFavorite ? 'favorite' : ''}`} onClick={handleClick} style={{backgroundImage: `url(${collectionImage})`}}>
            <div className='CollectionHoverTint'>
                <div className='favoriteButton'><img src={props.isFavorite ? starFillIcon : starIcon}/></div>
                <CollectionDisplay collectionName={props.collectionName} collectionMembers={props.collectionMembers} collectionFiles={props.collectionFiles}/>
            </div>
        </div>
    )
}

export default Collection;