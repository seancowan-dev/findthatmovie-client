import React from 'react';
import { observer, inject } from 'mobx-react';
import $ from 'jquery';
import uuid from 'uuid';
import { navigate } from 'hookrouter';
import { runInAction } from 'mobx';
import CommentsService from '../../../services/comments-service';

const Form = inject('dataStore', 'userStore')(observer((props) => {
    return (
        <form className="user-comment-form">
        <fieldset>
            <label className="user-comment-form-title"><input type="text" placeholder="enter comment title"/> Posting as: {props.userStore.authenticatedUser}</label><br />
            <textarea className="user-comment-form-body" defaultValue="comment body goes here" /><br />
            <input className="user-comment-form-submit" type="submit" value="Submit Comment" onClick={(e) => {
                e.preventDefault();
                
                // let arr = props.userStore.movieComments.slice();
                let date = + new Date();
                let comment = {
                    "movie_id": props.userStore.currentId,
                    "user_name": props.userStore.loginInfo.authenticatedUser,
                    "user_id": props.userStore.userInformation.id,
                    "comment": $('.user-comment-form-body').val(),
                    "reply" : false,
                    "updated_at": new Date(date).toISOString()
                }
                console.log(comment);
                // arr.push(comment);

                runInAction(() => CommentsService.addComment(comment));

                navigate(window.location.pathname);
            }}/>
        </fieldset>
    </form>
    );
}));

export default Form;