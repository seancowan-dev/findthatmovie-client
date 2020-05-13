import React from 'react';
import { observer, inject } from 'mobx-react';
import { Container, Button, Comment, Form, Header, Message } from 'semantic-ui-react'
import CommentsService from '../../services/comments-service';
import uuid from 'uuid';
import './comments.css';
import moment from 'moment';

const Comments = inject('dataStore', 'searchStore', 'userStore', 'helpers')(observer((props) => {
    let replyObj;
    let comments
  if (props.searchStore.readyForTrailer === true) {
    let tree = props.userStore.makeTreedComments(props.userStore.getMovieComments);
    console.log(tree);
    comments = tree.map(commentObj => {  // Comments will only be one level deep so no need for reply button on replies
      if (commentObj.replies[0] !== undefined) {
        replyObj = commentObj.replies.map(reply => {
          return (  // For each reply build and return appropriate ui elements
            <Comment key={uuid.v4()} id={reply.rep_id}>
              <Comment.Content key={uuid.v4()}>
                <Comment.Author  key={uuid.v4()} as='a' key={uuid.v4()}>{reply.rep_user}</Comment.Author>
                <Comment.Metadata key={uuid.v4()}>
                  <div>{ moment().format(reply.rep_uat) }</div>
                </Comment.Metadata>
                  <Comment.Text  key={uuid.v4()}>{reply.rep_comment}</Comment.Text>
                <Comment.Actions key={uuid.v4()}>
                  <Comment.Action key={uuid.v4()} as='button' className="comment-edit" onClick={(e) => {
                    let target = e.target; // Copy target for use in functions
                    props.helpers.checkUserPerms(e.target.parentElement.parentElement.offsetParent.id).then(res => { // Check if the user has perms to edit this comment
                      if (res.userStatus === "allowed") { // If they are allowed
                        if (res.comments) { // Check if there is a comment matching the id in the list of this user's comments
                          props.userStore.setEditComment(res.comments);
                        }
                        if (res.replies) { // Check if there is a reply matching the id in the list of this user's comments
                          props.userStore.setEditComment(res.replies);
                        }

                        // Get the length of the threaded comments for this section
                        let len = target.parentElement.parentElement.parentElement.parentElement.children.length;

                        // The last elem will always be the reply form, hide the reply form
                        target.parentElement.parentElement.parentElement.parentElement.children[len - 1].className += " inactive";

                        // Show the edit form
                        props.helpers.checkVisibleEdit(target);
                      }
                      if (res.userStatus === "noaccess") { // If the user does not have permission to edit this post then display a message for them to indicate this
                        props.userStore.setCommentVisibility();
                        props.userStore.setCommentMessage("Not Allowed to Edit Post");
                      }
                    });              
                  }}>Edit</Comment.Action>
                  <Comment.Action key={uuid.v4()} as='button' className="comment-delete" onClick={(e) => {console.log("working")}}>Delete</Comment.Action>
                </Comment.Actions>
                <Form key={uuid.v4()} reply className={"update-comment inactive"}>
                    <Form.TextArea key={uuid.v4()}/>
                    <Button
                      key={uuid.v4()}
                      content='Update Comment'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={(e) => {
                        console.dir(e.target);
                        let reply = true;
                        let date = + new Date();
                        let comment = {
                            "movie_id": props.userStore.getCurrentId,
                            "user_name": props.userStore.getAuthenticatedUser,
                            "user_id": props.userStore.getUserId,
                            "reply": reply === true ? "true" : "false",
                            "replying_to": reply === true ? e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id : "false",
                            "comment": e.target.form.firstChild.firstChild.value,
                            "updated_at": new Date(date).toISOString()
                        }                        
                        async function postComments() { 
                          await CommentsService.updateComment(comment, props.userStore.getEditComment.id);
                          await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
                            props.userStore.setMovieComments(res);
                          })
                        }
                        postComments();
                     }}/>
                  </Form>
              </Comment.Content>
            </Comment>
          );
        });
      }
      return (  // For each comment return the appropriate ui elements with their replies
        <Comment key={uuid.v4()} id={commentObj.id}>
        <Comment.Content key={uuid.v4()}>
          <Comment.Author key={uuid.v4()} as='a'>{commentObj.user_name}</Comment.Author>
          <Comment.Metadata key={uuid.v4()} >
            <div>{ moment().format(commentObj.updated_at) }</div>
          </Comment.Metadata>
            <Comment.Text key={uuid.v4()}>{commentObj.comment}</Comment.Text>
          <Comment.Actions key={uuid.v4()}>
            <Comment.Action key={uuid.v4()} as='button' onClick={(e) => {
                  props.helpers.checkVisible(e.target)

              }}>Reply</Comment.Action>
            <Comment.Action key={uuid.v4()} as='button' className="comment-edit" onClick={(e) => {
              let target = e.target;
              props.helpers.checkUserPerms(e.target.parentElement.parentElement.parentElement.id).then(res => {
                if (res.userStatus === "allowed") {
                  if (res.comments) {
                    props.userStore.setEditComment(res.comments);
                  }
                  if (res.replies) {
                    props.userStore.setEditComment(res.replies);
                  }
                  props.helpers.checkVisibleEdit(target);
                  // props.userStore.setCommentVisibility();
                  // props.userStore.setCommentMessage("Comment Posted");
                }
                if (res.userStatus === "noaccess") {
                  props.userStore.setCommentVisibility();
                  props.userStore.setCommentMessage("Not Allowed to Edit Post");
                }
              });              
            }}>Edit</Comment.Action>
            <Comment.Action key={uuid.v4()} as='button' className="comment-delete" onClick={(e) => {console.log("working")}}>Delete</Comment.Action>               
          </Comment.Actions>
          <Form key={uuid.v4()} reply className={"update-comment inactive"}>
                    <Form.TextArea key={uuid.v4()} />
                    <Button
                      key={uuid.v4()}
                      content='Update Comment'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={(e) => {
                        let reply = false;
                        let date = + new Date();
                        let comment = {
                            "movie_id": props.userStore.getCurrentId,
                            "user_name": props.userStore.getAuthenticatedUser,
                            "user_id": props.userStore.getUserId,
                            "reply": reply === true ? "true" : "false",
                            "replying_to": reply === true ? e.target.parentElement.parentElement.parentElement.id : "false",
                            "comment": e.target.form.firstChild.firstChild.value,
                            "updated_at": new Date(date).toISOString()
                        }                        
                        async function postComments() { 
                          await CommentsService.updateComment(comment, props.userStore.getEditComment.id);
                          await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
                            props.userStore.setMovieComments(res);
                          })
                        }
                        postComments();
                     }}/>
                  </Form>
        </Comment.Content>
        <Comment.Group key={uuid.v4()} threaded>
          {replyObj !== undefined ? replyObj : ""}
          <Form key={uuid.v4()} reply className={"inactive"}>
                    <Form.TextArea key={uuid.v4()} />
                    <Button
                      key={uuid.v4()}
                      content='Add Reply'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={(e) => {
                        let reply = true;
                        let date = + new Date();
                        let comment = {
                            "movie_id": props.userStore.getCurrentId,
                            "user_name": props.userStore.getAuthenticatedUser,
                            "user_id": props.userStore.getUserId,
                            "reply": reply === true ? "true" : "false",
                            "replying_to": reply === true ? e.target.parentElement.parentElement.parentElement.id : "false",
                            "comment": e.target.form.firstChild.firstChild.value,
                            "updated_at": new Date(date).toISOString()
                        }
                        async function postComments() { 
                          await CommentsService.addComment(comment);
                          await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
                            props.userStore.setMovieComments(res);
                          })
                        }
                        postComments();
                        // props.userStore.postComment(e.target, true);
                        // props.userStore.setMovieComments(this.currentId);
                     }}/>
                  </Form>
        </Comment.Group>
        
  
      </Comment>
      );
    })
  }

    return (  // Build the boilerplate for the the ui elements and input the comments
        <Container key={uuid.v4()} className="user-comments-container">
          <Comment.Group key={uuid.v4()}>
            <Header as='h3' dividing  key={uuid.v4()} >
              Comments
            </Header>
            <Message key={uuid.v4()} floating className={props.helpers.checkCommentMessageVisible(props.userStore.commentMessage.visible)} content={props.userStore.commentMessage.message} />
            {comments}
          <Form reply key={uuid.v4()}>
            <Form.TextArea key={uuid.v4()} />
            <Button 
              key={uuid.v4()}
              content='Add Reply' 
              labelPosition='left' 
              icon='edit' 
              primary 
              onClick={(e) => {
                let reply = false;
                let date = + new Date();
                let comment = {
                    "movie_id": props.userStore.getCurrentId,
                    "user_name": props.userStore.getAuthenticatedUser,
                    "user_id": props.userStore.getUserId,
                    "reply": reply === true ? "true" : "false",
                    "replying_to": reply === true ? e.target.parentElement.parentElement.parentElement.id : "false",
                    "comment": e.target.form.firstChild.firstChild.value,
                    "updated_at": new Date(date).toISOString()
                }
                async function postComments() { 
                  await CommentsService.addComment(comment);
                  await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
                    props.userStore.setMovieComments(res);
                  })
                }
                postComments();
            }}/>
          </Form>
        </Comment.Group>
      </Container>
    );
}));

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default Comments;