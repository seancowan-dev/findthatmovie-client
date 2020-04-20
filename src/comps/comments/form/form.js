import React from 'react';
import { observer, inject } from 'mobx-react';
import $ from 'jquery';
import uuid from 'uuid';
import { A, navigate } from 'hookrouter';
import { runInAction } from 'mobx';

const Form = inject('dataStore', 'userStore')(observer((props) => {
    return (
        <form className="user-comment-form">
        <fieldset>
            <label className="user-comment-form-title"><input type="text" placeholder="enter comment title"/> Posting as: {props.userStore.authenticatedUser}</label><br />
            <textarea className="user-comment-form-body" defaultValue="comment body goes here" /><br />
            <input className="user-comment-form-submit" type="submit" value="Submit Comment" onClick={(e) => {
                e.preventDefault();
                
                let arr = props.dataStore.comments.slice();

                let comment = {
                    id: uuid.v4(),
                    title_id: props.userStore.currentId,
                    user: props.userStore.authenticatedUser,
                    body: $('.user-comment-form-body').val(),
                    posted: +new Date
                }

                arr.push(comment);

                runInAction(() => props.dataStore.comments = arr);

                navigate(window.location.pathname);
            }}/>
        </fieldset>
    </form>
    );
}));

export default Form;