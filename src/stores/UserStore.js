import { observable, action, computed } from 'mobx';
import ListsService from '../services/lists-service';
import TokenService from '../services/token-service';
import CommentsService from '../services/comments-service';
import SearchStore from './SearchStore';

class UserStore {
    // Logging In
    @observable currentId = "";
    @observable userLists = null;
    
    //Admins
    @observable currentlyDeletingUserId = "";
        //Getter
        @computed get getCurrentlyDeletingUserId() {
            return this.currentlyDeletingUserId;
        }
        //Setter
        @action setCurrentlyDeletingUserId(value) {
            this.currentlyDeletingUserId = value;
        }         
    @observable adminListLoaded = false;
        //Getter
        @computed get getAdminListLoaded() {
            return this.adminListLoaded;
        }
        //Setter
        @action setAdminListLoaded(value) {
            this.adminListLoaded = value;
        }        
    @observable adminUserList = null;
        //Getter
        @computed get getAdminUserList() {
            return this.adminUserList;
        }
        //Setter
        @action setAdminUserList(newList) {
            this.adminUserList = newList;
        }
    @observable adminDeleteUserModalVisibility = false;
        // Getters
        @computed get getAdminDeleteUserModalVisibility() {
            return this.adminDeleteUserModalVisibility;
        }
        // Setters
        @action setAdminDeleteUserModalVisibility() {
            this.adminDeleteUserModalVisibility = this.adminDeleteUserModalVisibility === true ? false : true;
        }
        
    // Account Page
    @observable userInformation = null;
        // Getters for info
        @computed get getUserInfo() {
            return this.userInformation;
        }
        @computed get getUserEmail() {
            return this.userInformation.email;
        }       
        @computed get getAccountCreationDate() {
            return this.userInformation.created_at;
        }
        @computed get getAccountUpdateDate() {
            return this.userInformation.updated_at;
        }
        @computed get getUserPermLevel() {
            return this.userInformation.perm_level;
        }
        
    // Lists Page
    @observable userListInput = "";
        // Getters
        @computed get getUserListInput() {
            return this.userListInput;
        }
        // Setters
        @action setUserListInput(input) {
            this.userListInput = input;
        }

    @observable userListInputFormVisibility = "inactive";
        // Getters
        @computed get getUserListInputFormVisibility() {
            return this.userListInputFormVisibility;
        }
        // Setters
        @action setUserListInputFormVisibility() {
            this.userListInputFormVisibility = this.userListInputFormVisibility === "active" ? "inactive" : "active";
        } 
        
    @observable addUserListButtonVisibility = "inactive";
    @observable addUserListToggleButtonVisibility = "active";
            // Getters
            @computed get getAddUserListButtonVisibility() {
                return this.addUserListButtonVisibility;
            }
            @computed get getAddUserListToggleButtonVisibility() {
                return this.addUserListToggleButtonVisibility;
            }
            // Setters
            @action setAddUserListButtonVisibility() {
                this.addUserListButtonVisibility = this.addUserListButtonVisibility === "active" ? "inactive" : "active";
            } 
            @action setAddUserListToggleButtonVisibility() {
                this.addUserListToggleButtonVisibility = this.addUserListToggleButtonVisibility === "active" ? "inactive" : "active";
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
        // Setters
        @action setCommentVisibility() {
            this.commentMessage.visible === true ? this.commentMessage.visible = false : this.commentMessage.visible = true
        }
        @action setCommentMessage(input) {
            this.commentMessage.message = input;
        }
        // Getters
        @computed get getCommentMessage() {
            return this.commentMessage.message;
        }
        @computed get getCommentVisibility() {
            return this.commentMessage.visible;
        }
    @observable listMessage = {
        visible: false,
        message: ""
    }
        // Setters
        @action setListMessageVisibility() {
            this.listMessage.visible === true ? this.listMessage.visible = false : this.listMessage.visible = true
        }
        @action setListMessage(input) {
            this.listMessage.message = input;
        }
        // Getters
        @computed get getListMessage() {
            return this.listMessage.message;
        }
        @computed get getListVisibility() {
            return this.listMessage.visible;
        }
    @observable adminPanelMessage = {
        visible: false,
        message: ""
    }
        // Setters
        @action setAdminPanelMessageVisibility() {
            this.adminPanelMessage.visible === true ? this.adminPanelMessage.visible = false : this.adminPanelMessage.visible = true
        }
        @action setAdminPanelMessage(input) {
            this.adminPanelMessage.message = input;
        }
        // Getters
        @computed get getAdminPanelMessage() {
            return this.adminPanelMessage.message;
        }
        @computed get getAdminPanelMessageVisibility() {
            return this.adminPanelMessage.visible;
        }
    // Change Password
    @observable changePassword = {
        old: "",
        new: "",
        newConfirm: ""
    }
    //Setters
        @action resetChangePassword() {
            this.changePassword = {
                old: "",
                new: "",
                newConfirm: ""
            }            
        }
        @action setChangePasswordNew(newPass) {
            this.changePassword.new = newPass;
        }
        @action setChangePasswordOld(oldPass) {
            this.changePassword.old = oldPass;
        }        
        @action setChangePasswordNewConfirm(newPassConfirm) {
            this.changePassword.newConfirm = newPassConfirm;
        }
    //Getters
        @computed get getChangePasswordNew() {
            return this.changePassword.new;
        }
        @computed get getChangePasswordOld() {
            return this.changePassword.old;
        }
        @computed get getChangePasswordNewConfirm() {
            return this.changePassword.newConfirm;
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
        // @computed get getUsername() {
        //     return this.loginInfo.username;
        // }        
        @computed get getPassword() {
            return this.loginInfo.password;
        }      
    // User Lists Storage
    @observable userLists = {};
    @observable listLoaded = false;
        // Getter
        @computed get getListLoaded() {
            return this.listLoaded
        }
        // Setter
        @action toggleListLoaded(val) {
            this.listLoaded = val;
        }
    @observable expandedHistory = [];
        // Getter
        @computed get getExpandedHistory() {
            return this.expandedHistory;
        }
        // Setter
        @action setExpandedHistory(history) {
            this.expandedHistory = history;
        }        
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
        this.userLists = res;
    }
    @action async cleanupUserLogin(token) {
        this.setLoaded(false);
        await ListsService.getUserLists(TokenService.parseJwt(token).user_id)
        .then(res => {
            this.setUserLists(res);
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
      // Gett for comment object
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
                return null;
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