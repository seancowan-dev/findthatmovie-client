import config from './config';
import { navigate } from 'hookrouter';
import TokenService from '../services/token-service';
import Validators from '../stores/Validators';

const AuthApiService = {
    async postLogin({name, password}) {
        return await fetch(`${config.API_ENDPOINT}/users/login?api_key=f36d54c6-47c9-43de-aa5a-835ae17bdaba`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
                'content-type': 'application/json',
            },
            body: JSON.stringify({name, password}),
        })
        .then(res => {
            if (res.ok !== true) {
                throw new Error("Code " + res.status + " Message: " + res.statusText)
            }
            return res.json();
        }).catch(err => {
            Validators.setLoginVisibility(true);
            Validators.setLoginMessage("There was an error with your login attempt. Please double check your username and password.");
            navigate("/login");
        });
    },
    async postRefreshToken() {
        return await fetch(`${config.API_ENDPOINT}/users/refresh?api_key=f36d54c6-47c9-43de-aa5a-835ae17bdaba`, {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': 'https://findthatmovie-client.now.sh/',
            'authorization': `Bearer ${TokenService.getAuthToken()}`,
          },
        })
        .then(res => {
            if (res.ok !== true) {
                throw new Error("Code " + res.status + " Message: " + res.statusText)
            }
            return res.json();
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