import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';

const AccNav = inject('userStore')(observer((props) => {
    return <nav className="account-navigation">
        <ul>
            <li><A href="/account">Info</A></li>
            <li><A href="/mylists">Your Lists</A></li>
            <br />
            {props.userStore.getUserPermLevel === "admin" ? <li><A href="/adminPanel">Admin Panel</A></li> : ""}
        </ul>
    </nav>
}));

export default AccNav;