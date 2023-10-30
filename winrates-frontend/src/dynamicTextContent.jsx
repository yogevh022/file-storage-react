import React from 'react';

function DynamicTextContent(props) {
    return (
        <div className='popupDynamicContent'>{props.text}</div>
    )
}

export default DynamicTextContent;