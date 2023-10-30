import React, { useEffect } from 'react';
import PopupText from './popupText';

function PopupTray(props) {
    const animClass = 'popupStartAnimClass';
    const hiddenClass = 'popup-hidden';

    useEffect(()=>{
        const timer = setTimeout(()=> {
            props.setIsPopupActive(false);
        }, props.popupLifespanMili);

        return () => {
            // this will be called on unmount, cleans up the fade timer
            clearInterval(timer);
        }
    }, []);

    return (
        <div className='popupTray'>
            <div className={`popup ${props.isPopupActive ? animClass : hiddenClass}`}>
            <object 
                className="popupIcon"
                data={props.popupIconUrl}
                type="image/svg+xml"
                >
            </object>
                <PopupText textList={props.popupTextList}/>
            </div>
        </div>
    )
}

export default PopupTray;