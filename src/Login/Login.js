import React from 'react';
import { observer, inject } from 'mobx-react';
import { navigate } from 'hookrouter';
import $ from 'jquery';
import './Login.css';

const Login = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <form className="login-account-form">
        <h1>Create New Account</h1>
        <div className="login-account-user-info">
        <p>Username</p>
        <input className="username-input" type="text"/>
        <span></span>
        <p>Password</p>
        <input className="password-input" type="text"/>
        <span></span>
        </div>
        <button type="submit" onClick={(e) => {
            e.preventDefault();
            let data = {
                userName: $('.username-input').val(),
                password: $('.password-input').val(),
            }

            let userdata = props.dataStore.temporaryAccounts.find(item => {
                if (item.username === data.userName) {
                    return item;
                }
            })

            if (data.password === userdata.password) {
                props.userStore.authenticated = true;
                props.userStore.authenticatedUser = data.userName;
                navigate("/");
            }
        }}>Login</button>
    </form>
}));

export default Login;