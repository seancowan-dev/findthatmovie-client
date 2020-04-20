import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';

const AccNav = inject('dataStore', 'userStore')(observer((props) => {
    return <nav className="account-navigation">
        <ul>
            <li>Test Link</li>
        </ul>
    </nav>
}));

export default AccNav;