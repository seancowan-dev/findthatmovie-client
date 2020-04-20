import React from 'react';
import Primary from '../views/primary/Primary';
import Multi from '../views/multi-result/Multi';
import Single from '../views/single-result/Single';
import Registration from '../views/register/Registration';
import LoginPage from '../views/loginpage/LoginPage';
import AccountPage from '../views/accountpage/AccountPage';

const routes = {
    "/": () => <Primary />,
    "/results": () => <Multi />,
    "/results/:title": ({title}) => <Single title={title} />,
    "/register": () => <Registration />,
    "/login": () => <LoginPage />,
    "/account": () => <AccountPage />
};

export default routes;