import React from 'react';
import { observer, inject } from 'mobx-react';
import { Message } from 'semantic-ui-react';
import { navigate, A } from 'hookrouter';
import uuid from 'uuid'; 
import './Login.css';

const Login = inject('dataStore', 'userStore', 'helpers', 'validators')(observer((props) => {
    return <div className="container">
    <form className="login-account-form">
            <fieldset className="login-account-info">
                <h1 className="login-items">Enter Credentials</h1>
                <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.validators.login.visible)} content={props.validators.login.message} warning />
                    <input 
                        label="Enter username"
                        className="login-items login-username-input inputs"
                        type="text"
                        value={props.userStore.loginInfo.username}
                        onChange={(e) => {
                            props.userStore.loginInfo.username = e.target.value;
                        }}
                    />
                    <input 
                        label="Enter password"
                        className="login-items login-password-input inputs"
                        type="password"
                        value={props.userStore.loginInfo.password}
                        onChange={(e) => {
                            props.userStore.loginInfo.password = e.target.value;
                        }}
                    />
                    <button 
                        type="submit"
                        className="login-items buttons login-submit inputs" 
                        onClick={(e) => {
                            e.preventDefault();
                            props.helpers.handleUserLogin();
                            navigate("/");
                    }}>Login</button>
                <p>Don't have an account? <A href="/register">Click here</A></p>
            </fieldset>
        </form>
    </div>
}));

export default Login;