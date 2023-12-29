import React, { useEffect, useRef } from "react";

function CopyTextWindow(props) {
    const copyTextWindowRef = useRef();

    const selectContent = () => {
        const textElement = copyTextWindowRef.current;

        if (document.body.createTextRange) {    // IE
            const range = document.body.createTextRange();
            range.moveToElementText(textElement);
            range.select();
        } else if (window.getSelection) {       // other browsers
            const range = document.createRange();
            range.selectNode(textElement);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    useEffect(()=>{
        selectContent()
    });

    return (
        <div ref={copyTextWindowRef} className='copyTextWindow active' style={{}}>
            { props.link && props.link }
        </div>
    )
}

export default CopyTextWindow;