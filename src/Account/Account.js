import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import AccNav from '../comps/account-nav/AccountNav';
import './Account.css';
import UserStore from '../stores/UserStore';
import UserService from '../services/users-service';
import { Button, FormControl, FormHelperText, InputLabel, TextField, Select, Grid, MenuItem } from '@material-ui/core';

const Account = inject('dataStore', 'userStore', 'helpers')(observer((props) => {

    if (UserStore.authenticated === true) {
        return (
            <div className="account-page-container">
                <AccNav className="account-navigation"/>
                <section className="account-information">
                    <h1>Account Information</h1>
                    <p>{"Logged in as: " + props.userStore.userInformation.name + " and your permission level is: " + props.userStore.userInformation.perm_level}</p>
                    <p>{"Registered E-mail: " + props.userStore.userInformation.email}</p>
                    <p>{"Account Created On: " + props.userStore.userInformation.created_at}</p>
                    <p>{"Account Last Updated On: " + props.userStore.userInformation.updated_at}</p>
                    <h3>Change Password</h3>
                    <form className="change-password-form">
                        <FormControl>
                            <TextField
                                id="user-old-password-input"
                                className="user-old-password-input"
                                value={props.userStore.changePassword.old}
                                onChange={(e) => {
                                    props.userStore.changePassword.old = e.target.value;
                                }}
                            />  
                            <FormHelperText id="user-old-password-input-label">Enter Old Password</FormHelperText>                          
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="user-new-password-input"
                                className="user-new-password-input"
                                value={props.userStore.changePassword.new}
                                onChange={(e) => {
                                    props.userStore.changePassword.new = e.target.value;
                                }}
                            />  
                            <FormHelperText id="user-new-password-input-label">Enter New Password</FormHelperText>                          
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="user-newConfirm-password-input"
                                className="user-newConfirm-password-input"
                                value={props.userStore.changePassword.newConfirm}
                                onChange={(e) => {
                                    props.userStore.changePassword.newConfirm = e.target.value;
                                }}
                            />  
                            <FormHelperText id="user-newConfirm-password-input-label">Confirm New Password</FormHelperText>                          
                        </FormControl>                                                
                    </form>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                        if (props.userStore.changePassword.new === props.userStore.changePassword.newConfirm) {
                            let info = {
                                "name": props.userStore.userInformation.name,
                                "password": props.userStore.changePassword.newConfirm,
                                "email": props.userStore.userInformation.email
                            }
                            UserService.updateUser(props.userStore.userInformation.id, JSON.stringify(info))
                        }
                        props.userStore.changePassword = {
                            old: "",
                            new: "",
                            newConfirm: ""
                        }
                    }}
                    >
                        Change Password
                    </Button>
                </section>
              </div>
            );
    }
    if (UserStore.authenticated === false) {
        return (
            <div className="account-page-container">
                <section className="account-information">
                    Access Denied, please create an account <A href="/register">here</A>
                </section>
              </div>
            );
    }

}));

export default Account;