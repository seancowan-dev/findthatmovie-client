import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import uuid from 'uuid';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';
import './Nav.css';

const Nav = inject('userStore')(observer((props) => {
    let links;
        if (props.userStore.loginInfo.authenticated === true) { // User has logged in
            // Build fragment for links
            links = <React.Fragment key={uuid.v4()}>
                <A href="/">Search</A>
                <A href="/account">{"Logged in as: " + props.userStore.loginInfo.authenticatedUser}</A>
                <A href="/logout" onClick={(e) => {
                    props.userStore.setAuthenticatedUser("");
                    props.userStore.setAuthenticated(false);                 
                    TokenService.clearAuthToken();
                    TokenService.clearCallbackBeforeExpiry();
                    IdleService.unregisterIdleResets();
                }}>Logout</A>
            </React.Fragment>
            props.userStore.setValidNavLinks(links); // Set data using mobx action
        }
        if (props.userStore.loginInfo.authenticated === false) { // User has not logged in
            // Build fragment for links
            links = <React.Fragment key={uuid.v4()}>
                <A href="/">Search</A>
                <A href="/register">Register</A>
                <A href="/login">Login</A>
            </React.Fragment>
            props.userStore.setValidNavLinks(links); // Set data using mobx action
        }
    
        // Generate appropriate li keys and items for nav
    let linkList = props.userStore.validNavLinks.props.children.map(item => {
        return <li key={uuid.v4()}>{item}</li>;
    });
    return (
        // Display the navigation
        <nav className="navigation" key={uuid.v4()}>
            <ul className="nav-links" key={uuid.v4()}>
                {linkList}
            </ul>
        </nav>
    );
}));

export default Nav;