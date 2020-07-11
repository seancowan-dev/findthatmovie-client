import React from 'react';
import Account from '../../Account/Account';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import UserService from '../../services/users-service';
import TokenService from '../../services/token-service';
import AccessDenied from '../../comps/access-denied/AccessDenied';

const AccountPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    if (props.userStore.getAuthenticated === true) {  // Only authenticated users should be able to access this page
        if (props.userStore.getUserInfo === null) { // If the authenticated user's info is not loaded then fetch and store it
            UserService.getUserInfo(TokenService.readJwtToken().user_id)
            .then(res => {
                let userInfo = {
                    name: res.name,
                    email: res.email,
                    id: TokenService.readJwtToken().user_id,
                    created_at: res.created_at,
                    updated_at: res.updated_at,
                    perm_level: res.perm_level
                }
                props.userStore.setUserInfo(userInfo);
            })
        }
    }
    if (props.userStore.getUserInfo !== null) { // If the logged in user's info is not null then return the account page
        return <>
            <Nav />
            <div className="parallax"></div>
            <Account />
        </>
    }
    else { // Otherwise should return the access denied component
        return <>
                <Nav />
                <div className="parallax"></div>
                <div className="access-denied-container container">
                    <AccessDenied userType="registered Users"/>
                </div>
            </>
    }
}));

export default AccountPage;