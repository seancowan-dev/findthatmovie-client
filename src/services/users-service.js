import config from './config';
import Helpers from '../stores/Helpers';

const UserService = {
    async addUser(confirmedInfo) {
        return await fetch(`${config.API_ENDPOINT}/users/add?api_key=${config.CLIENT_API_KEY}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: confirmedInfo
        })
        .then(res => {
            Helpers.handleErrors(res);
        })
        .catch(err => {
            console.error(err)
        })
    }
}

export default UserService;