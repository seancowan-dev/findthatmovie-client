import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';

const AccessDenied = inject('userStore')(observer((props) => {
    return <div className="access-denied-text">
        <h1>Access Denied</h1>
        <p>We're sorry but this page is only accessible by {props.userType}.</p>
        <p>If you do not have a user account please go <A href="/register">here</A></p>
    </div>
}));

export default AccessDenied;