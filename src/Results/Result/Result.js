import React from 'react';
import Comments from '../../comps/comments/comments';
import Cast from '../../comps/cast/cast';
import ListMenu from '../../comps/add-list-menu/Menu';
import { observer, inject } from 'mobx-react';
import uuid from 'uuid';
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
    if (props.searchStore.getDetailedInfo !== undefined) {
        details = props.searchStore.getDetailedInfo;
    }
    if (props.userStore.loginInfo.getAuthenticated === true) {
        addMenu = <ListMenu />
    }
    if (props.searchStore.getLoading === false) {
        // props.userStore.setCurrentId(props.searchStore.movieData.id);
        return (
            <div className="single-movie-results" key={uuid.v4()}>
                <div className="single-movie-heading" key={uuid.v4()}>
                    <h2>{props.searchStore.getOriginalTitle}</h2>
                    <h3>{details.tagline}</h3>
                </div>
                <div className="youtube-trailer-container" key={uuid.v4()}>
                    {props.searchStore.getTrailerFragment}
                </div>
                <div className="single-movie-budglength" key={uuid.v4()}>
                    <p className="budget-para">{budget(details.budget)}</p>
                    <p className="budget-para">{details.runtime} mins</p>
                    {addMenu}
                </div>
                <div className="single-movie-info">
                    <div className="single-movie-text">
                        <img className="movie-poster" src={checkPoster(props.searchStore.getPoster)} alt="Poster of Movie"/>
                        <p className="single-movie-description">{props.searchStore.getOverview}</p>
                    </div>
                    <Cast info={props.searchStore.getDetailedInfo} />
                    <Comments />
                </div>
            </div>
        );
    }
    return (
        <div className="error">
            something went wrong please try searching again
        </div>
    )

}));

export default Result;