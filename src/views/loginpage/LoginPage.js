import React from 'react';
import Login from '../../Login/Login';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

// const Registration = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
//     return <>
//         <Nav />
//         <div className="parallax"></div>
//         <div className="registration"><Register /></div> 
//     </>
// }));

const LoginPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <>
        <Nav />
        <div className="parallax"></div>
        <div className="login"><Login /></div> 
    </>
}));

export default LoginPage;