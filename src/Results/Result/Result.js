import React from 'react';
import Comments from '../../comps/comments/comments';
import Cast from '../../comps/cast/cast';
import ListMenu from '../../comps/add-list-menu/Menu';
import { observer, inject } from 'mobx-react';
import './Result.css';

function checkPoster(object) {
    let url;
    if (object != null) {
        url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + object;
    } else {
        url = "images/not-found.jpg";
    }

    return url;
}

function budget(budg) {
    return "$" + parseInt(budg).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

const Result = inject('searchStore', 'userStore')(observer((props) => {
    let details;
    let addMenu;
    if (props.searchStore.detailedInfo !== undefined) {
        details = props.searchStore.detailedInfo;
    }
    if (props.userStore.authenticated === true) {
        addMenu = <ListMenu />
    }
    props.userStore.currentId = props.searchStore.movieData.id;
    return (
        <div className="single-movie-results">
            <div className="single-movie-heading">
                <h2>{props.searchStore.movieData.original_title}</h2>
                <h3>{details.tagline}</h3>
            </div>
            <div className="youtube-trailer-container">
                {props.searchStore.trailerFragment}
            </div>
            <div className="single-movie-budglength">
                <p className="budget-para">{budget(details.budget)}</p>
                <p className="budget-para">{details.runtime} mins</p>
                {addMenu}
            </div>
            <div className="single-movie-info">
                <div className="single-movie-text">
                    <img className="movie-poster" src={checkPoster(props.searchStore.movieData.poster_path)} alt="Poster of Movie"/>
                    <p className="single-movie-description">{props.searchStore.movieData.overview}</p>
                </div>
                <Cast info={props.searchStore.detailedInfo} />
                <Comments />
            </div>
        </div>
    );
}));

export default Result;