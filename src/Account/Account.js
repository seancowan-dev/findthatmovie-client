import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import AccNav from '../comps/account-nav/AccountNav';
import './Account.css';
import UserStore from '../stores/UserStore';

const Account = inject('dataStore', 'userStore', 'helpers')(observer((props) => {

    if (UserStore.authenticated === true) {
        return (
            <div className="account-page-container">
                <AccNav className="account-navigation"/>
                <section className="account-information">
                    <h1>Account Information</h1>
                    <p>{"Logged in as: " + props.userStore.authenticatedUser}</p>

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