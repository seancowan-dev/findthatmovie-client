import React from 'react';
import Search from '../../Search/Search';
import Results from '../../Results/Results';
import Nav from '../../Nav/Nav';
import { observer } from 'mobx-react';
import './Multi.css';

const Multi = observer((props) => {
    return <>
        <Nav />
        <div className="parallax"></div>
        {<div className="search-form-container"><Search /></div>}
        <div className="results"><Results /></div>
    </> 
});

export default Multi;