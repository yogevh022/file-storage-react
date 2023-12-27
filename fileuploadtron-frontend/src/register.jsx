import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setPassword('');
            setConfirmPassword('');
            console.log("passwords dont match");
            return;
        }

        var api_register_url = '/api/register/';
        const registerFormData = new FormData();
        registerFormData.append('username', username);
        registerFormData.append('password', password);
        registerFormData.append('email', 'www@www.www');

        fetch(api_register_url, {
            method: 'POST',
            'Content-Type': 'application/json',
            body: registerFormData
        })
        .then((res) => {
            if (res.ok) {
                window.location.href = '/';
            }
        })
        .then((resData)=>{console.log(resData)})
        .catch(error => {
            console.log("tech error; ", error);
        })

    }

    const handleLogin = (e) => {
        window.location.href = '/login';
    }

    return (
        <div className='tempLogin tempReg'>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <label>username</label>
                </div>
                <div>
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <label>password</label>
                <div>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label>confirm password</label>
                </div>
                </div>
                <button type='submit'>REGISTER</button>
                <button type='button' onClick={handleLogin}>GO TO LOGIN PAGE</button>
            </form>
        </div>
    )
}

export default Register;