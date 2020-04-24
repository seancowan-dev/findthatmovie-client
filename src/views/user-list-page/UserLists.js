import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';
import {A} from 'hookrouter';
import './UserLists.css';

const UserLists = inject('userStore')(observer((props) => {
    let listObject = props.userStore.tempLists.slice();
    let userListObject = listObject.filter(item => {
        if (item.username === props.userStore.authenticatedUser) {
            return item;
        }
        return null;
    })
    let menuItems = userListObject[0].lists.map(item => {
        return <p><A href={"/viewList/" + item.id }>{item.listname}</A></p>
    })
    props.userStore.userLists = userListObject[0].lists;
    return <>
        <Nav />
        <div className="list-container">
            <h1>{props.userStore.authenticatedUser + "'s Lists"}</h1>
            {menuItems}
        </div>
    </>
}));

export default UserLists;