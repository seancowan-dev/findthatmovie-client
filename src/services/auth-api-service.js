import config from './config';

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
    }
}

export default AuthApiService;