import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, FormControl, TextField, Container } from '@material-ui/core';
import TokenService from '../services/token-service';
import AuthApiService from '../services/auth-api-service';
import { navigate, A } from 'hookrouter';
import './Login.css';

const Login = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <form className="login-account-form">
        <Container maxWidth="sm">
            <fieldset className="login-account-info">
                <h1>Create New Account</h1>
                <FormControl>
                    <TextField 
                        label="Enter username"
                        className="login-username-input"
                        type="text"
                        value={props.userStore.loginInfo.username}
                        onChange={(e) => {
                            props.userStore.loginInfo.username = e.target.value;
                        }}
                    />
                </FormControl>
                <FormControl>
                    <TextField 
                        label="Enter username"
                        className="login-password-input"
                        type="password"
                        value={props.userStore.loginInfo.password}
                        onChange={(e) => {
                            props.userStore.loginInfo.password = e.target.value;
                        }}
                    />
                </FormControl>
                <FormControl>
                    <Button color="primary" variant="contained" type="submit" onClick={(e) => {
                        e.preventDefault();

                        // Pull data from user store
                        let data = {
                            userName: props.userStore.loginInfo.username,
                            password: props.userStore.loginInfo.password,
                        };

                        // Remove data from user store immediately so it never leaves Login page
                        props.userStore.loginInfo.username = '';
                        props.userStore.loginInfo.password = '';
                        // Create user auth token and store on client
                        AuthApiService.postLogin({name: data.userName, password: data.password}).then(res => {
                            TokenService.saveAuthToken(res.authToken);
                        })

                        // Proceed to main page
                        navigate("/");
                    }}>Login</Button>
                </FormControl>
                <p>Don't have an account? <A href="/register">Click here</A></p>
            </fieldset>
        </Container>
    </form>
}));

export default Login;