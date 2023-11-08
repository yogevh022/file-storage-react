import React from 'react';
import DynamicTextContent from './dynamicTextContent';

function PopupText(props) {

    const textListPreped = props.textList.map((i, idx) => {
        return i.replaceAll(" ", "\u00a0");
    });

    return (
        <div className='popupText'>
            {textListPreped[0]}
            {<DynamicTextContent text={textListPreped[1]}/>}
            {textListPreped[2] && textListPreped[2]}
        </div>
    )
}

export default PopupText;