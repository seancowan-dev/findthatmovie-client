import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, FormControl, TextField, Container } from '@material-ui/core';
import { navigate, A } from 'hookrouter';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import $ from 'jquery';
import './Register.css';
import UserService from '../services/users-service';

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

                        // Check Data
                        let data = {
                            userName: props.userStore.newRegistrant.username,
                            email: props.userStore.newRegistrant.email,
                            emailConfirm: props.userStore.newRegistrant.confirmEmail,
                            password: props.userStore.newRegistrant.password,
                            passwordConfirm: props.userStore.newRegistrant.confirmPassword
                        }
                        console.log(data);
                        // Perform Validations - Need to add more validations for final version
                        if (props.helpers.registrationValidator(data) === true) {
                            // let arr = props.dataStore.temporaryAccounts.slice();

                            bcrypt.hash(props.userStore.newRegistrant.password, 8, function(err, hash) {
                                let confirmed = {
                                    "name": props.userStore.newRegistrant.username,
                                    "password": hash,
                                    "email": props.userStore.newRegistrant.email,
                                    "perm_level": "user",
                                    "created_at": moment().format()
                                }
                                console.log(JSON.stringify(confirmed));
                                UserService.addUser(JSON.stringify(confirmed));
                                navigate("/login");
                            });

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