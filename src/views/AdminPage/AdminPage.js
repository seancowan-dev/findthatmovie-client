import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import UsersService from '../../services/users-service';
import { Container } from 'semantic-ui-react';
import AdminPanel from '../../Admin/AdminPanel';

const AdminPage = inject('dataStore', 'userStore', 'helpers')(observer((props) => {
    async function getUsers() {
        await UsersService.getAllUsers().then(users => {
            props.userStore.setAdminUserList(users);
        });
    }
    if (props.userStore.loginInfo.authenticated === false) {
        // put code here to redirect to the unauthorized page
    }
    if (props.userStore.adminUserList === null) {
        getUsers();
    }
    return <>
            <Nav />
            <Container>
            <h1>Administrator Control Panel</h1>
            <h4>Add/Manage Users</h4>
            <AdminPanel />
            </Container>
        </>
}));

export default AdminPage;