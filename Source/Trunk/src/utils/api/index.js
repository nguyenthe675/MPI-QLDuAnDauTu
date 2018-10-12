import {LocalStore} from "../LocalStore";
import callApi from "../fetchApi";
import {parseErrors} from "../error/parseError";
import lang from '../../resources/localization/Localization';

export function fetchApi(endpoint, authenticate, data = null, config, cb) {
    const token = authenticate;
    let defaultLang = LocalStore.getInstance().read('language');
    defaultLang = defaultLang ? defaultLang : 'en';
    config.headers = Object.assign({}, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': defaultLang,
        'Authorization': token
    }, config.headers);
    config.body = typeof config.body === 'object' ? JSON.stringify(config.body) : config.body;
    config.cache = config.cache || 'no-cache';

    const {method = 'GET', headers} = config;

    if (method === 'GET') {
        endpoint += getQueryString(data);
    }
    else {
        if (!config.body && data) {
            config.body = typeof data === 'object' ? JSON.stringify(data):data;
        }
    }

    const body = config.body;

    try {
        callApi(endpoint, {method, headers, body}).then((response) => {
            cb(null, response);
        }).catch((error)=> {
            error.code = error.code || error.statusCode;

            error.payload = parseErrors(error);
            console.info(error);
            if (error.statusCode === 500 || error.statusCode === 404) {
                error.message = lang.error.oops;
            }
            else if (error.statusCode === 403) {
                error.message = lang.error['Access Denied']
            }
            else if (error.statusCode === 401) {
                error.message = lang.error['Authorization Required'];
                LocalStore.getInstance().save('loginSession', null);

                //FIXME: không chơi kiểu này nguy hiểm vãi
                setTimeout(()=> {
                    if (window.location.pathname.indexOf('/login') === -1) {
                        window.location = '/login?r='+window.location.pathname;
                    }
                }, 1500);
            }

            cb(error);
        });
    } catch (error) {
        error.code = error.code || error.statusCode;
        if (error.code === '500') {
            error.message = 'Hệ thống đang gặp sự cố, vui lòng liên hệ với kĩ thuật để được trợ giúp!';
        }

        error.payload = parseErrors(error);
        cb(error);
    }
}

export function getQueryString(data) {
    if (data) {
        let query = '';
        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            if (typeof data[key] === 'object') {
                query += encodeURIComponent(key)+"="+encodeURIComponent(JSON.stringify(data[key]))+"&";
            }
            else {
                query += encodeURIComponent(key)+"="+encodeURIComponent(data[key])+"&";
            }
        }
        if(query !== ''){
            return '?' + query;
        }

        return query;
    }
}