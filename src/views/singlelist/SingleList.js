import React from 'react';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

const SingleList = inject('userStore')(observer((props) => {
    let currentList = props.userStore.userLists.find(item => {
        if (item.id === props.id) {
            return item;
        }
        return null
    })
    let listItems = currentList.listContent.map(item => {
        return <p>{item.title}</p>
    })
    return <>
        <Nav />
        <div className="list-container">
            <h1>{currentList.listname}</h1>\
            {listItems}
        </div>
    </>
}));

export default SingleList;