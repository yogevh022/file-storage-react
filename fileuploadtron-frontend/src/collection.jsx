import React, { useState } from 'react';
import CollectionDisplay from './collectionDisplay';
import { useNavigate } from 'react-router-dom';

function Collection(props) {
    const [isFav, setIsFav] = useState(false);

    const navigate = useNavigate();

    const tmpImg = `${process.env.REACT_APP_STATIC_URL}emilia.jpg`;
    const arrowIcon = `${process.env.REACT_APP_STATIC_URL}arrow2.svg`;
    const starIcon = `${process.env.REACT_APP_STATIC_URL}star.svg`;
    const starFillIcon = `${process.env.REACT_APP_STATIC_URL}star_fill.svg`;
    const tmpColName = 'Collection Name';

    const handleFavorite = (e) => {
        setIsFav((isFav)=>{return !isFav});
    }

    const handleClick = (e) => {
        if (e.target.classList.contains('favoriteButton')) {
            handleFavorite(e);
        } else {
            navigate(`${props.collectionId}/`);
        }
    }

    return (
        <div className={`collectionItem ${isFav ? 'favorite' : ''}`} onClick={handleClick} style={{backgroundImage: `url(${tmpImg})`}}>
            <div className='CollectionHoverTint'>
                <div className='favoriteButton'><img src={isFav ? starFillIcon : starIcon}/></div>
                <CollectionDisplay collectionName={props.collectionName} collectionMembers={props.collectionMembers} collectionFiles={props.collectionFiles}/>
            </div>
        </div>
    )
}

export default Collection;