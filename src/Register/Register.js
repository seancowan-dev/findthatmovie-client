import React from 'react';
import { runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Button, FormControl, TextField, Container } from '@material-ui/core';
import { navigate, A } from 'hookrouter';
import $ from 'jquery';
import './Register.css';

const Register = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    
    const style = {
        readOnly: {
            readOnly: true,
        }
    }
    
    return <form className="create-account-form">
        <Container maxWidth="sm">
            <fieldset className="create-account-user-info">
                <h1>Create New Account</h1>
                <FormControl>
                    <TextField 
                        InputProps={style.readOnly}
                        label="Enter Username" 
                        className="username-input register-inputs" 
                        type="text"
                        value={props.userStore.newRegistrant.username}
                        onClick={(e) => {
                            $('.MuiInput-input').removeAttr("readonly");
                        }}
                        onChange={(e) =>{
                            props.userStore.newRegistrant.username = e.target.value;
                        }}
                    />
                </FormControl>
                <FormControl>
                    <TextField 
                        InputProps={style.readOnly} 
                        label="Enter E-mail" 
                        className="email-input register-inputs" 
                        type="text"
                        value={props.userStore.newRegistrant.email}
                        onChange={(e) =>{
                            props.userStore.newRegistrant.email = e.target.value;
                        }}                        
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        InputProps={style.readOnly}  
                        label="Confirm E-mail" 
                        className="email-confirm-input register-inputs" 
                        type="text"
                        value={props.userStore.newRegistrant.confirmEmail}
                        onChange={(e) =>{
                            props.userStore.newRegistrant.confirmEmail = e.target.value;
                        }}                            
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        InputProps={style.readOnly}  
                        label="Enter Password" 
                        className="password-input register-inputs" 
                        type="password"
                        value={props.userStore.newRegistrant.password}
                        onChange={(e) =>{
                            props.userStore.newRegistrant.password = e.target.value;
                        }}                            
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        InputProps={style.readOnly}  
                        label="Confirm Password" 
                        className="password-confirm-input register-inputs" 
                        type="password"
                        value={props.userStore.newRegistrant.confirmPassword}
                        onChange={(e) =>{
                            props.userStore.newRegistrant.confirmPassword = e.target.value;
                        }}                            
                    />
                </FormControl>
                <FormControl>
                    <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    className="register-submit" 
                    onClick={(e) => {
                        e.preventDefault();

                        // This is where encryption and preparation of the JWT will take place
                        // For testing using plain text
                        let data = {
                            userName: props.userStore.newRegistrant.username,
                            email: props.userStore.newRegistrant.email,
                            emailConfirm: props.userStore.newRegistrant.confirmEmail,
                            password: props.userStore.newRegistrant.password,
                            passwordConfirm: props.userStore.newRegistrant.confirmPassword
                        }
                        if (props.helpers.registrationValidator(data) === true) {
                            let arr = props.dataStore.temporaryAccounts.slice();
                            // This is where the database will be accessed, for now add user to temp store
                            let confirmed = {
                                username: data.userName,
                                password: data.password,
                                email: data.email
                            }
                            arr.push(confirmed);
                            runInAction(() => props.dataStore.temporaryAccounts = arr);
                            navigate("/login");
                        } else {
                            // This is where form validation functions will be put, for now just alert the user
                            alert('Please confirm that password and email match');
                        }
                    }}>Create Account</Button>
                </FormControl>
                <p>Already have an account? <A href="/login">Click here</A></p>
            </fieldset>
            
        </Container>
    </form>
}));

export default Register;