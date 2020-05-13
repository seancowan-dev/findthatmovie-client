import React from 'react';
import { observable, action, computed, trace } from 'mobx';
import { Button, Comment, Form } from 'semantic-ui-react'
import ListsService from '../services/lists-service';
import TokenService from '../services/token-service';
import CommentsService from '../services/comments-service';
import Helpers from './Helpers';
import uuid from 'uuid';
import moment from 'moment';
import SearchStore from './SearchStore';

class UserStore {
    // Logging In
    @observable currentId = "";
    @observable userLists = [];
    
    // Account Page
    @observable userInformation = null;
        // Getter for info
        @computed get getUserInfo() {
            return this.userInformation;
        }

    // Account Creation
    @observable newRegistrant = {
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
    }

    // Validation
    @observable commentMessage = {
        visible: false,
        message: ""
    }

    // Change Password
    @observable changePassword = {
        old: "",
        new: "",
        newConfirm: ""
    }

    // Controlled inputs for login
    @observable loginInfo = {
        username: "",
        password: "",
        authenticated: false,
        authenticatedUser: "",
        loaded: false
    }
        // Getters for login info
        @computed get getAuthenticated() {
            return this.loginInfo.authenticated;
        }
        @computed get getAuthenticatedUser() {
            return this.loginInfo.authenticatedUser;
        }
        @computed get getLoaded() {
            return this.loginInfo.loaded;
        }  
        @computed get getUsername() {
            return this.loginInfo.username;
        }        
        @computed get getPassword() {
            return this.loginInfo.password;
        }      
    // User Lists Storage
    @observable userLists = {};
    @observable validNavLinks = null;
    @action setValidNavLinks(linkObj) {
        this.validNavLinks = linkObj;
    }
        // Getter
        @computed get getValidNavLinks() {
            return this.validNavLinks;
        }
    
    // Comments storage
    @observable movieComments = null;
    @observable commentObject = null;
    @observable editComment = null;
            // Setters
            @action setEditComment(comment) {
                this.editComment = comment
            }
            // Getters
            @computed get getEditComment() {
                return this.editComment;
            }
    // Login Actions
    @action setUsername(name) {
        this.loginInfo.username = name;
    }
    @action setPassword(password) {
        this.loginInfo.password = password;
    }
    @action setAuthenticated(authenticated) {
        this.loginInfo.authenticated = authenticated;
    }
    @action setAuthenticatedUser(authenticatedUser) {
        this.loginInfo.authenticatedUser = authenticatedUser;
    }
    @action setLoaded(loaded) {
        this.loginInfo.loaded = loaded;
    }

    // Actions for User
    @action setUserInfo(res) {
        this.userInformation = res;
    }
      // Getter for user id
      @computed get getUserId() {
        return this.userInformation.id;
      }
    @action setUserLists(res) {
        Object.assign(this.userLists, res);
    }
    @action async cleanupUserLogin(token) {
        this.setLoaded(false);
        await ListsService.getUserLists(TokenService.parseJwt(token).user_id)
        .then(res => {
            let grouped = res.reduce((acc, curr) => {
                acc[curr.list_id] = [...acc[curr.list_id] || [], curr];
                return acc;
            }, []);
            this.setUserLists(grouped);
            this.setUsername("");
            this.setPassword("");
            this.setLoaded(true);
        });
    }

    // Actions for movies
        // Getters
        @computed get getCurrentId() {
            return this.currentId;
        }
        //Setters
        @action setCurrentId(id) {
            this.currentId = id;
        }
        //
    // Actions for comments
    @action async setMovieComments(res) {
        this.movieComments = res;
        SearchStore.readyForTrailer = true;
    }
      // Getter for movie comments
      @computed get getMovieComments() {
        return this.movieComments;
      }
    @action setCommentVisibility() {
        this.commentMessage.visible === true ? this.commentMessage.visible = false : this.commentMessage.visible = true
    }
    @action setCommentMessage(input) {
        this.commentMessage.message = input;
    }
    // @action setCommentObject() {
        
    // }

    @computed get getCommentObject() {
        return this.commentObject;
    }

