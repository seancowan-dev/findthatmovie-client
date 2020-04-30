import React from 'react';
import Account from '../../Account/Account';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import UserService from '../../services/users-service';
import TokenService from '../../services/token-service';

const AccountPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
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
    if (props.userStore.userInformation !== null) {
        return <>
        <Nav />
        <Account />
    }
    </>
    }

}));

export default AccountPage;