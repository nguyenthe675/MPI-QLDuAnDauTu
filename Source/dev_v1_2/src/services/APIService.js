import axios from 'axios';
//import Raven from 'raven-js';
import StorageService from './StorageService';
import { apiUrl } from '../config';

axios.defaults.baseURL = apiUrl;
/**
 * Create a new Axios client instance
 * @see https://github.com/mzabriskie/axios#creating-an-instance
 */
const getClient = (baseUrl = null, auth = true, showLoading = true) => {

    const options = {
        baseURL: baseUrl
    };

    if (auth === true && StorageService.isLoggedIn()) {
        var token = StorageService.getAccessToken();
        options.headers = {
            Authorization: `Bearer ${token.access_token}`,
        };
    }
    const client = axios.create(options);

    // Add a request interceptor
    client.interceptors.request.use(
        requestConfig => {
            if (showLoading) {
                document.body.classList.add('loading-indicator');
            }
            //spinnerService.show('appSpinner');
            return requestConfig;
        },
        (requestError) => {
            //Raven.captureException(requestError);

            return Promise.reject(requestError);
        },
    );

    // Add a response interceptor
    client.interceptors.response.use(
        response => {
            if (showLoading) {
                document.body.classList.remove('loading-indicator');
            }
            //spinnerService.hide('appSpinner');
            return response;
        },
        (error) => {
            if (error.response.status >= 500) {
                //Raven.captureException(error);
            }
            if (showLoading) {
                document.body.classList.remove('loading-indicator');
            }
            return Promise.reject(error);
        },
    );

    return client;
};

class APIService {
    constructor(baseUrl = null, auth = true, showLoading = true) {
        this.client = getClient(baseUrl, auth, showLoading);
    }

    get(url, conf = {}) {
        return this.client.get(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    delete(url, conf = {}) {
        return this.client.delete(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    head(url, conf = {}) {
        return this.client.head(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    options(url, conf = {}) {
        return this.client.options(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    post(url, data = {}, conf = {}) {
        return this.client.post(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    put(url, data = {}, conf = {}) {
        return this.client.put(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }

    patch(url, data = {}, conf = {}) {
        return this.client.patch(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    }
}

export { APIService };


/**
 * Base HTTP Client
 */
export default {
    // Provide request methods with the default base_url
    get(url, conf = {}) {
        return getClient(apiUrl).get(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    delete(url, conf = {}) {
        return getClient(apiUrl).delete(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    head(url, conf = {}) {
        return getClient(apiUrl).head(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    options(url, conf = {}) {
        return getClient(apiUrl).options(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    post(url, data = {}, conf = {}) {
        return getClient(apiUrl).post(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    put(url, data = {}, conf = {}) {
        return getClient(apiUrl).put(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    patch(url, data = {}, conf = {}) {
        return getClient(apiUrl).patch(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
};