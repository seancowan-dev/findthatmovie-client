import React from 'react';
// import { Item } from 'semantic-ui-react';
import './Item.css';

const HeadItem = (props) => {
    return (
    <div className="single-movie-header-item text container">
        <div className="movie-header-items">
            <div className="movie-header-item">
                <div className="small image">
                    <img src={props.movieHeadItem.src} alt={"Movie Poster for: " + props.movieHeadItem.title} />
                </div>
                <div className="movie-header-content">
                    <div className="movie-header-description">
                        {props.movieHeadItem.overview}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default HeadItem;