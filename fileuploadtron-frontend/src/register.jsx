import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import FormInput from './formInput';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const emailIcon = `${process.env.REACT_APP_STATIC_URL}mail.svg`;
    const usernameIcon = `${process.env.REACT_APP_STATIC_URL}person.svg`;
    const passwordIcon = `${process.env.REACT_APP_STATIC_URL}lock.svg`;

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
        registerFormData.append('email', email);

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
        <div className='globalContainer loginGlobal'>
            <div className='loginContainer'>
                <form className='credForm' onSubmit={handleSubmit}>
                    <div className='temp regtemp'>FileUploadinator</div>
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

        // <div className='tempLogin tempReg' style={{"height": "150px"}}>
        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <input
        //                 type='password'
        //                 value={password}
        //                 onChange={e => setPassword(e.target.value)}
        //                 required
        //             />
        //             <label>password</label>
        //         <div>
        //             <input
        //                 type='password'
        //                 value={confirmPassword}
        //                 onChange={e => setConfirmPassword(e.target.value)}
        //                 required
        //             />
        //             <label>confirm password</label>
        //         </div>
        //         </div>
        //         <button type='submit'>REGISTER</button>
        //         <button type='button' onClick={handleLogin}>GO TO LOGIN PAGE</button>
        //     </form>
        // </div>
    )
}

export default Register;