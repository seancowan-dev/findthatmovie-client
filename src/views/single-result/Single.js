import React from 'react';
import Search from '../../Search/Search';
import Result from '../../Results/Result/Result';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

const Single = inject('dataStore', 'searchStore', 'helpers')(observer((props) => {
        // Get basic movie info
        props.searchStore.movieData = props.dataStore.testMovieData.results.filter(item => {
            if (item.original_title === unescape(props.title)) {
                return item;
            }
            return null
        });
    
        // Get detailed movie info like cast, etc.
        props.searchStore.getDetailedMovieInfo(props.searchStore.movieData[0].id);
        props.searchStore.displayYouTubeTrailer(props.searchStore).then(res => {
            props.searchStore.trailerFragment = res;
        });
    return <>
        <Nav />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results"><Result movie={props.title}/></div>
    </>
}));

export default Single;