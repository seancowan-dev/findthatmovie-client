import React from 'react';
import { observer, inject } from 'mobx-react';
import uuid from 'uuid';
import './Nav.css';

const Nav = inject('userStore')(observer((props) => {
        // Generate appropriate li keys and items for nav
        let linkList;
    if (props.userStore.getValidNavLinks) {
         linkList = props.userStore.getValidNavLinks.props.children.map(item => {
            return <li key={uuid.v4()}>{item}</li>;
        });
    }
    return (
        // Display the navigation
        <nav className="navigation" key={uuid.v4()}>
            <ul className="nav-links" key={uuid.v4()}>
                {linkList}
            </ul>
        </nav>
    );
}));

export default Nav;