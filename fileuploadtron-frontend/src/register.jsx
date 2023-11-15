import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        var api_login_url = '/api/register/';
        const loginFormData = new FormData();
        loginFormData.append('username', username);
        loginFormData.append('password', password);
        loginFormData.append('email', 'www@www.www');

        fetch(api_login_url, {
            method: 'POST',
            'Content-Type': 'application/json',
            body: loginFormData
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
                </div>
                <button type='submit'>REGISTER</button>
            </form>
        </div>
    )
}

export default Register;