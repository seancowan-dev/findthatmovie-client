import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper }  from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import uuid from 'uuid';
import $ from 'jquery';
import './UserLists.css';
import ListsService from '../../services/lists-service';
import TokenService from '../../services/token-service';
import Panel from '../../comps/user-list-panel/panel';

const serializeItem = item => ({
    date_added: item.date_added,
    id: item.id,
    title: item.title
});

let list;

const UserLists = inject('userStore')(observer((props) => {
    async function handleUserLists() {
        await ListsService.getUserLists(TokenService.readJwtToken().user_id)
        .then(res => {
            props.userStore.setUserLists(res); // Get user list
            props.userStore.toggleListLoaded(true); // Set loading to tru
        });
    }
    if (props.userStore.listLoaded !== true) {
        handleUserLists();
    }
    let list_data = [];
    let grouped = props.userStore.userLists.reduce((acc, curr) => { // Group comments into objects by ID
        acc[curr.list_name] = [...acc[curr.list_name] || [], curr];
        return acc;
      }, []);
      Object.values(grouped).map((val, idx, arr) => {
        if (val.length === 1) { // If there is only one item in a group then it is a list without items
            let pushObj = val[0]; // Copy single object
            val[0].item_id !== "" ? pushObj.items = val : pushObj.items = false;
            list_data.push(pushObj); // Push to list_data
        }
        if (val.length > 1) { // If the length is greater than one then there are list items
            let pushObj = val[0]; // Copy single object
            pushObj.items = val;  // Push other vals into items property
            list_data.push(pushObj); // Push to list_data
        }
      })
    list = <Panel list_data={list_data}/>
    
        return (<>
            <Nav />
            <div className="list-container">
                <h1>{props.userStore.loginInfo.authenticatedUser + "'s Lists"}</h1>
                {list}
            </div>
        </> 
    );
}));

export default UserLists;