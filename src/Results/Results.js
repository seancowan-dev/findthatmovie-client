import React from 'react';
import { observer, inject } from 'mobx-react';
import { A } from 'hookrouter';
import debounce from 'lodash.debounce';
import SearchStore from '../stores/SearchStore';
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

// Watch for when user sees bottom of page until 5 pages have been loaded by infinite scroll (100 movie titles)
// After which the user will use the show more button to continue loading
// This should help the app be more performance friendly for mobile users
window.addEventListener('scroll', debounce((ev) => {
if (SearchStore.noLoad === false) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (SearchStore.page <= 5) {  // Placed in timeout to prevent results loading too rapidly on slower connections
            setTimeout(() => {SearchStore.getMovieList(true).then(res => {
                    SearchStore.searchResults.push(res);
                })
            }, 700);
        }
    }
}
}, 100), true)

const Results = inject('dataStore', 'userStore', 'searchStore', 'helpers')(observer((props) => {
    let output = null;

    if (props.searchStore.searchState === "none") {  // No results were found
        output = <div>No results found</div>
    }
    if (props.searchStore.searchResults.length > 0) {
        if (props.searchStore.searchState === "display") { // If results are found
            output = props.searchStore.searchResults.map((result, primeIdx) => {
            return result.results.slice().map((item, idx) => {
                    return (<A href={"/results/" + item.original_title} key={idx * 5}>
                        <div className={"multi-movie-result-item"} id={"movie-item-" + (primeIdx + 1) * idx} key={idx}>
                            <div className="result-rating-container">
                                <div className="result-rating" name={item.title}><p className="result-inner-rating">{item.vote_average + "/10"}</p></div>
                                <img className="result-poster" src={checkPoster(item.poster_path)} alt={item.title} />
                            </div>
                        </div>
                    </A>
                    );
                })
            });
        } 
        if (props.searchStore.searchState === "default") {  // Default behavior before searching
            output = props.searchStore.searchResults.map((result, primeIdx) => {
                return result.results.slice().map((item, idx) => {
                    return (<A href={"/results/" + item.original_title} key={idx * 4}>
                        <div className={"multi-movie-result-item"} id={"movie-item-" + (primeIdx + 1) * idx} key={idx}>
                            <div className="result-rating-container">
                                <div className="result-rating" name={item.title}><p className="result-inner-rating">{item.vote_average + "/10"}</p></div>
                                <img className="result-poster" src={checkPoster(item.poster_path)} alt={item.title} />
                            </div>
                        </div>
                        </A>
                    );
                })
            });
        }
    }

    return <div className="search-results-container">
        {output}
        <button onClick={(e) => {
            if (props.searchStore.page < props.searchStore.total_pages) {
                props.searchStore.getMovieList(true).then(res => {
                    console.log(props.searchStore.page)
                    props.searchStore.searchResults.push(res);
                })
            }
            else {
                alert("This temp alert means there is no more")
            }
            }}>Load More</button>
    </div>
}));

export default Results;