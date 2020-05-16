import React from 'react';
import { observer, inject } from 'mobx-react';
import { Container, Button, Comment, Form, Header, Message } from 'semantic-ui-react'
import CommentsService from '../../services/comments-service';
import uuid from 'uuid';
import './comments.css';
import moment from 'moment';

const Comments = inject('dataStore', 'searchStore', 'userStore', 'helpers')(observer((props) => {

    // Create render storage objects
    let replyObj;
    let comments
    
    async function deleteComment(id) {  // Handler to delete comments
      await CommentsService.deleteComment(id);
      await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
        props.userStore.setMovieComments(res);
      })
    }
    async function deleteReply(id) {  // Handler to delete replies
      await CommentsService.deleteReply(id);
      await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
        props.userStore.setMovieComments(res);
      })
    }
    async function addComments(comment) {  // Handler to add comments or replies
      await CommentsService.addComment(comment);
      await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
        props.userStore.setMovieComments(res);
      })
    }
    async function updateComments(comment) {  // Handler to update comments or replies
      await CommentsService.updateComment(comment, props.userStore.getEditComment.id);
      await CommentsService.getMovieComments(props.userStore.getCurrentId).then(res => {
        props.userStore.setMovieComments(res);
      })
    }
    const serializeComment = (target, reply = false, reply_type = false) => {  // Serializes a comment when needed
      // only pass reply = true if you are posting a reply of either type
      // only pass reply_type = true for the case of updating replies of comments
      let date = + new Date();
      let targetElem = reply_type === true ? target.parentElement.parentElement.parentElement.parentElement.parentElement.id : target.parentElement.parentElement.parentElement.id;
      
      let comment = {
          "movie_id": props.userStore.getCurrentId,
          "user_name": props.userStore.getAuthenticatedUser,
          "user_id": props.userStore.getUserId,
          "reply": reply.toString(),
          "replying_to": reply === true ? targetElem : "false",
          "comment": target.form.firstChild.firstChild.value,
          "updated_at": new Date(date).toISOString()
      }
      return comment; 
    }

    const deleteReplyComment =  (target, type) => { // Validation for deleting replies or comments
      let id = target.id
      if (type === "comment") {
        props.helpers.checkUserPerms(id).then(res => { // Check if the user has perms to edit this comment
          if (res.userStatus === "allowed") { // If they are allowed
            deleteComment(id); // Delete comment
            props.userStore.setCommentVisibility();  // Display message
            props.userStore.setCommentMessage("Comment Successfully Deleted"); // Display message
          }
          if (res.userStatus === "noaccess") { // If the user does not have permission to edit this post then display a message for them to indicate this
            props.userStore.setCommentVisibility();  // Display message
            props.userStore.setCommentMessage("Not Allowed to Delete Post");  // Display message
          }
        });  
      }
      if (type === "reply") {
        props.helpers.checkUserPerms(id).then(res => { // Check if the user has perms to edit this comment
          if (res.userStatus === "allowed") { // If they are allowed
            deleteReply(id); // Delete reply
            props.userStore.setCommentVisibility();  // Display message
            props.userStore.setCommentMessage("Reply Successfully Deleted");  // Display message
          }
          if (res.userStatus === "noaccess") { // If the user does not have permission to edit this post then display a message for them to indicate this
            props.userStore.setCommentVisibility();  // Display message
            props.userStore.setCommentMessage("Not Allowed to Delete Post");  // Display message
          }
        });  
      }
    }
    const editReplyComment = (target_for_id, base_target, target_for_class, comment = false) => { // Validation for editing replies or comments
      // Comment is false for replies and true for comments
      let id = target_for_id.id

      props.helpers.checkUserPerms(id).then(res => {
        if (res.userStatus === "allowed") { // If they are allowed
          if (res.comments) { // Check if there is a comment matching the id in the list of this user's comments
            props.userStore.setEditComment(res.comments);
          }
          if (res.replies) { // Check if there is a reply matching the id in the list of this user's comments
            props.userStore.setEditComment(res.replies);
          }
          if (comment === false) {
            let len = target_for_class.children.length
            // The last elem will always be the reply form, hide the reply form
            target_for_class.children[len - 1].className += " inactive";
          }
          if (comment === true) {
            target_for_class.className += " inactive";
          }
          // Show/hide the edit form
          props.helpers.checkVisibleEditReply(base_target);
        }
      })
    }

  if (props.searchStore.readyForTrailer === true) {  // If the page is ready for trailers it is also ready for comments
    let tree = props.userStore.makeTreedComments(props.userStore.getMovieComments); // Grab the comments tree from the store
    comments = tree.map(commentObj => {  // Comments will only be one level deep so no need for reply button on replies
      if (commentObj.replies[0] !== undefined) { // Only map replies if the comments object has replies
        replyObj = commentObj.replies.map(reply => { // Map the replies
          return (  // For each reply build and return appropriate ui elements
            <Comment 
              key={uuid.v4()} 
              id={reply.rep_id}
            >
              <Comment.Content 
                key={uuid.v4()}
              >
                <Comment.Author  
                  key={uuid.v4()} 
                  as='a'>
                    {reply.rep_user}
                </Comment.Author>
                <Comment.Metadata 
                  key={uuid.v4()}
                >
                  <div>
                    {moment().format(reply.rep_uat)}
                  </div>
                </Comment.Metadata>
                  <Comment.Text  
                    key={uuid.v4()}>{reply.rep_comment}
                  </Comment.Text>
                <Comment.Actions 
                  key={uuid.v4()}
                >
                  <Comment.Action 
                    key={uuid.v4()} 
                    as='button' 
                    className="comment-edit" 
                    onClick={(e) => {
                      editReplyComment(e.target.parentElement.parentElement.offsetParent, e.target, e.target.parentElement.parentElement.parentElement.parentElement)
                      }}>Edit
                  </Comment.Action>
                  <Comment.Action 
                    key={uuid.v4()} 
                    as='button' 
                    className="comment-delete" 
                    onClick={(e) => {
                      deleteReplyComment(e.target.parentElement.parentElement.offsetParent, "reply");            
                    }}>Delete
                  </Comment.Action>
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
                        let comment = serializeComment(e.target, true, true)
                        updateComments(comment);                        
                     }}/>
                  </Form>
              </Comment.Content>
            </Comment>
          );
        });
      }
      return (  // For each comment return the appropriate ui elements with their replies
        <Comment 
          key={uuid.v4()} 
          id={commentObj.id}
        >
        <Comment.Content 
          key={uuid.v4()}
        >
          <Comment.Author 
            key={uuid.v4()} 
            as='a'>
            {commentObj.user_name}
          </Comment.Author>
          <Comment.Metadata 
            key={uuid.v4()} 
          >
            <div>
              {moment().format(commentObj.updated_at)}
            </div>
          </Comment.Metadata>
            <Comment.Text 
              key={uuid.v4()}>{commentObj.comment}
            </Comment.Text>
          <Comment.Actions 
            key={uuid.v4()}
          >
            <Comment.Action 
              key={uuid.v4()} 
              as='button' 
              onClick={(e) => {
                props.helpers.checkVisible(e.target)
                }}>Reply
            </Comment.Action>
            <Comment.Action 
              key={uuid.v4()} 
              as='button' 
              className="comment-edit" 
              onClick={(e) => {
                editReplyComment(e.target.parentElement.parentElement.parentElement, e.target, e.target.offsetParent.lastChild.lastChild, true)
                }}>Edit
            </Comment.Action>
            <Comment.Action 
              key={uuid.v4()} 
              as='button' 
              className="comment-delete" 
              onClick={(e) => {
                deleteReplyComment(e.target.parentElement.parentElement.parentElement, "comment")
                }}>Delete
            </Comment.Action>               
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
                        let comment =  serializeComment(e.target, false);
                        updateComments(comment);
                     }}/>
                  </Form>
        </Comment.Content>
        <Comment.Group key={uuid.v4()} threaded>
          {commentObj.replies[0] !== undefined ? replyObj : ""}
          <Form key={uuid.v4()} reply className={"inactive"}>
                    <Form.TextArea key={uuid.v4()} />
                    <Button
                      key={uuid.v4()}
                      content='Add Reply'
                      labelPosition='left'
                      icon='edit'
                      primary
                      onClick={(e) => {
                        let comment = serializeComment(e.target, true);
                        addComments(comment);
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
            <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.userStore.commentMessage.visible)} content={props.userStore.commentMessage.message} />
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
                let comment = serializeComment(e.target, false);
                addComments(comment);
            }}/>
          </Form>
        </Comment.Group>
      </Container>
    );
}));

// Pull stylesheet for semantic UI - this is the method directly from their documentation
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default Comments;