import React from 'react';
import { observable, action } from 'mobx';
import Helpers from './Helpers';
import config from '../services/config';
import clone from 'lodash.clone';

class SearchStore {
    
    // Controlled Form Parameters

    @observable searchParams = {
         selectedGenre: "Select",
         selectedYear: "Select",
         selectedCountry: "Select",
         selectedRatingMin: "Min",
         userQuery: "",
         noLoad: false
    }

        // Search States
    @observable page = 0;
    @observable pageOld = null;
    @observable total_pages = null;

    // Movie Data Stores
    @observable searchResults = [];
    @observable movieData = null;
    @observable detailedInfo = {};
    @observable trailerFragment;

    // State Variables for page navigation
    @observable searchState = "default"; 
    // 'default' - when site first loads, 'display' - if results are not empty, 'none' - if no results found

    // YouTube and Google API actions
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

    async displayYouTubeTrailer(store) { // Display an appropriate trailer
        let query = store.original_title + " " + store.release_date.substr(0,4);
    
        let returnObject = await this.getYouTubeVideos(query + " trailer", "short")
            .then(res => {
                return <iframe title="YouTube Trailer" width="1280px" height="720px" className="youtube-video" src={"https://www.youtube.com/embed/" + res.urls[0]} frameBorder="0" allowFullScreen></iframe>
            });

        this.trailerFragment = returnObject;
    }

    // TMDB API actions

        // Helper Actions
        @action getDetailedInfo() {
            return this.detailedInfo;
        }
        //


    async getDetailedMovieInfo(id) { // Get more detailed information about the specified movie, needs ID passed from getMovieInfoByName()
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

    @action async getMovieList(newPage = false) { // Get a list of movies by year or by genre, or by both; if no year is entered default to current year
        const baseURLNoKeyword = `${config.EXT_API_ENDPOINT}/discover/movie?`;
        const baseURLKeyword = `${config.EXT_API_ENDPOINT}/search/movie?`
        let queryString = "";
        let requestData;

        if (newPage === false) { // If newPage is false, then ensure the global page count variable is 1, and then begin GET request.  
            this.page = 1;
        } else { // If newPage is true, then increment the global page count variable by 1 and fetch new data.
            this.pageOld = clone(this.page);
            this.page++;
        }
            // Due to certain inconsistencies in the TMDB API
            // It is not possible to use the discover endpoint To search for multiple keywords or movie titles
            // Nor can the search movie endpoint be used to search with query params for genre, year, etc.
        // If the user has not entered any query text we may use discover to find full pages of movies
        if (this.searchParams.userQuery === "") { 
            this.noLoad = false;
            queryString = Helpers.encodeQueryParams(Helpers.buildMovieQueryParams(this.page, undefined, this.searchParams.selectedRatingMin, this.searchParams.selectedYear, this.searchParams.selectedGenre))
            let requestURLNoKeyword = baseURLNoKeyword + queryString;
            requestData = await fetch(requestURLNoKeyword) // Fetch data
                .then(response => Helpers.handleErrors(response)) // Check data
                .then(responseJSON => {
                    responseJSON.length = responseJSON.results.length;
                    responseJSON.total_results = responseJSON.results.length;
                    responseJSON.page = Helpers.checkPageCount(responseJSON.results.length);
                    return responseJSON // return JSON
                })
                .catch(e => alert(e));
        }

        // If the user has entered query text then we cannot use the discover endpoint
        if (this.searchParams.userQuery !== "") {
            console.log("why");
            this.noLoad = true;
            queryString = Helpers.encodeQueryParams(Helpers.buildMovieQueryParams(this.page, this.searchParams.userQuery))
            let requestURLKeyword = baseURLKeyword + queryString;
        
            requestData = await fetch(requestURLKeyword) // Fetch data
                .then(response => Helpers.handleErrors(response)) // Check data
                .then(responseJSON => {
                    let results = responseJSON.results;
                    // Since we can't search movie titles using discover we must now manually filter results
                    let filteredRes = Helpers.filterMovieResults(results, this.searchParams);
                    responseJSON.results = [];
                    responseJSON.results = filteredRes;
                    responseJSON.length = responseJSON.results.length;
                    responseJSON.total_results = responseJSON.results.length;
                    responseJSON.page = Helpers.checkPageCount(responseJSON.results.length);
                    return responseJSON // return JSON
                })
                .catch(e => alert(e));
        }

        return requestData;
    }

    @action setSingleMovieResults(movieData, id) {
        this.movieData = movieData;
        this.getDetailedMovieInfo(id);
        this.displayYouTubeTrailer(movieData)
    }
}

export default new SearchStore();