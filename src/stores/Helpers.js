import React from 'react';
import { action } from 'mobx';
import { navigate, A } from 'hookrouter';
import CommentsService from '../services/comments-service';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';
import UserStore from '../stores/UserStore';
import uuid from 'uuid';
import $ from 'jquery';

class Helpers {

    checker(pass) {
        if (pass !== "") {
            return true;
        }
        if (pass === "") {
            return false;
        }
    }
    
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
        } 
        else {
            console.warn(`Code: ${response.status} Message: ${response.statusText}`);
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
    makeLoginLinks(storeProps) {
        let logoutLinks = <React.Fragment key={uuid.v4()}>
                            <A href="/">Search</A>
                            <A href="/register">Register</A>
                            <A href="/login">Login</A>
                            </React.Fragment>
        let links = <React.Fragment key={uuid.v4()}>
                            <A href="/">Search</A>
                            <A href="/account">{"Logged in as: " + storeProps.loginInfo.authenticatedUser}</A>
                            <A href="/logout" onClick={(e) => {
                                e.preventDefault();
                                storeProps.setAuthenticatedUser("");
                                storeProps.setAuthenticated(false);
                                storeProps.setValidNavLinks(logoutLinks);                 
                                TokenService.clearAuthToken();
                                TokenService.clearCallbackBeforeExpiry();
                                IdleService.unregisterIdleResets();
                                navigate("/");
                            }}>Logout</A>
                        </React.Fragment>
        return {
            "links": links || "",
            "logoutLinks": logoutLinks
        };                
    } 
    handleReturningUser() {
        UserStore.setAuthenticated(true);
        let token = TokenService.readJwtToken();
        UserStore.setAuthenticatedUser(token.sub);
        UserStore.setLoaded(true);
        UserStore.cleanupUserLogin(TokenService.getAuthToken());
        let links = this.makeLoginLinks(UserStore);  // Get links to update with correct user links
        UserStore.setValidNavLinks(links.links); // Set data using mobx action
    }
    handleUserLogin() {
        // Pull data from user store
        let data = {
            userName: UserStore.loginInfo.username,
            password: UserStore.loginInfo.password,
        };
        // Create user auth token and store on client
        AuthApiService.postLogin({name: data.userName, password: data.password}).then(res => {
            if (res !== undefined) {
                // Save the user auth token
                TokenService.saveAuthToken(res.authToken);       
                // Cleanup user info
                UserStore.cleanupUserLogin(res.authToken);
                // Store important user states
                UserStore.setAuthenticated(true);
                UserStore.setAuthenticatedUser(data.userName);
                // Build fragment for links
                let links = this.makeLoginLinks(UserStore);
                UserStore.setValidNavLinks(links.links); 
            }                   
        });

    }
    checkVisible(targetElement) {
        let len = targetElement.parentElement.parentElement.nextSibling.children.length;
        let currentClass = targetElement.parentElement.parentElement.nextSibling.children[len - 1].className;
        let otherClasses;
        let visibleClass;
        let strPos;

        $('.update-comment').each((i, elem) => {
            let current = elem.className;
            current.search("active") !== -1 && current.search("inactive") === - 1 ? strPos = current.search("active") : strPos = false;

            if (strPos !== false) {
                otherClasses = current.slice(0, strPos - 1);
                let newClass = otherClasses + " inactive";
                $('.update-comment').attr("class", newClass);
            }
        });

        currentClass.search("inactive") !== -1 ? strPos = currentClass.search("inactive") : strPos = false;

        if (strPos !== false) { // inactive is a class name
          otherClasses = currentClass.slice(0, strPos - 1);
          visibleClass = currentClass.slice(strPos, currentClass.length);
        }
        if (strPos === false) {
          currentClass.search("active") !== -1 ? strPos = currentClass.search("active") : strPos = false;
          if (strPos !== false) { // inactive is a class name
            otherClasses = currentClass.slice(0, strPos - 1);
            visibleClass = currentClass.slice(strPos, currentClass.length);
          }
        }
        let newVisibility;
        visibleClass === "active" ? newVisibility = "inactive" : newVisibility = "active";

        targetElement.parentElement.parentElement.nextSibling.children[len - 1].className = otherClasses + " " + newVisibility;
        return;
      }
    checkVisibleEditReply(targetElement) {
        let currentClass = targetElement.parentElement.nextSibling.className;
        let otherClasses;
        let visibleClass;
        let strPos;
        currentClass.search("inactive") !== -1 ? strPos = currentClass.search("inactive") : strPos = false;

        if (strPos !== false) { // inactive is a class name
          otherClasses = currentClass.slice(0, strPos - 1);
          visibleClass = currentClass.slice(strPos, currentClass.length);
        }
        if (strPos === false) {
          currentClass.search("active") !== -1 ? strPos = currentClass.search("active") : strPos = false;
          if (strPos !== false) { // inactive is a class name
            otherClasses = currentClass.slice(0, strPos - 1);
            visibleClass = currentClass.slice(strPos, currentClass.length);
          }
        }

        let newVisibility;
        visibleClass === "active" ? newVisibility = "inactive" : newVisibility = "active";

        let comment = UserStore.getEditComment
        targetElement.parentElement.nextSibling.children[0].children[0].value = comment.comment;
        targetElement.parentElement.nextSibling.className = otherClasses + " " + newVisibility;
        return;
    }
    checkMessageVisible(state) {
        if (state === true) {
            return "active"
        }
        if (state === false) {
            return "inactive"
        }
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
    async checkUserPerms(comment_id) { // Check to make sure if a user is eligible to delete or edit a comment
        function ifExists(item) {
            if (item) {
                if (item !== undefined) {
                    return true;
                }
                else {
                    return false;
                }  
            } 
            else {
                return false;
            }
        }
        let returnObject = CommentsService.getCommentById(comment_id).then(res => {
            
            res.userStatus = "noaccess";
            if (ifExists(res.comments) === true || ifExists(res.replies) === true) {
                if (UserStore.userInformation.perm_level === "admin") { // First check if the user is an admin, admins can always delete or edit
                    res.userStatus = "allowed"
                }
                if (UserStore.userInformation.perm_level === "moderator") {  // If not then check if they are a mod, mods can always edit
                    res.userStatus = "allowed"
                }
                if (UserStore.userInformation.perm_level === "user") { // If user perform comment level checks

                    if (res.comments !== undefined) {
                        if (res.comments.comment !== undefined) {
                            if (res.comments.user_id === UserStore.userInformation.id){ 
                                res.userStatus = "allowed"
                            }
                        }
                    }
                    if (res.replies !== undefined) {
                        if (res.replies.comment !== undefined) {
                            if (res.replies.user_id === UserStore.userInformation.id){ 
                                res.userStatus = "allowed"
                            }
                        }
                    }
                }
            }
            return res;
        });
        return returnObject; 
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
};

export default new Helpers();