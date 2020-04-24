import React from 'react';
import Account from '../../Account/Account';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

const AccountPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <>
        <Nav />
        <Account />
    </>
}));

export default AccountPage;