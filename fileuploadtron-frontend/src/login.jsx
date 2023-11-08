import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
                window.location.href = '/';
            }
        })
        .then((resData)=>{console.log(resData)})
        .catch(error => {
            console.log("tech error; ", error);
        })
    }

    const handleLogout = (e) => {
        e.preventDefault();

        var api_logout_url = '/api/logout/';
        
        fetch(api_logout_url, {
            method: 'POST'
        })
        .then(res=>{
            if (res.ok) {
                console.log("logged out !");
            }
        })
    }

    return (
        <div className='tempLogin'>
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
                <button type='submit'>LOG IN</button>
                <button type='button' onClick={handleLogout}>LOG OUT</button>
            </form>
        </div>
    )
}

export default Login;