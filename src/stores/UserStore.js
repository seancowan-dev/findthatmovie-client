import { observable, action } from 'mobx';

class UserStore {
    @observable authenticated = false;
    @observable authenticatedUser = "";
    @observable currentId = "";
    @observable userLists = [];

    @observable userInformation = null;

    @observable newRegistrant = {
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
    }

    @observable changePassword = {
        old: "",
        new: "",
        newConfirm: ""
    }

    @observable loginInfo = {
        username: "",
        password: ""
    }

    @observable tempLists = [
        {
            username: "tac",
            lists: [
            {
                listname: "Test List",
                id: "6a09c43e-7ed1-4fda-b40c-f6bd854791bb",
                listContent: [
                    {
                    title: "Ad Astra",
                    id: "419704"
                },
                ]
            },
        ]
        },
    ];

    @action setLoginState(name) {
        this.loginInfo.username = '';
        this.loginInfo.password = '';
        this.authenticated = true;
        this.authenticatedUser = name;
    }

    @action setUserInfo(res) {
        this.userInformation = res;
    }
}

export default new UserStore();