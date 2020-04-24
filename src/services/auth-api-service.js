import config from './config';
import TokenService from '../services/token-service';

const AuthApiService = {
    async postLogin({name, password}) {
        return await fetch(`${config.API_ENDPOINT}/users/login?api_key=f36d54c6-47c9-43de-aa5a-835ae17bdaba`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({name, password}),
        })
        .then(res => {
            if (res.ok === true) {
                return res.json();
            } else {
                throw new Error("Code " + res.status + " Message: " + res.statusText)
            }
        })
    },
    async postRefreshToken() {
        return await fetch(`${config.API_ENDPOINT}/users/refresh?api_key=f36d54c6-47c9-43de-aa5a-835ae17bdaba`, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${TokenService.getAuthToken()}`,
          },
        })
        .then(res => {
            if (res.ok === true) {
                return res.json();
            } else {
                throw new Error("Code " + res.status + " Message: " + res.statusText)
            }
            })
        .then(res => {
            TokenService.saveAuthToken(res.authToken)
            TokenService.queueCallbackBeforeExpiry(() => {
              AuthApiService.postRefreshToken()
            })
            return res
        })
        .catch(err => {
            console.log('refresh token request error')
            console.error(err)
        })
    }
}

export default AuthApiService;