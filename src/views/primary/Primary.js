import React from 'react';
import Search from '../../Search/Search';
import Results from '../../Results/Results';
import Nav from '../../Nav/Nav';
import { inject, observer } from 'mobx-react';
import { A } from 'hookrouter';
import uuid from 'uuid';
import './Primary.css';

const Primary = inject('searchStore', 'userStore')(observer((props) => {
    window.addEventListener("load", (e) => {
        if (window.localStorage.getItem("findthatmovie-modal-token") === "true") {
            props.userStore.toggleWelcomeModal("hidden");
        }
    });
    props.searchStore.noLoad = false; // The page should load by default
    props.searchStore.getMovieList(false).then(res => { // Get the list of movies
        props.searchStore.searchResults.push(res); // Store the list of movies
    }); 
    return <>
        <div className="welcome-modal onscreen">
            <div className="welcome-modal-text container">
                <h1>Welcome to Findthatmovie</h1>
                <p><strong>Who was this site made for?</strong></p> <br />
                <p>This site was made for anyone that watches movies and wants an easy to way to find movies and keep track of movies they have watched.</p><br />
                <p><strong>What can I do on the site?</strong></p> <br />
                <p>You can find movies and watch their trailers, you can also leave comments to discuss the movie with other users.  Also you can make lists of movies you've seen by creating a list in your account control panel. Once you have made list you can add movies to it directly from the movie's page.</p><br />
                <p><strong>How do I use the site?</strong></p> <br />
                <div>
                    <p>1. Click the close button in the bottom right corner of  this modal</p>
                    <p>2. Either scroll down the list to see the most recently released movies, or search for a movie by title, keyword, genre, rating, or release year.</p>
                    <p>3. To get full functionality you must register a new user account.  Once you have done so and log in and go to your account page.</p>
                    <p>4. Click on 'Your Lists', click New List and type the name of your list</p>
                    <p>5. Now go and browse movies, when you view a movie's specific page simply click 'Add To List', click the name of your list, and you're done! The movie is now added to your list.</p>
                </div>
            <button
                className="buttons"
                onClick={(e) => {
                    e.preventDefault();
                    props.userStore.toggleWelcomeModal(false);
                }}
            >Close</button>
            </div>

        </div>
        <Nav key={uuid.v4()} />
        <div className="parallax"></div>
        <div className="search-form-container"><Search /></div>
        <div className="results"><Results /></div> 
    </>
}));

export default Primary;