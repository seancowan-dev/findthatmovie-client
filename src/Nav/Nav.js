import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import './Nav.css';

const Nav = inject('dataStore', 'userStore')(observer((props) => {
        if (props.userStore.authenticated === true) {
            props.dataStore.validNavLinks = <ul className="nav-links">
                <li><A href="/account">Account</A></li>
            </ul>
        }
        if (props.userStore.authenticated === false) {
            props.dataStore.validNavLinks = <ul className="nav-links">
                <li><A href="/">Home</A></li>
                <li><A href="/register">Login/Register</A></li>
            </ul>
        }
    return <nav className="navigation">
        {props.dataStore.validNavLinks}
    </nav>
}));

export default Nav;