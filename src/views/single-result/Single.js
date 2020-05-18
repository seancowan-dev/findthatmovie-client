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
            UserService.getUserInfo(TokenService.readJwtToken().user_id)
            .then(res => {
                let userInfo = {
                    name: res.name,
                    email: res.email,
                    id: TokenService.readJwtToken().user_id,
                    created_at: res.created_at,
                    updated_at: res.updated_at,
                    perm_level: res.perm_level
                }
                props.userStore.setUserInfo(userInfo);
            })
        }
        
        if (props.searchStore.getSearchResults !== undefined) { // only map data if it is available
            moviePage = props.searchStore.getSearchResults.map((item, idx)=> {
                if (item.results.filter(item => {
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

        if (moviePage.length > 0 && props.searchStore.getLoading === true) {
                movieData = moviePage[index].results.filter(item => {
                    if (item.original_title === unescape(props.title)) {
                        return item;
                    }
                    return null
                });
                // Store the detailed info for Result component to use
                props.searchStore.setSingleMovieResults(movieData[0], movieData[0].id);
                props.searchStore.setLoading(false);
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