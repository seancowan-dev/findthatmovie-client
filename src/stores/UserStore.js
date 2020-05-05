import { observable, action } from 'mobx';
import ListsService from '../services/lists-service';
import TokenService from '../services/token-service';

class UserStore {
    // Logging In

    @observable currentId = "";
    @observable userLists = [];
    
    // Account Page
    @observable userInformation = null;

    // Account Creation
    @observable newRegistrant = {
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
    }
    // Change Password
    @observable changePassword = {
        old: "",
        new: "",
        newConfirm: ""
    }
    // Temp Store for logging in
    @observable loginInfo = {
        username: "",
        password: "",
        authenticated: false,
        authenticatedUser: "",
        loaded: false
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

    // User Lists Storage
    @observable userLists = null;

    @observable validNavLinks = null;

    @action setValidNavLinks(linkObj) {
        this.validNavLinks = linkObj;
    }

    // Actions for User

    @action setUserInfo(res) {
        this.userInformation = res;
    }

    @action setUserLists(res) {
        this.userLists = res;
    }

    @action async cleanupUserLogin(name) {
        this.setLoaded(false);
        await ListsService.getUserLists(TokenService.readJwtToken().user_id)
        .then(res => {
            let grouped = res.reduce((reducer, array) => {
                reducer[array.list_id] = [...reducer[array.list_id] || [], array];
                return reducer; 
            }, {});
            this.setUserLists(grouped);
            this.setUsername("");
            this.setPassword("");
            this.setLoaded(true);
        });
    }
}

export default new UserStore();