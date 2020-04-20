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
    // If there is something in 'output' then results have already been trimmed, and should be trimmed again from there
    // Otherwise the originally parsedResults received from API should be used as this is the first trim
    let send;
    function checkEmpty(output) {
        if (output !== undefined) {
            return true
        }
        if  (output === undefined) {
            return false
        }
    }
    if (checkEmpty(output) === true) {
        send = output; 
    }
    if (checkEmpty(output) === false) {
        send = parsed;
    }
    console.log(send);
    return send;
}

    // Filters results, results are fetched separately
    // For testing results are provided directly from DataStore
    @action filterMovieResults(results, params) {
        let parseResults;
        let output;

        parseResults = results; // Copy results to keep store object clean

        // The following behavior is only temporary to test the client, specific logic will need to change
        // to accomodate API

        if (params.userQuery !== "") { // Before any other params, check if user has searched by name or keyword
                                        // For testing do not use keywords as that requires an API feature from Node
            let currentResults;

            currentResults = this.checkOutput(output, parseResults);

            output = currentResults.filter(item => { // Filter for the name
                if (item.original_title.toLowerCase().includes(params.userQuery.toLowerCase())) {
                    return item;
                }
            });
        }

        if (params.selectedGenre !== "Select") { // Trim down results for genre
            let currentResults;

            currentResults = this.checkOutput(output, parseResults);

            output = currentResults.filter(item => { //Filter for specified genres
                if (item.genre_ids.find(id => id === parseInt(params.selectedGenre))) { // Find ID
                    return item; // Return item if id exists
                } 
            });

        }
        if (params.selectedYear !== "Select") { // Trim down genre results to only show specified years
            let currentResults;

            currentResults = this.checkOutput(output, parseResults);

            output = currentResults.filter(item => { // Filter for year
                if (item.release_date.substr(0, 4) === params.selectedYear) { // Years are in the yyyy-mm-dd format, trim for year
                    return item;
                }
            })
        }

        if (params.selectedRatingMax !== "0") { // Trim down results based on max rating
            let currentResults;

            currentResults = this.checkOutput(output, parseResults);

            output = currentResults.filter(item => {
                if (item.vote_average <= params.selectedRatingMax) {
                    return item;
                }
            })
        }

        if (params.selectedRatingMin !== "0") { // Trim down results based on min rating
            let currentResults;

            currentResults = this.checkOutput(output, parseResults);

            output = currentResults.filter(item => {
                if (item.vote_average >= params.selectedRatingMin) {
                    return item;
                }
            })
        }
        console.log(output);

        return output;
    }

};

export default new Helpers();