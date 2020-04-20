import React from 'react';
import { observable, action } from 'mobx';
import Helpers from './Helpers';

class SearchStore {

    //Set default form fields

    @observable searchParams = {
         selectedGenre: "Select",
         selectedYear: "Select",
         selectedCountry: "Select",
         selectedRatingMin: "0",
         selectedRatingMax: "0",
         userQuery: ""
    }

    @observable filteredResults = [];
    @observable movieData = [];
    @observable detailedInfo = {};
    @observable trailerFragment;

    @observable searchState = "default"; 
    // 'default' - when site first loads, 'display' - if results are not empty, 'none' - if no results found

    @action getDetailedInfo() {
        return this.detailedInfo;
    }
    @action async getDetailedMovieInfo(id) { // Get more detailed information about the specified movie, needs ID passed from getMovieInfoByName()
        const baseURLInfo = "https://api.themoviedb.org/3/movie/";
        let queryString = Helpers.encodeQueryParams(Helpers.buildDetailedMovieParams());
        let requestURLInfo = baseURLInfo + id + "?" + queryString;
        let requestURLReview = baseURLInfo + id + "/reviews?" + queryString;
        let requestURLCast = baseURLInfo + id + "/credits?" + queryString;
    
        let requestDataInfo = await fetch(requestURLInfo)
            .then(response => Helpers.handleErrors(response))
            .then(responseJSON => {
    
                return responseJSON;
            })
            .catch(e => alert(e));
    
        let requestDataReview = await fetch(requestURLReview)
            .then(response => Helpers.handleErrors(response))
            .then(responseJSON => {
                return responseJSON;
            })
            .catch(e => alert(e));
    
        let requestDataCast = await fetch(requestURLCast)
            .then(response => Helpers.handleErrors(response))
            .then(responseJSON => {
                return responseJSON
            })
            .catch(e => alert(e));
    
        let returnObject = {
            budget: requestDataInfo.budget,
            tagline: requestDataInfo.tagline,
            runtime: requestDataInfo.runtime,
            backdrop_path: requestDataInfo.backdrop_path,
            reviews: [],
            cast: []
        };
    
        requestDataReview.results.forEach((item, index) => {
            let obj = {
                author: item.author,
                content: item.content,
                url: item.url
            }
            returnObject.reviews.push(obj);
        });
    
        (function () {
            
            if (requestDataCast.cast.length !== 0) {
                for (let i = 0; i < requestDataCast.cast.length && i <= 6; i++) {
                    let obj = {};
                    obj.character = requestDataCast.cast[i].character;
                    obj.actor = requestDataCast.cast[i].name;
                    if (requestDataCast.cast[i].profile_path != null) {
                        obj.url = "https://image.tmdb.org/t/p/w500/" + requestDataCast.cast[i].profile_path;
                    } else {
                        obj.url = "images/no-cast.png";
                    }
                    returnObject.cast.push(obj);
                }
            } else {
                for (let i = 0; i <= 6; i++) {
                    let obj = {};
                    obj.character = "No character information";
                    obj.actor = "No actor information";
                    obj.url = "images/no-cast.png";
                }
            }
    
        })();    
        this.detailedInfo = returnObject;
    }
    
    async getYouTubeVideos(searchQuery, vidLength, resultsPage) { // Search for youtube-trailers by movie name and year
        const baseURL = "https://www.googleapis.com/youtube/v3/search?"
        let queryString = Helpers.encodeQueryParams(Helpers.buildYouTubeQueryParams(searchQuery, vidLength, resultsPage));
        let requestURL = baseURL + queryString;
    
        let requestData = await fetch(requestURL) // Fetch data
            .then(response => Helpers.handleErrors(response)) // Check data
            .then(responseJSON => {
                return responseJSON // return JSON
            })
            .catch(e => alert(e));
    
    
        let returnObject = { // build returnObject
            urls: [],
            snippets: []
        }
    
        for (let i = 0; i < requestData.items.length; i++) {
            returnObject.urls[i] = requestData.items[i].id.videoId;
            returnObject.snippets[i] = requestData.items[i].snippet;
        }
    
        return returnObject;
    }

    @action displayYouTubeTrailer(store) { // Display an appropriate trailer
        let query = store.movieData[0].original_title + " " + store.movieData[0].release_date.substr(0,4);
    
        let returnObject = Promise.all([this.getYouTubeVideos(query + " trailer", "short")])
            .then(returnObject => {
                return <iframe width="1280px" height="720px" className="youtube-video" src={"https://www.youtube.com/embed/" + returnObject[0].urls[0]} frameBorder="0" allowFullScreen></iframe>
            });

        return returnObject;
    }
}

export default new SearchStore();