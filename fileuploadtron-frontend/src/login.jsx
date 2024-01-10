import React, { useState, useEffect } from 'react';
import useFetch from './useFetch';
import { Navigate } from 'react-router-dom';
import FormInput from './formInput';
import InfoIndicator from './infoIndicator';

function Login() {
    const { data: currentUser, isLoading: isLoadingUser } = useFetch("/api/current_user/");

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [credentialsIncorrect, setCredentialsIncorrect] = useState(false);

    const usernameIcon = `${process.env.REACT_APP_STATIC_URL}person.svg`;
    const passwordIcon = `${process.env.REACT_APP_STATIC_URL}lock.svg`;
    const warningIcon = `${process.env.REACT_APP_STATIC_URL}error_icons/warning_circle.svg`;

    const incorrectCredentialsMessage = 'Incorrect username or password.';

    const handleSubmit = (e) => {
        e.preventDefault();

        var api_login_url = '/api/login/';
        const loginFormData = new FormData();
        loginFormData.append('username', username);
        loginFormData.append('password', password);

        fetch(api_login_url, {
            method: 'POST',
            'Content-Type': 'application/json',
            body: loginFormData
        })
        .then((res) => {
            if (res.ok) {
                setCredentialsIncorrect(false);
                window.location.href = '/';
            } else if (res.status === 403) {
                setCredentialsIncorrect(true);
            }
        })
        .then((resData)=>{console.log(resData)})
        .catch(error => {
            console.log("tech error; ", error);
        })
    }

    const handleRegister = (e) => {
        window.location.href = '/register';
    }

    return (
        <div className='globalContainer loginGlobal'>
            <div className='loginContainer'>
                { currentUser && <Navigate to="/collections/"/>}
                <form className='credForm' onSubmit={handleSubmit}>
                    <div className='temp'>FileUploadinator</div>
                    { credentialsIncorrect && <InfoIndicator icon={warningIcon} text={incorrectCredentialsMessage} addClass='bad' /> }
                    <FormInput
                        icon={usernameIcon}
                        title='USERNAME'
                        value={username}
                        setValue={setUsername}
                        required
                    />
                    <FormInput
                        icon={passwordIcon}
                        title='PASSWORD'
                        value={password}
                        setValue={setPassword}
                        isPassword={true}
                        required
                    />
                    <button className='loginButton' type='submit'>Login</button>
                    <button className='goToRegister' type='button' onClick={handleRegister}>Register</button>
                </form>
            </div>
        </div>
    )
}

export default Login;