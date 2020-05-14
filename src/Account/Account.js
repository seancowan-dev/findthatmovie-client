import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import AccNav from '../comps/account-nav/AccountNav';
import './Account.css';
import UserStore from '../stores/UserStore';
import UserService from '../services/users-service';
import bcrypt from 'bcryptjs';
import { Button, FormControl, FormHelperText, TextField } from '@material-ui/core';

const Account = inject('dataStore', 'userStore', 'helpers')(observer((props) => {

    if (UserStore.getAuthenticated === true) {
        return (
            <div className="account-page-container">
                <AccNav className="account-navigation"/>
                <section className="account-information">
                    <h1>Account Information</h1>
                    <p>{"Logged in as: " + props.userStore.getAuthenticatedUser + " and your permission level is: " + props.userStore.userInformation.perm_level}</p>
                    <p>{"Registered E-mail: " + props.userStore.getUserEmail}</p>
                    <p>{"Account Created On: " + props.userStore.getAccountCreationDate}</p>
                    <p>{"Account Last Updated On: " + props.userStore.getAccountUpdateDate}</p>
                    <h3>Change Password</h3>
                    <form className="change-password-form">
                        <FormControl>
                            <TextField
                                id="user-old-password-input"
                                className="user-old-password-input"
                                value={props.userStore.getChangePasswordOld}
                                onChange={(e) => {
                                    props.userStore.setChangePasswordOld(e.target.value);
                                }}
                            />  
                            <FormHelperText id="user-old-password-input-label">Enter Old Password</FormHelperText>                          
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="user-new-password-input"
                                className="user-new-password-input"
                                value={props.userStore.getChangePasswordNew}
                                onChange={(e) => {
                                    props.userStore.setChangePasswordNew(e.target.value);
                                }}
                            />  
                            <FormHelperText id="user-new-password-input-label">Enter New Password</FormHelperText>                          
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="user-newConfirm-password-input"
                                className="user-newConfirm-password-input"
                                value={props.userStore.getChangePasswordNewConfirm}
                                onChange={(e) => {
                                    props.userStore.setChangePasswordNewConfirm(e.target.value);
                                }}
                            />  
                            <FormHelperText id="user-newConfirm-password-input-label">Confirm New Password</FormHelperText>                          
                        </FormControl>                                                
                    </form>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                        if (props.userStore.getChangePasswordNew === props.userStore.getChangePasswordNewConfirm) {
                            bcrypt.hash(props.userStore.getChangePasswordNewConfirm, 8, function (err, hash) {
                                let info = {
                                    "name": props.userStore.getAuthenticatedUser,
                                    "password": hash,
                                    "email": props.userStore.getUserEmail
                                }
                                UserService.updateUser(props.userStore.getUserId, JSON.stringify(info))
                            });
                            props.userStore.resetChangePassword();
                        }
                    }}
                    >
                        Change Password
                    </Button>
                </section>
              </div>
            );
    }
    if (UserStore.getAuthenticated === false) {
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