import React from 'react';
import { observer, inject } from 'mobx-react';
import UserService from '../services/users-service';
import { Button, FormControl, TextField } from '@material-ui/core';
import { Container } from 'semantic-ui-react';
import { navigate, A } from 'hookrouter';
import { Message } from 'semantic-ui-react';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import $ from 'jquery';
import './Register.css';
import uuid from 'uuid';


const Register = inject('userStore', 'validators', 'helpers')(observer((props) => {
    
    const style = {
        readOnly: {
            readOnly: true,
        }
    }
    
    return <Container>
        <form className="create-account-form">
            <fieldset className="create-account-user-info">
                <h1>Create New Account</h1>
                <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.validators.registration.visible)} warning>
                    <Message.Header>{props.validators.registration.message}</Message.Header>
                    <Message.List items={Array.from(props.validators.arrayMsgs)} />
                </Message>
                {/* content={props.validators.registration.message} */}
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

                        // Perform Validations
                        let validator_object = props.validators.registrationValidator(data);
                        
                        if (validator_object[0] === undefined) { 
                            // If a reference to index 0 of the array returns undefined then no errors were generated

                            // Just to be sure verify that valid was returned true
                            if (validator_object.valid === true) {
                                // If we reach this point we should create the user's account
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
                            }

                        } else { // If we reach this point we should list all the errors for the user
                            console.log(validator_object);
                            props.validators.setRegistrationVisibility(true);
                            let arrayMsgs = [];
                            validator_object.map(item => {
                                arrayMsgs.push(item.message);
                            })
                            props.validators.setRegistrationMessage("We detected the following issues with your registration")
                            props.validators.setRegistrationMessageArray(arrayMsgs);
                        }
                    }}>Create Account</Button>
                    <p>Already have an account? <A href="/login">Click here</A></p>
                </FormControl>
            </fieldset>
        </form>
    </Container>
}));

export default Register;