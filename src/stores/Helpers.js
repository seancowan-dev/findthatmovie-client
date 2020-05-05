import { action } from 'mobx';

class Helpers {
    
    buildDetailedMovieParams() { // Prepare params for detailed movie information queries
        let params = {
            api_key: "7658594a35b754254b048a6ac98e566d",
            language: "en-US"
        }

        return params;
    }

    encodeQueryParams(params) { // Formats a given params object in the 'key=value&key=value' format
        const queryItems = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }

    buildYouTubeQueryParams(searchQuery, vidLength, nextPageToken) { // Prepare the parameters for the queries to the YouTube API; if getting multiple results pass nextPageToken
        let params = {
            key: "AIzaSyDDvSrO4-9C87TaVW3jodmB3UhiXhA66W0",
            part: "snippet",
            maxResults: 10,
            q: searchQuery,
            type: "video",
            videoDuration: vidLength // must be either "short" "medium" or "long"
        }

        if (nextPageToken) {
            params.pageToken = nextPageToken;
        }
        return params;
    }

    handleErrors(response) { // prepares error message for HTTP request errors
        if (response.ok === true) {
            return response.json();
        } else {
            throw new Error("Code " + response.status + " Message: " + response.statusText)
        }
    }

    registrationValidator(inputObject) {
        let valid = false;

        // if (someFunctionToCheckForSafeName(inputObject.userName)) {
            //Eventually this will check for worksafe or duplicate usernames
        // }
        if (inputObject.email === inputObject.emailConfirm) {
            if (inputObject.password === inputObject.passwordConfirm) {
                // If we reach here email and passwords both match, validate registration
                valid = true;
                return valid;
            } else {
                return valid;
            }
        } else {
            return valid;
        }
    }

    checkOutput(output, parsed) { 
        // If there is something in 'output' then results have already been trimmed, and should not be trimmed again from there
        // Otherwise the originally parsedResults received from API should be used as this is the first trim
        let send;
        function checkNotEmpty(output) {
            if (output !== undefined) {
                return true
            }
            if  (output === undefined) {
                return false
            }
        }
        if (checkNotEmpty(output) === true) { // Output has some data already in it
            send = output; 
        }
        if (checkNotEmpty(output) === false) {  // Output does not have data already in it
            send = parsed;
        }
        return send;
    }

    checkPageCount(resultLength) {
        let dividend = resultLength / 20;
        let mod = dividend % 1;
        let output = 1;
        if (mod === 0) {
            output = dividend;
        }
        if (mod !== 0) {
            if (dividend <= 1) {
                output = 1;
            }
            else {
                output = dividend.toFixed(0);
            } 
        }
        return output;
    }

    getYear() {
        return new Date().getFullYear();
    }
    @action buildMovieQueryParams(page, query = undefined, rating = undefined, year = undefined, genre = undefined) { // Prepare the parameters for TMDB API queries other than Autocomplete
        let params = {
            api_key: "7658594a35b754254b048a6ac98e566d",
            language: "en-US"
        }
        params.include_adult = false;
        if (page > 0) { // If a specific query page is requested
            params.page = page;
        }
        if (query !== undefined) {
            params.query = query;
        } else {
            if (year !== "Select") {
                params.primary_release_year = year;
            }
            if (year === "Select") {
                params.primary_release_year = this.getYear();
            }
            if (genre !== "Select") {
                params.with_genres = genre;
            }
            if (rating !== "Min") { // If a minimum rating has been specificed
                params["vote_average.gte"] = rating;
            }
        }

        return params;
    }
    // Filters results, results are fetched separately
    // For testing results are provided directly from DataStore
    @action filterMovieResults(results, params) {
        let parseResults = [];
        let output;
        let currentResults;

        if (results.length !== 0) {
            parseResults = results.filter(item => {
                if (item.length !== 0) {
                    return item;
                }
                return null;
            })
        }
        if (parseResults.length !== 0) {
            if (params.selectedGenre !== "Select") { // Trim down results for genre
                    currentResults = this.checkOutput(output, parseResults);
                    if (currentResults.length > 0) {
                        output = currentResults.filter(item => { //Filter for specified genres
                            if (item.genre_ids.find(id => id === parseInt(params.selectedGenre))) { // Find ID
                                return item; // Return item if id exists
                            }
                            return null
                        });
                    }
            }
            if (params.selectedYear !== "Select") { // Trim down genre results to only show specified years

                currentResults = this.checkOutput(output, parseResults);
                if (currentResults.length > 0) {
                    output = currentResults.filter(item => { // Filter for year
                        if (item.release_date.substr(0, 4) === params.selectedYear) { // Years are in the yyyy-mm-dd format, trim for year
                            return item;
                        }
                        return null
                    })
                }
            }

            if (params.selectedRatingMin !== "Min") { // Trim down results based on min rating
                currentResults = this.checkOutput(output, parseResults);
                if (currentResults.length > 0) {
                    output = currentResults.filter(item => {
                        if (item.vote_average >= params.selectedRatingMin) {
                            return item;
                        }
                        return null
                    })
                }
            }
        }
        if (output !== undefined) {
            return output;
        } else {
            return results;
        } 
    }
    // observerForResults() { // Watch for when user sees the bottom of page the first time,  after which use load more button
    //                         // Rationale here is that only 20 results are given per API call and 20 results has the page looking spare on first load
    //                         // But infinitely scrolling prevents the user from ever seeing the footer
    //     let observer = new IntersectionObserver(
    //         (entries, observer) => {
    //             entries.forEach(entry => {
    //                 if (entry.isIntersecting === true) {
    //                     SearchStore.getMovieList(true).then(res => {
    //                         SearchStore.searchResults.push(res);
    //                     })
    //                     if (document.querySelector(`.movie-list-end-${SearchStore.pageOld}`)) {
    //                         observer.disconnect();   
    //                     }                    
    //                 }
    //             });
    //         }, {
    //             root: document.window,
    //             rootMargin: "0px"
    //         }
    //     );
    //     if (document.querySelector(`.movie-list-end-${SearchStore.page}`)) {
    //         observer.observe(document.querySelector(`.movie-list-end-${SearchStore.page}`));
    //     }
    // }
};

export default new Helpers();