import React from 'react';
import Register from '../../Register/Register';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

const Registration = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    return <>
        <Nav />
        <div className="parallax"></div>
        <div className="registration"><Register /></div> 
    </>
}));

export default Registration;