import React from 'react';
import Account from '../../Account/Account';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

// const Registration = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
//     return <>
//         <Nav />
//         <div className="parallax"></div>
//         <div className="registration"><Register /></div> 
//     </>
// }));

const AccountPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <>
        <Nav />
        <div className="parallax"></div>
        <Account />
    </>
}));

export default AccountPage;