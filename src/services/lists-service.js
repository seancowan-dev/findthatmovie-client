import config from './config';
import Helpers from '../stores/Helpers';
import TokenService from '../services/token-service';

const ListsService = {
    async getUserLists(id) {
        return await fetch(`${config.API_ENDPOINT}/lists/getList/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'GET',
            headers: {
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
    async addUserList(listObj) {
        return await fetch(`${config.API_ENDPOINT}/lists/add?api_key=${config.CLIENT_API_KEY}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify(listObj),
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async addListItem(listItem) {
        return await fetch(`${config.API_ENDPOINT}/lists/addItem?api_key=${config.CLIENT_API_KEY}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify(listItem),
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async deleteUserList(id) {
        return await fetch(`${config.API_ENDPOINT}/lists/deleteList/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async deleteListItem(id) {
        return await fetch(`${config.API_ENDPOINT}/lists/deleteListItem/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },    
    async updateUserList(listObj, id) {
        return await fetch(`${config.API_ENDPOINT}/lists/updateList/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: listObj,
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    },
    async updateListItem(listItem, id) {
        return await fetch(`${config.API_ENDPOINT}/lists/updateListItem/${id}?api_key=${config.CLIENT_API_KEY}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: listItem,
        })
        .then(res => {
            return Helpers.handleErrors(res)
        })
        .catch(err => {
            console.error(err)
        })
    }
}

export default ListsService;