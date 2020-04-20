import { observable } from 'mobx';

class UserStore {
    @observable authenticated = false;
    @observable authenticatedUser = "";
    @observable currentId = "";
}

export default new UserStore();