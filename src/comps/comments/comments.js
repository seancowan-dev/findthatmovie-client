import React from 'react';
import { observer, inject } from 'mobx-react';
import { Message } from 'semantic-ui-react'
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

      if (comment.comment !== "") {
        return comment;
      }
      if (comment.comment === "") {
        comment = false;
        props.userStore.setCommentVisibility();  // Display message
        props.userStore.setCommentMessage("Cannot post a blank comment, please enter some text in your comment."); // Display message
        return comment;
      }

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
            target_for_class.children[len - 1].className += " active";
          }
          if (comment === true) {
            target_for_class.className += " active";
          }
          // Show/hide the edit form
          props.helpers.checkVisibleEditReply(base_target);
        }
      })
    }

  if (props.searchStore.readyForTrailer === true) {  // If the page is ready for trailers it is also ready for comments
    let tree = props.userStore.makeTreedComments(props.userStore.getMovieComments); // Grab the comments tree from the store
    comments = tree.map(commentObj => {  // Comments will only be one level deep so no need for reply button on replies
      if (commentObj.replies[0] !== null) { // Only map replies if the comments object has replies
        replyObj = commentObj.replies.map(reply => { // Map the replies
          return (  // For each reply build and return appropriate ui elements
            <div className="comment"
              key={uuid.v4()} 
              id={reply.rep_id}
            >
              <div className="content"
                key={uuid.v4()}
              >
                <div className="metadata" 
                  key={uuid.v4()}
                >
                  <div className="author" 
                    key={uuid.v4()} 
                  >
                      {reply.rep_user}
                  </div>
                  <div className="posting-date">
                    {moment(new Date(reply.rep_uat)).format("MMM Do YYYY")}
                  </div>
                </div>
                  <div className="comment-text"  
                    key={uuid.v4()}>{reply.rep_comment}
                  </div>
                <div className="comment-actions" 
                  key={uuid.v4()}
                >
                  <button 
                    key={uuid.v4()} 
                    className="reply-edit buttons comment-button 34" 
                    onClick={(e) => {
                      editReplyComment(e.target.parentElement.parentElement.parentElement, e.target, e.target.parentElement.parentElement.parentElement.parentElement, false)
                      }}>Edit
                  </button>
                  <button 
                    key={uuid.v4()} 
                    className="comment-delete buttons comment-button" 
                    onClick={(e) => {
                      deleteReplyComment(e.target.parentElement.parentElement.offsetParent, "reply");            
                    }}>Delete
                  </button>
                </div>
                <form key={uuid.v4()} className={"update-comment inactive"}>
                    <div className="field" key={uuid.v4()}>
                      <textarea>

                      </textarea>
                    </div>  
                    <button
                      className="comment-update buttons comment-button update-button"
                      key={uuid.v4()}
                      onClick={(e) => {
                        e.preventDefault();
                        let comment = serializeComment(e.target, true, true);
                        if (comment !== false) {
                          updateComments(comment);          
                        }              
                     }}>Update</button>
                </form>
              </div>
            </div>
          );
        });
      }
      return (  // For each comment return the appropriate ui elements with their replies
      <div className='comment'
      key={uuid.v4()} 
      id={commentObj.id}
      >
        <div className='content'
        key={uuid.v4()}
        >
          <div className='metadata' 
            key={uuid.v4()} 
          >
            <div className='author'
              key={uuid.v4()}
            >
              {commentObj.user_name}
            </div>
            <div className='posting-date'>
              {moment(new Date(commentObj.updated_at)).format("MMM Do YYYY")}
            </div>
          </div>
              <div className='comment-text' 
                  key={uuid.v4()}>{commentObj.comment}
              </div>
          <div className='comment-actions' 
            key={uuid.v4()}
          >
            <button 
              key={uuid.v4()} 
              className="buttons comment-button"
              onClick={(e) => {
                props.helpers.checkVisible(e.target)
                }}>Reply
            </button>
            <button 
              key={uuid.v4()} 
              className="comment-edit buttons comment-button" 
              onClick={(e) => {
                editReplyComment(e.target.parentElement.parentElement.parentElement, e.target, e.target.offsetParent.lastChild.lastChild, true)
                }}>Edit
            </button>
            <button 
              key={uuid.v4()} 
              className="comment-delete buttons comment-button" 
              onClick={(e) => {
                deleteReplyComment(e.target.parentElement.parentElement.parentElement, "comment")
                }}>Delete
            </button>               
          </div>
          <form key={uuid.v4()} className={"update-comment inactive"}>
                  <div 
                      className="field"
                      key={uuid.v4()}
                  >
                      <textarea></textarea>
                  </div>
                    <button
                      className="buttons comment-button update-button"
                      key={uuid.v4()}
                      onClick={(e) => {
                        e.preventDefault();
                        let comment =  serializeComment(e.target, false);
                        if (comment !== false) {
                          updateComments(comment);
                        }
                    }}>Update</button>
          </form>
          </div>
          <div className='threaded comments' key={uuid.v4()}>
          {commentObj.replies[0] !== null ? replyObj : ""}
          <form key={uuid.v4()} className={"inactive"}>
                  <div 
                      className="field"
                      key={uuid.v4()}
                  >
                      <textarea></textarea>
                  </div>
                  <div className="comment-actions">
                    <button
                      key={uuid.v4()}
                      className="buttons comment-button"
                      onClick={(e) => {
                        e.preventDefault();
                        let comment = serializeComment(e.target, true);
                        if (comment !== false) {
                          addComments(comment);
                        }
                    }}>Add Reply</button>
                  </div>
          </form>
        </div>
      </div>
      );
    })
  }
    return (  // Build the boilerplate for the the ui elements and input the comments
<div key={uuid.v4()} className="user-comments-container">
  <div className="comment-group" key={uuid.v4()}>
    <h3 key={uuid.v4()} >
      Comments
    </h3>
    <Message key={uuid.v4()} floating className={props.helpers.checkMessageVisible(props.userStore.commentMessage.visible)} content={props.userStore.commentMessage.message} />
    {comments}
  <form key={uuid.v4()}>
    <div 
      className="field"
      key={uuid.v4()}
    >
      <textarea></textarea>
    </div>
    <div className="comment-actions">
      <button 
        key={uuid.v4()}
        className="buttons comment-button"
        onClick={(e) => {
          e.preventDefault();
          let comment = serializeComment(e.target, false);
          if (comment !== false) {
            addComments(comment);
          }
      }}>Add Reply</button>
    </div>
  </form>
  </div>
</div>      
    );
}));

export default Comments;