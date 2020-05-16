import React from 'react';
import { observer, inject } from 'mobx-react';
import { Message } from 'semantic-ui-react'; 
import BuildBaseTable from './comps/buildBaseUserTable';
import uuid from 'uuid';
import './AdminPanel.css';

const AdminPanel = inject('userStore', 'helpers')(observer((props) => {
    let table
    if (props.userStore.adminUserList !== null) {
        table = <BuildBaseTable />
    }
    
    return (<>
        <Message positive key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.userStore.adminPanelMessage.visible)} content={props.userStore.adminPanelMessage.message} />
        {table}
        </>);
}));

export default AdminPanel;