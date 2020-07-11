import React from 'react';
import Search from '../../Search/Search';
import Result from '../../Results/Result/Result';
import Nav from '../../Nav/Nav';
import UserService from '../../services/users-service';
import TokenService from '../../services/token-service';
import { observer, inject } from 'mobx-react';

const Single = inject('userStore', 'searchStore', 'helpers')(observer((props) => {
        let moviePage
        let movieData
        let index;
        if (props.userStore.getUserInfo === null && props.userStore.getAuthenticated === true) { // If the user has not already visited the account page get their info
            UserService.getUserInfo(TokenService.readJwtToken().user_id) // Get authenticated user's information with token and user id
            .then(res => {
                let userInfo = { // Build user information
                    name: res.name,
                    email: res.email,
                    id: TokenService.readJwtToken().user_id, // Get user id
                    created_at: res.created_at,
                    updated_at: res.updated_at,
                    perm_level: res.perm_level
                }
                props.userStore.setUserInfo(userInfo); // Store user information
            })
        }
        
        if (props.searchStore.getSearchResults !== undefined) { // only map data if it is available
            moviePage = props.searchStore.getSearchResults.map((item, idx)=> { // Get the search results and map them
                if (item.results.filter(item => { // Find the movie title matching the user's search
                    if (item.original_title === unescape(props.title)) {
                        index = idx;
                        return item;
                    }
                    return null
                }) !== null) {
                    return item;
                }
                return null;
            });

        if (moviePage.length > 0 && props.searchStore.getLoading === true) { // Only run if there are no results and loading is in progress
                movieData = moviePage[index].results.filter(item => { // Filter results based on title
                    if (item.original_title === unescape(props.title)) {
                        return item;
                    }
                    return null
                });
                // Store the detailed info for Result component to use
                props.searchStore.setSingleMovieResults(movieData[0], movieData[0].id); // Store movie results
                props.searchStore.setLoading(false); // Set loading done
            }
        }

    return <>
        <Nav />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results"><Result movie={props.title}/></div>
    </>
}));

export default Single;