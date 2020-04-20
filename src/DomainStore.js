import DataStore from './stores/DataStore';
import SearchStore from './stores/SearchStore';
import UserStore from './stores/UserStore';
import Helpers from './stores/Helpers';

class DomainStore{
  // Import external stores
  constructor() {
    this.dataStore = DataStore;
    this.searchStore = SearchStore;
    this.helpers = Helpers;
    this.userStore = UserStore;
  }

  // Local methods to use with fetch api methods
     handleErrors(response) { // prepares error message for HTTP request errors
      if (response.ok === true) {
          return response.json();
      } else {
          throw new Error("Code " + response.status + " Message: " + response.statusText)
      }
    }

  // Fetch API Methods
}
export default new DomainStore();