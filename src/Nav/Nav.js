import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import uuid from 'uuid';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';
import './Nav.css';

const Nav = inject('dataStore', 'userStore')(observer((props) => {
    let token;
        // Check if the user is returning and set auth property
        if (TokenService.hasAuthToken() === true) {
            token = TokenService.getAuthToken();
            props.userStore.authenticatedUser = TokenService.parseJwt(token).sub;
            props.userStore.authenticated = true;           
        }
        if (props.userStore.authenticated === true) {
            props.dataStore.validNavLinks = <React.Fragment key={uuid.v4()}>
                <A href="/">Search</A>
                <A href="/account">{"Logged in as: " + props.userStore.authenticatedUser}</A>
                <A href="/logout" onClick={(e) => {
                    props.userStore.authenticatedUser = '';
                    props.userStore.authenticated = false;                    
                    TokenService.clearAuthToken();
                    TokenService.clearCallbackBeforeExpiry();
                    IdleService.unregisterIdleResets();
                }}>Logout</A>
            </React.Fragment>
        }
        if (props.userStore.authenticated === false) {
            props.dataStore.validNavLinks = <React.Fragment key={uuid.v4()}>
                <A href="/">Search</A>
                <A href="/register">Register</A>
                <A href="/login">Login</A>
            </React.Fragment>
        }

    let links = props.dataStore.validNavLinks.props.children.map(item => {
        return <li key={uuid.v4()}>{item}</li>;
    });
    return (
        
        <nav className="navigation" key={uuid.v4()}>
            <ul className="nav-links" key={uuid.v4()}>
                {links}
            </ul>
        </nav>
    );
}));

export default Nav;