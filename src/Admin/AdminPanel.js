import React from 'react';
import { observer, inject } from 'mobx-react';
import { Message } from 'semantic-ui-react'; 
import BuildBaseTable from './comps/buildBaseUserTable';
import AccNav from '../comps/account-nav/AccountNav';
import uuid from 'uuid';
import './AdminPanel.css';
import AccessDenied from '../comps/access-denied/AccessDenied';

const AdminPanel = inject('userStore', 'helpers')(observer((props) => {
    let table
    if (props.userStore.adminUserList !== undefined && props.userStore.adminUserList !== null) { // Check to see if there are any admin users in the database
        table = <BuildBaseTable /> // If so build the base admin table
    
        return (<>
            <div className="container admin-panel">
                <AccNav />
                <h1>Administrator Control Panel</h1>
                <h4>Add/Manage Users</h4>
                <Message positive key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.userStore.adminPanelMessage.visible)} content={props.userStore.adminPanelMessage.message} />
                {table}
            </div>
            </>);
    }
    
    else {
        return (<>
            <div className="container admin-panel">
                <AccessDenied userType="site Administrators" />
            </div>
            </>) 
    }
}));

export default AdminPanel;