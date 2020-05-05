import React from 'react';
import Search from '../../Search/Search';
import Result from '../../Results/Result/Result';
import Nav from '../../Nav/Nav';
import { observer, inject } from 'mobx-react';

const Single = inject('dataStore', 'searchStore', 'helpers')(observer((props) => {
        let moviePage
        let movieData
        moviePage = props.searchStore.searchResults.map(item => {
            if (item.results.filter(item => {
                if (item.original_title === unescape(props.title)) {
                    return item;
                }
                return null
            }) !== null) {
                return item;
            }
            return null;
        });
        movieData = moviePage[0].results.filter(item => {
            if (item.original_title === unescape(props.title)) {
                return item;
            }
            return null
        });
        
        // Store the detailed info for Result component to use
        props.searchStore.setSingleMovieResults(movieData[0], movieData[0].id);
        // props.searchStore.getDetailedMovieInfo(props.searchStore.movieData[0].id);
        // props.searchStore.displayYouTubeTrailer(props.searchStore.movieData[0]);
    return <>
        <Nav />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results"><Result movie={props.title}/></div>
    </>
}));

export default Single;