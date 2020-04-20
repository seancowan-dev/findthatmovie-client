import React from 'react';
import Comments from '../../comps/comments/comments';
import Cast from '../../comps/cast/cast';
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

const Result = inject('dataStore', 'searchStore', 'userStore', 'helpers')(observer((props) => {
    let details;
    if (props.searchStore.detailedInfo !== undefined) {
        details = props.searchStore.detailedInfo;
    }
    props.userStore.currentId = props.searchStore.movieData[0].id;
    return (
        <div className="single-movie-results">
            <div className="single-movie-heading">
                <h2>{props.searchStore.movieData[0].original_title}</h2>
                <h3>{details.tagline}</h3>
            </div>
            <div className="youtube-trailer-container">
                {props.searchStore.trailerFragment}
            </div>
            <div className="single-movie-budglength">
                <p className="budget-para">{budget(details.budget)}</p>
                <p className="budget-para">{details.runtime} mins</p>
            </div>
            <div className="single-movie-info">
                <div className="single-movie-text">
                    <img className="movie-poster" src={checkPoster(props.searchStore.movieData[0].poster_path)} />
                    <p className="single-movie-description">{props.searchStore.movieData[0].overview}</p>
                </div>
                <Cast info={props.searchStore.detailedInfo} />
                <Comments />
            </div>
        </div>
    );
}));

export default Result;