    async postComment(targetElement, reply = false) {
        
        let date = + new Date();
        let comment = {
            "movie_id": this.currentId,
            "user_name": this.loginInfo.authenticatedUser,
            "user_id": this.userInformation.id,
            "reply": reply === true ? "true" : "false",
            "replying_to": reply === true ? targetElement.parentElement.parentElement.parentElement.id : "false",
            "comment": targetElement.form.firstChild.firstChild.value,
            "updated_at": new Date(date).toISOString()
        }
        
        await CommentsService.addComment(comment);
    }
    // makeCommentObject(resComments) {
    //     let tree = this.makeTreedComments(resComments);
    //     let replyObj;
    //     return tree.map(commentObj => {  // Comments will only be one level deep so no need for reply button on replies
    //         if (commentObj.replies[0] !== undefined) {
    //           replyObj = commentObj.replies.map(reply => {
    //             return (  // For each reply build and return appropriate ui elements
    //               <Comment key={uuid.v4()} id={reply.id}>
    //                 <Comment.Content key={uuid.v4()}>
    //                   <Comment.Author  key={uuid.v4()} as='a' key={uuid.v4()}>{reply.rep_user}</Comment.Author>
    //                   <Comment.Metadata key={uuid.v4()}>
    //                     <div>{ moment().format(reply.rep_uat) }</div>
    //                   </Comment.Metadata>
    //                     <Comment.Text  key={uuid.v4()}>{reply.rep_comment}</Comment.Text>
    //                   <Comment.Actions key={uuid.v4()}>
    //                     <Comment.Action key={uuid.v4()} as='button' className="comment-edit" onClick={(e) => {console.log("working")}}>Edit</Comment.Action>
    //                     <Comment.Action key={uuid.v4()} as='button' className="comment-delete" onClick={(e) => {console.log("working")}}>Delete</Comment.Action>
    //                   </Comment.Actions>
    //                 </Comment.Content>
    //               </Comment>
    //             );
    //           });
    //         }
    //         return (  // For each comment return the appropriate ui elements with their replies
    //           <Comment key={uuid.v4()} id={commentObj.id}>
    //           <Comment.Content key={uuid.v4()}>
    //             <Comment.Author key={uuid.v4()} as='a'>{commentObj.user_name}</Comment.Author>
    //             <Comment.Metadata key={uuid.v4()} >
    //               <div>{ moment().format(commentObj.updated_at) }</div>
    //             </Comment.Metadata>
    //               <Comment.Text key={uuid.v4()}>{commentObj.comment}</Comment.Text>
    //             <Comment.Actions key={uuid.v4()}>
    //               <Comment.Action key={uuid.v4()} as='button' onClick={(e) => {
    //                     Helpers.checkVisible(e.target)
    //                 }}>Reply</Comment.Action>
    //               <Comment.Action key={uuid.v4()} as='button' className="comment-edit" onClick={(e) => {console.log("working")}}>Edit</Comment.Action>
    //               <Comment.Action key={uuid.v4()} as='button' className="comment-delete" onClick={(e) => {console.log("working")}}>Delete</Comment.Action>               
    //             </Comment.Actions>
    //           </Comment.Content>
    //           <Comment.Group key={uuid.v4()} threaded className={"inactive"}>
    //             {replyObj !== undefined ? replyObj : ""}
    //             <Form key={uuid.v4()} reply>
    //                       <Form.TextArea key={uuid.v4()} />
    //                       <Button
    //                         key={uuid.v4()}
    //                         content='Add Reply'
    //                         labelPosition='left'
    //                         icon='edit'
    //                         primary
    //                         onClick={(e) => {
    //                           console.log(e.target.parentElement.parentElement.parentElement.id);
    //                           // this.setCommentVisibility();
    //                           // this.setCommentMessage("do you smellelelelleleoooowww what the rock is cookin??")
    //                           // props.helpers.checkUserPerms(e.target.parentElement.parentElement.parentElement.id).then(res => {
                                
    //                           // });
    //                           this.postComment(e.target, true);
    //                           this.setMovieComments(this.currentId);
    //                        }}/>
    //                     </Form>
    //           </Comment.Group>
              
    
    //         </Comment>
    //         );
    //       })
    // }
    makeTreedComments(movieComments) { // Take the full list of joined comments and replies and enumerate them into a treed list
        let grouped = movieComments.reduce((acc, curr) => { // Group comments into objects by ID
            acc[curr.id] = [...acc[curr.id] || [], curr];
            return acc;
          }, []);
    
          let treedComments = Object.values(grouped).map(currentComment => { //  Convert object list to array
            let splitEntries = currentComment.map(reply => { // First split the entries into replies and comments
              return this.splitComment(reply);
            });
    
            let commentsArray = splitEntries.map(entry => { // Map the split entries
              entry.com.replies = splitEntries.map(splitReply => {  // Collect the appropriate replies and add them to the comment
                if (splitReply.reply.replying_to === entry.com.id) {
                  return splitReply.reply;
                }
              });
              return entry.com; // Return the completed comment object
            });
            return commentsArray[0]; // Drop duplicates and return a final object containing the original comment and its appropriate replies
          })
          return treedComments; // Return the completed comment tree for use elsewhere
    }
    splitComment(input) { // Serialize and split comments to help organize replies with their appropriate comments
        let { id, comment, user_id, user_name, updated_at, movie_id, rep_comment, rep_id, rep_uat, rep_user, rep_user_id, replying_to } = input
        let output = {
          com: {
            id: id,
            comment: comment,
            user_id: user_id,
            user_name: user_name,
            updated_at: updated_at,
            movie_id: movie_id
          },
          reply: {
            rep_id: rep_id,
            rep_comment: rep_comment,
            rep_user_id: rep_user_id,
            rep_user: rep_user,
            rep_uat: rep_uat,
            replying_to: replying_to,
            movie_id: movie_id
          },
        }
        return output;
    }
}

export default new UserStore();