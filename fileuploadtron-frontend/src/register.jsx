import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import FormInput from './formInput';
import InfoIndicator from './infoIndicator';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);
    const [takenEmail, setTakenEmail] = useState(false);
    const [takenUsername, setTakenUsername] = useState(false);
    const [notMatchingPasswords, setNotMatchingPasswords] = useState(false);

    const emailIcon = `${process.env.REACT_APP_STATIC_URL}mail.svg`;
    const usernameIcon = `${process.env.REACT_APP_STATIC_URL}person.svg`;
    const passwordIcon = `${process.env.REACT_APP_STATIC_URL}lock.svg`;
    const warningIcon = `${process.env.REACT_APP_STATIC_URL}error_icons/warning_circle.svg`;

    const notMatchingPasswordsText = 'Passwords do not match.';
    const invalidEmailFormatText = 'Invalid email format.';

    const getInfoIndicatorText = (_takenEmail, _takenUsername) => {
        var iiText = '';
        if (_takenUsername) {
            iiText += 'Username';
        }
        if (_takenEmail) {
            iiText +=  _takenUsername ? ' and email' : 'Email';
        }
        iiText += (_takenEmail && _takenUsername) ? ' are already taken.' : ' is already taken.';
        return iiText;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setPassword('');
            setConfirmPassword('');
            setNotMatchingPasswords(true);
            return;
        } else {
            setNotMatchingPasswords(false);
        }

        var api_register_url = '/api/register/';
        const registerFormData = new FormData();
        registerFormData.append('username', username);
        registerFormData.append('password', password);
        registerFormData.append('email', email);

        fetch(api_register_url, {
            method: 'POST',
            'Content-Type': 'application/json',
            body: registerFormData
        })
        .then((res) => {
            if (res.ok) {
                setTakenEmail(false);
                setTakenUsername(false);
                setInvalidEmailFormat(false);
                window.location.href = '/';
            } else if (res.status === 400) {
                return res.json();
            }
        })
        .then((resData)=>{
            if ('email' in resData) {
                if (resData['email'].includes('Enter a valid email address.')) {
                    setInvalidEmailFormat(true);
                    setTakenEmail(false);
                } else {
                    setInvalidEmailFormat(false);
                    setTakenEmail(true);
                }
            }
            setTakenUsername('username' in resData);
        })
        .catch(error => {
            console.log("tech error; ", error);
        })

    }

    const handleLogin = (e) => {
        window.location.href = '/login';
    }

    return (
        <div className='globalContainer loginGlobal'>
            <div className='loginContainer'>
                <form className='credForm' onSubmit={handleSubmit}>
                    <div className='temp regtemp'>FileUploadinator</div>
                    { (takenUsername || takenEmail) &&
                    <InfoIndicator
                        icon={warningIcon}
                        text={getInfoIndicatorText(takenEmail, takenUsername)}
                        addClass='bad'
                    /> }
                    { notMatchingPasswords &&
                    <InfoIndicator
                        icon={warningIcon}
                        text={notMatchingPasswordsText}
                        addClass='bad'
                    /> }
                    { invalidEmailFormat &&
                    <InfoIndicator
                        icon={warningIcon}
                        text={invalidEmailFormatText}
                        addClass='bad'
                    /> }
                    <FormInput
                        icon={emailIcon}
                        title='EMAIL'
                        value={email}
                        setValue={setEmail}
                        mandatory
                        required
                    />
                    <FormInput
                        icon={usernameIcon}
                        title='USERNAME'
                        value={username}
                        setValue={setUsername}
                        mandatory
                        required
                    />
                    <FormInput
                        icon={passwordIcon}
                        title='PASSWORD'
                        value={password}
                        setValue={setPassword}
                        isPassword={true}
                        mandatory
                        required
                    />
                    <FormInput
                        icon={passwordIcon}
                        title='CONFIRM PASSWORD'
                        value={confirmPassword}
                        setValue={setConfirmPassword}
                        isPassword={true}
                        mandatory
                        required
                    />
                    <button className='loginButton registerButton' type='submit'>Register</button>
                    <button className='goToLogin' type='button' onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Register;