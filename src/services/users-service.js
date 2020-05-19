import config from './config';
import Helpers from '../stores/Helpers';
import TokenService from '../services/token-service';

const UserService = {
    async addUser(confirmedInfo) {
        return await fetch(`${config.API_ENDPOINT}/users/add?api_key=${config.CLIENT_API_KEY}`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
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
    },
    async getAllUsers() {
        return await fetch(`${config.API_ENDPOINT}/users/getAllUsers?api_key=${config.CLIENT_API_KEY}`, { 
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}` 
            },
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async getUserInfo(id) {
        return await fetch(`${config.API_ENDPOINT}/users/info/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}` 
            },
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async updateUser(id, info) {
        return await fetch(`${config.API_ENDPOINT}/users/update/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'PATCH',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: info
        })
        .catch(err => {
            console.error(err)
        })
    },
    async deleteUser(id) {
        return await fetch(`${config.API_ENDPOINT}/users/delete/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'DELETE',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            }
        })
        .catch(err => {
            console.error(err)
        })
    }
}

export default UserService;