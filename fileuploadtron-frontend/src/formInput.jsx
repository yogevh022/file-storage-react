import React, { useState, useRef, useEffect } from "react";

function FormInput(props) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);
    const inputFieldRef = useRef();

    useEffect(()=>{
        if (props.value === '') {
            setHasContent(false);
        }
    }, [props.value])

    const handleClick = () => {
        var inputField = inputFieldRef.current
        if (inputField) {
            inputField.focus();
        }
    }

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false)
    }

    return (
        <div className={`formTextInputContainer ${isFocused ? 'active' : ''}`} onClick={handleClick}>
            <img className={`formTextIcon ${isFocused ? 'active' : ''}`} src={props.icon}/>
            <div className="formTextInputSection">
                <div className={`formTextInputTitle ${(isFocused || hasContent) ? 'active' : ''}`}>
                    {props.title}
                </div>
                <input 
                    ref={inputFieldRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`formTextInputField ${props.isPassword ? 'password': ''} ${(isFocused || hasContent) ? 'active' : ''}`}
                    type={props.isPassword ? 'password' : 'text'}
                    {...{required: props.required}}
                    value={props.value}
                    onChange={e => {
                        var val = e.target.value;
                        props.setValue(val);
                        setHasContent(val !== '');
                    }}
                    spellCheck={false}
                />
            </div>
        </div>
    )
}

export default FormInput;