import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, FormControl, TextField } from '@material-ui/core';
import { Message, Container } from 'semantic-ui-react';
import { navigate, A } from 'hookrouter';
import uuid from 'uuid';
import './Login.css';

const Login = inject('dataStore', 'userStore', 'helpers', 'validators')(observer((props) => {
    return <Container>
    <form className="login-account-form">
            <fieldset className="login-account-info">
                <h1>Enter Credentials</h1>
                <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.validators.login.visible)} content={props.validators.login.message} warning />
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
                    <Button 
                        color="primary" 
                        variant="contained" 
                        type="submit" 
                        onClick={(e) => {
                            e.preventDefault();
                            props.helpers.handleUserLogin();
                            navigate("/");
                    }}>Login</Button>
                </FormControl>
                <p>Don't have an account? <A href="/register">Click here</A></p>
            </fieldset>
        </form>
    </Container>
}));

export default Login;