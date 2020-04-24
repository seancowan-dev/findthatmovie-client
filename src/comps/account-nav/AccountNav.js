import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';

const AccNav = inject('dataStore', 'userStore')(observer((props) => {
    return <nav className="account-navigation">
        <ul>
            <li><A href="/account">Account Information</A></li>
            <li><A href="/mylists">Your Lists</A></li>
        </ul>
    </nav>
}));

export default AccNav;