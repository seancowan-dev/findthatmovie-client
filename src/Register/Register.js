import React from 'react';
import { runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { navigate } from 'hookrouter';
import $ from 'jquery';
import './Register.css';

const Register = inject('dataStore', 'searchStore', 'helpers')(observer((props) => {
    return <form className="create-account-form">
        <h1>Create New Account</h1>
        <div className="create-account-user-info">
        <p>Username</p>
        <input className="username-input" type="text"/>
        <span></span>
        <p>E-mail</p>
        <input className="email-input" type="text"/>
        <span></span>
        <p>E-mail (confirm)</p>
        <input className="email-confirm-input" type="text"/>
        <span></span>
        <p>Password</p>
        <input className="password-input" type="text"/>
        <span></span>
        <p>Password (confirm)</p>
        <input className="password-confirm-input" type="text"/>
        <span></span>
        </div>
        <button type="submit" onClick={(e) => {
            e.preventDefault();
            let data = {
                userName: $('.username-input').val(),
                email: $('.email-input').val(),
                emailConfirm: $('.email-confirm-input').val(),
                password: $('.password-input').val(),
                passwordConfirm: $('.password-confirm-input').val()
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
        }}>Create Account</button>
    </form>
}));

export default Register;