import React from 'react';
import Search from '../../Search/Search';
import Nav from '../../Nav/Nav';
import { observer } from 'mobx-react';
import uuid from 'uuid';

const Logout = observer((props) => {
    return <>
        <Nav key={uuid.v4()} />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results">Logout succesful</div> 
    </>
});

export default Logout;