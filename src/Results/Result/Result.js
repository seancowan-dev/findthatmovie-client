import React from 'react';
import Comments from '../../comps/comments/comments';
import Cast from '../../comps/cast/cast';
import HeadItem from './comps/Item';
import ListMenu from '../../comps/add-list-menu/Menu';
import { Message } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import ListsService from '../../services/lists-service';
import TokenService from '../../services/token-service';
import uuid from 'uuid';
import './Result.css';

function checkPoster(object) {
    let url;
    if (object != null) {
        url = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + object;
    } else {
        url = "https://seancowan-dev.github.io/findthatmovie/images/not-found.jpg";
    }

    return url;
}

function budget(budg) {
    return "$" + parseInt(budg).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

const Result = inject('searchStore', 'userStore', 'helpers')(observer((props) => {
    let details;
    let addMenu;
    
    async function handleUserLists() {
        await ListsService.getUserLists(TokenService.readJwtToken().user_id)
        .then(res => {
            props.userStore.setUserLists(res); // Get user list
            props.userStore.toggleListLoaded(true); // Set loading to tru
        });
    }
    if (props.userStore.listLoaded !== true && props.userStore.getAuthenticated === true) {
        handleUserLists();
    }
    if (props.searchStore.getDetailedInfo !== undefined) {
        details = props.searchStore.getDetailedInfo;
    }
    if (props.userStore.getAuthenticated === true) {
        let list_data = [];
        let grouped = props.userStore.userLists.reduce((acc, curr) => { // Group comments into objects by ID
            acc[curr.list_name] = [...acc[curr.list_name] || [], curr];
            return acc;
          }, []);
          Object.values(grouped).map((val, idx, arr) => {
            if (val.length === 1) { // If there is only one item in a group then it is a list without items
                let pushObj = val[0]; // Copy single object
                val[0].item_id !== "" ? pushObj.items = val : pushObj.items = false;
                list_data.push(pushObj); // Push to list_data
            }
            if (val.length > 1) { // If the length is greater than one then there are list items
                let pushObj = val[0]; // Copy single object
                pushObj.items = val;  // Push other vals into items property
                list_data.push(pushObj); // Push to list_data
            }
            return null;
          })
        addMenu = <ListMenu list_data={list_data}/>
        
    }
    if (props.searchStore.getLoading === false) {
        let movieHeadItem = {
            src: checkPoster(props.searchStore.getPoster),
            overview: props.searchStore.getOverview,
            title: props.searchStore.getOriginalTitle
        }
        return (
            <div className="single-movie-results container" key={uuid.v4()}>
                <div className="single-movie-heading" key={uuid.v4()}>
                    <h2>{props.searchStore.getOriginalTitle}</h2>
                    <h3>{details.tagline}</h3>
                </div>
                <div className="youtube-trailer-container" key={uuid.v4()}>
                    {props.searchStore.getTrailerFragment}
                </div>
                <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.searchStore.addListMessage.visible)} content={props.searchStore.addListMessage.message} />
                <div className="single-movie-budglength" key={uuid.v4()}>
                    <p className="budget-para">{budget(details.budget)}</p>
                    <p className="budget-para">{details.runtime} mins</p>
                    {props.userStore.getAuthenticated === true ? addMenu : ""}
                </div>
                <div key={uuid.v4()} className="single-movie-info container text">
                    <HeadItem movieHeadItem={movieHeadItem} />
                    <div className="container text">
                        <Cast info={props.searchStore.getDetailedInfo} />
                    </div>
                    <div className="container text">
                        <Comments />
                    </div>
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