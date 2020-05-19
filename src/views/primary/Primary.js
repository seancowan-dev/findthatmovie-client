import React from 'react';
import Search from '../../Search/Search';
import Results from '../../Results/Results';
import Nav from '../../Nav/Nav';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid';
import './Primary.css';

const Primary = inject('searchStore')(observer((props) => {
    props.searchStore.noLoad = false;
    props.searchStore.getMovieList(false).then(res => {
        props.searchStore.searchResults.push(res);
    }); 
    return <>
        <Nav key={uuid.v4()} />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results"><Results /></div> 
    </>
}));

export default Primary;