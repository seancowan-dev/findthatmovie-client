import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import './UserLists.css';
import ListsService from '../../services/lists-service';
import TokenService from '../../services/token-service';
import Panel from '../../comps/user-list-panel/panel';
import AccNav from '../../comps/account-nav/AccountNav';

let list;

const UserLists = inject('userStore')(observer((props) => {
    async function handleUserLists() {
        await ListsService.getUserLists(TokenService.readJwtToken().user_id)
        .then(res => {
            props.userStore.setUserLists(res); // Get user list
            props.userStore.toggleListLoaded(true); // Set loading to true
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
        return null;
      })
    list = <Panel list_data={list_data}/>
        return (<>
            <Nav />
            <div className="parallax"></div>
            <div className="list-container container">
                <AccNav />
                <h1>{props.userStore.loginInfo.authenticatedUser + "'s Lists"}</h1>
                {list}
            </div>
        </> 
    );
}));

export default UserLists;