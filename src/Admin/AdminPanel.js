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

// // Pull stylesheet for semantic UI - this is the method directly from their documentation
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default AdminPanel;