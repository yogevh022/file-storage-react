import React, { useState, useRef, useEffect } from "react";

function FormInput(props) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(props.placeholder ? true : false);
    const localRef = useRef();
    const inputFieldRef = props.inputRef || localRef;

    useEffect(()=>{
        if (props.value === '' && !props.placeholder) {
            setHasContent(false);
        }
    }, [props.value])

    useEffect(()=>{
        if (props.placeholder) {
            setHasContent(true);
        }
    }, [props.placeholder])

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
        <div className={`formTextInputContainer ${isFocused ? 'active' : ''} ${props.addClass ? props.addClass : ''}`} onClick={handleClick}>
            <img className={`formTextIcon ${isFocused ? 'active' : ''} ${props.iconAdjustment ? props.iconAdjustment : ''}`} src={props.icon}/>
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
                    {...{placeholder: props.placeholder}}
                    {...{autoComplete: props.autoComplete}}
                    value={props.value}
                    onChange={e => {
                        var val = e.target.value;
                        props.setValue(val);
                        setHasContent(val !== '' || props.placeholder);
                    }}
                    spellCheck={false}
                />
            </div>
            <div className={`formFieldMandatoryIndicator ${props.mandatory && 'active'}`}>•</div>
        </div>
    )
}

export default FormInput;