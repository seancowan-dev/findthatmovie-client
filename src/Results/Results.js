import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import './Results.css';

function checkPoster(object) {
    let url;
    if (object != null) {
        url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + object;
    } else {
        url = "images/not-found.jpg";
    }

    return url;
}

const Results = inject('dataStore', 'userStore', 'searchStore')(observer((props) => {
    let output = null;

    if (props.searchStore.searchState === "display") { // If results are found
        output = props.searchStore.filteredResults.map((item, idx) => {
            return (<A href={"/results/" + item.original_title} key={idx * 5}>
                <div className="multi-movie-result-item" id={idx} key={idx}>
                    <div className="result-rating-container">
                        <div className="result-rating" name={item.title}><p className="result-inner-rating">{item.vote_average + "/10"}</p></div>
                        <img className="result-poster" src={checkPoster(item.poster_path)} alt={item.title} />
                    </div>
                </div>
            </A>
            );
        });
    } 
    if (props.searchStore.searchState === "default") {  // Default behavior before searching
        output = props.dataStore.testMovieData.results.map((item, idx) => {
            return (<A href={"/results/" + item.original_title} key={idx * 4}>
                <div className="multi-movie-result-item" id={idx} key={idx}>
                    <div className="result-rating-container">
                        <div className="result-rating" name={item.title}><p className="result-inner-rating">{item.vote_average + "/10"}</p></div>
                        <img className="result-poster" src={checkPoster(item.poster_path)} alt={item.title} />
                    </div>
                </div>
                </A>
            );
        });
    }
    if (props.searchStore.searchState === "none") {  // No results were found
        output = <div>No results found</div>
    }
    return <div className="search-results-container">
        {output}
    </div>
}));

export default Results;