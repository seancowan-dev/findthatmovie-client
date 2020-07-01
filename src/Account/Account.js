import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import AccNav from '../comps/account-nav/AccountNav';
import './Account.css';
import UserStore from '../stores/UserStore';
import UserService from '../services/users-service';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';
import { Message } from 'semantic-ui-react';
import moment from 'moment';

const Account = inject('dataStore', 'userStore', 'helpers', 'validators')(observer((props) => {

    if (UserStore.getAuthenticated === true) {
        return (
            <div className="account-page-container container">
                <AccNav className="account-navigation"/>
                <section className="account-information">
                <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.validators.changePass.visible)} warning >
                    <Message.Header>{props.validators.getChangePassMessage}</Message.Header>
                    <Message.List items={Array.from(props.validators.arrayMsgsPass)} />
                </Message>
                <div className="account-information-text-container">
                    <h1>Account Information</h1>
                    <div className="account-information-text">
                        <p>{"Name "}</p><p>{props.userStore.getAuthenticatedUser}</p>
                        <p>{"Type "}</p><p>{props.userStore.userInformation.perm_level}</p>
                        <p>{"E-mail "}</p><p>{props.userStore.getUserEmail}</p>
                        <p>{"Created On "}</p><p>{moment(new Date(props.userStore.getAccountCreationDate)).format("MMM Do YYYY")}</p>
                        <p>{"Updated On "}</p><p>{moment(new Date(props.userStore.getAccountUpdateDate)).format("MMM Do YYYY")}</p>
                    </div>
                </div>
                    
                    <form className="change-password-form">
                        <h3>Change Password</h3>
                        <input
                            placeholder="Enter old password"
                            type="text"
                            id="user-old-password-input"
                            className="user-old-password-input inputs"
                            value={props.userStore.getChangePasswordOld}
                            onChange={(e) => {
                                props.userStore.setChangePasswordOld(e.target.value);
                            }}
                        />
                        <input
                            placeholder="Enter new password"
                            type="text"
                            id="user-new-password-input"
                            className="user-new-password-input inputs"
                            value={props.userStore.getChangePasswordNew}
                            onChange={(e) => {
                                props.userStore.setChangePasswordNew(e.target.value);
                            }}
                        /> 
                        <input
                            placeholder="Confirm new password"
                            type="text"
                            id="user-newConfirm-password-input"
                            className="user-newConfirm-password-input inputs"
                            value={props.userStore.getChangePasswordNewConfirm}
                            onChange={(e) => {
                                props.userStore.setChangePasswordNewConfirm(e.target.value);
                            }}
                        />
                        <button
                        className="buttons"
                        onClick={(e) => {
                            e.preventDefault();
                            props.validators.setChangePassMessage("");
                            props.validators.setChangePassVisible(false);
                            function checker(pass) {
                                if (pass !== "") {
                                    return true;
                                }
                                if (pass === "") {
                                    return false;
                                }
                            }
                            let localProps = [
                                props.userStore.getChangePasswordOld,
                                props.userStore.getChangePasswordNewConfirm,
                                props.userStore.getChangePasswordNew
                            ]

                            let valid = localProps.map(item => {
                                return checker(item);
                            })
                            if (valid.find(item => item === false) === undefined) {
                                if (props.userStore.getChangePasswordNew === props.userStore.getChangePasswordNewConfirm) {
                                    let validator_object = props.validators.checkPassword(props.userStore.getChangePasswordNew, props.userStore.getChangePasswordNewConfirm)
                                    if (validator_object[0] === undefined) {
                                        // If a reference to index 0 of the array returns undefined then no errors were generated

                                        // Just to be sure verify that valid was returned true
                                        if (validator_object.valid === true) {
                                            // If we reach this point we should update user password
                                            bcrypt.hash(props.userStore.getChangePasswordNewConfirm, 8, function (err, hash) {
                                                let info = {
                                                    "name": props.userStore.getAuthenticatedUser,
                                                    "password": hash,
                                                    "email": props.userStore.getUserEmail
                                                }
                                                UserService.updateUser(props.userStore.getUserId, JSON.stringify(info))
                                            });
                                            props.userStore.resetChangePassword();
                                            props.validators.setChangePassMessage("Password successfully changed.");
                                            props.validators.setChangePassVisible(true);
                                            setTimeout(() => {
                                                props.validators.setChangePassVisible(false);
                                            }, 10000)
                                        }
                                    }
                                    else { // If we reach this point we should list all the errors for the user
                                        props.validators.setChangePassVisible(true);
                                        let arrayMsgs = [];
                                        validator_object.map(item => {
                                            arrayMsgs.push(item.message);
                                            return null;
                                        })
                                        props.validators.setRegistrationMessage("We detected the following issues with your registration")
                                        props.validators.setPasswordChangeMessageArray(arrayMsgs);
                                        setTimeout(() => {
                                            props.validators.setChangePassVisible(false);
                                        }, 10000)
                                    }
                                }
                                if (props.userStore.getChangePasswordNew !== props.userStore.getChangePasswordNewConfirm) {
                                    props.validators.setChangePassMessage("Entered passwords do not match.");
                                    props.validators.setChangePassVisible(true);
                                    setTimeout(() => {
                                        props.validators.setChangePassVisible(false);
                                    }, 10000)
                                } 
                            }
                            if(valid.find(item => item === false) !== undefined) {
                                props.validators.setChangePassMessage("Some fields are empty please check your inputs.");
                                props.validators.setChangePassVisible(true);
                                setTimeout(() => {
                                    props.validators.setChangePassVisible(false);
                                }, 10000)
                            }
                        }}
                        >
                            Change
                        </button>                                               
                    </form>
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