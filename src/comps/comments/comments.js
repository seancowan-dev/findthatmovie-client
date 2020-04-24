import React from 'react';
import { observer, inject } from 'mobx-react';
import Form from './form/form';
import uuid from 'uuid';
import './comments.css';

const Comments = inject('dataStore', 'userStore')(observer((props) => {
    let form

    if (props.userStore.authenticated === true ) {
      form = <Form />;
    }
    let filtered = props.dataStore.comments.filter(item => {
      if (parseInt(item.title_id) === props.userStore.currentId) {
        return item;
      }
      return null
    });
    let comments = filtered.map(item => {
        return (
        <div className="comment-container" key={uuid.v4()}>
          <div className="comment-heading">
        <h4>{item.title}</h4>
        <p>{item.user + " " + new Date(item.posted)}</p> 
          </div>
        <p className="comment-body">{item.body}</p>
        </div>
        );
    })
    return (
        <section className="user-comments-container">
        <h3>Note to test users</h3>
        <p>Some comment functionality is incomplete, please try submitting some comments.</p>
        {comments}
        {form}
      </section>
    );
}));

export default Comments;