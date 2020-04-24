import { observable, action } from 'mobx';

class UserStore {
    @observable authenticated = false;
    @observable authenticatedUser = "";
    @observable currentId = "";
    @observable userLists = [];

    @observable newRegistrant = {
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: ""
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
}

export default new UserStore();