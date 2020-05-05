import React from 'react';
import Account from '../../Account/Account';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import UserService from '../../services/users-service';
import TokenService from '../../services/token-service';
import ListsService from '../../services/lists-service';

const AccountPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    if (props.userStore.loginInfo.authenticated === false) {
        // put code here to redirect to the unauthorized page
    }
    if (props.userStore.userInformation === null) {
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
    if (props.userStore.userLists === null) {
        props.userStore.loginInfo.loaded = false;
        ListsService.getUserLists(TokenService.readJwtToken().user_id)
        .then(res => {
            let grouped = res.reduce((reducer, array) => {
                reducer[array.list_id] = [...reducer[array.list_id] || [], array];
                return reducer; 
            }, {});
            props.userStore.setUserLists(grouped);
            props.userStore.loginInfo.loaded = true;
        })
    }
    if (props.userStore.userInformation !== null) {
        return <>
        <Nav />
        <Account />
    
    </>
    }
}));

export default AccountPage;