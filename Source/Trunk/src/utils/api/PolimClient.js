import {LocalStore} from "../LocalStore";
import {getQueryString} from "./index";
import * as config from "../../config";
import {makeid} from "../../utils/stringUtils";
import callApi from "../fetchApi";
import {parseErrors} from "../error/parseError";
import lang from "../../resources/localization/Localization";

export default class PolimClient {
    static flags = {};

    static REQUEST_MODE = {
        BODY_ONCE: 'body-once',
        TAKE_LATEST_BY_ENDPOINT: 'take-latest-endpoint',
        ALL: 'all'
    };

    static callback(cb, config, err, res) {

        let md5 = require("blueimp-md5");
        if (config.mode === 'take-latest-endpoint') {
            let hash = md5(config.endpoint);
            if (this.flags[hash]) {
                if (this.flags[hash] > config.timestamp) {
                    //this is not latest base on endpoint, do not callback
                    console.info('request callback dismissed');
                    return
                }
            }
            this.flags[hash] = config.timestamp;
        }

        cb(err,res);
    }

    static once(config, cb) {
        let md5 = require("blueimp-md5");
        if (config.mode === 'body-once') {
            let hash = md5(config.endpoint + config.body);
            if (this.flags[hash]) {
                let error = {
                    message: lang.error.once
                };
                cb(error);
                return true;
            }

            this.flags[hash] = true;
            setTimeout(()=> {
                delete this.flags[hash];
            }, 10000);
        }
    }

    static request(requestConfig = {
            endpoint: '',
            queryString: {},
            method: 'GET',
            headers: {},
            file: "",
            body: ''
    }, cb) {
        requestConfig = Object.assign({
            endpoint: '',
            queryString: {},
            method: 'GET',
            headers: {},
            body: '',
            file: "",
            mode: 'take-latest-endpoint',
            timestamp: new Date()
        }, requestConfig);

        cb = cb || (()=> {});

        let defaultLang = LocalStore.getInstance().read('language');
        defaultLang = defaultLang ? defaultLang : 'en';

        let token = LocalStore.getInstance().read('loginSession');
        //TODO: renew token on expired

        if (token) {
            requestConfig.headers = Object.assign({}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': defaultLang,
                'Authorization': 'Bearer ' + token.id
            }, requestConfig.headers);
        }
        else {
            requestConfig.headers = Object.assign({}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Language': defaultLang
            }, requestConfig.headers);
        }

        //add client-version & client-endpoint
        let packageInfo = require('../../app.json');
        requestConfig.headers['X-Client-Version'] = packageInfo.version;
        requestConfig.headers['X-Client-Endpoint'] = window.location;

        requestConfig.body = typeof requestConfig.body === 'object' ? JSON.stringify(requestConfig.body) : requestConfig.body;
        requestConfig.cache = requestConfig.cache || 'no-cache';

        // Trường hợp muốn upload file
        if(requestConfig.file) {
            requestConfig.body = requestConfig.file;
            delete requestConfig.headers['Content-Type'];
            delete requestConfig.headers['Accept'];
        }

        let url = '';
        if (Object.keys(requestConfig.queryString).length > 0) {
            url = requestConfig.endpoint + getQueryString(requestConfig.queryString);
        }
        else {
            url = requestConfig.endpoint;
        }

        try {
            if (this.once(requestConfig, cb)) {
                return;
            }
            if(!navigator.onLine){
                let error={
                    code:500,
                    message:lang.network['network']
                };
                return this.callback(cb, requestConfig,error);
            }

            callApi(url, {
                method:requestConfig.method,
                headers: requestConfig.headers,
                body: requestConfig.body}).then((response) => {
                return this.callback(cb, requestConfig, null, response);
            }).catch((error)=> {
                if (!error) return this.callback(cb, requestConfig, {statusCode: 500, message: 'Hệ thống đang gặp sự cố, vui lòng liên hệ với kĩ thuật để được trợ giúp!'});

                error.code = error.code || error.statusCode || error.status;
                error.payload = parseErrors(error);

                if (error.code === 500 || error.code === 404) {
                    error.message = lang.error.oops;
                }
                else if (error.code === 403) {
                    error.message = lang.error['Access Denied']
                }
                else if (error.code === 401) {
                    error.message = lang.error['Authorization Required'];
                    //random web state để lưu vào localStore và gửi sang Login site
                    const webState = makeid();
                    const redirect_uri = encodeURI(window.location.origin + '/authentication');
                    LocalStore.getInstance().save('loginSession', null);
                    LocalStore.getInstance().save('webState', webState);
                    //FIXME: không chơi kiểu này nguy hiểm vãi (nguy hiểm vãi)
                    setTimeout(()=> {
                        window.location = `${config.loginUrl}?response_type=token&client_id=${config.client_id}&state=${webState}&redirect_uri=${redirect_uri}`;
                    }, 1500);

                } else if (error.code === 'timeout') {
                    error.message = lang.error.timeout;
                }

                return this.callback(cb, requestConfig, error);
            });
        } catch (error) {
            if (!error) return this.callback(cb, requestConfig, {statusCode: 500, message: 'Hệ thống đang gặp sự cố, vui lòng liên hệ với kĩ thuật để được trợ giúp!'});

            error.code = error.code || error.statusCode || error.status;
            if (error.code === '500') {
                error.message = 'Hệ thống đang gặp sự cố, vui lòng liên hệ với kĩ thuật để được trợ giúp!';
            }

            error.payload = parseErrors(error);
            return this.callback(cb, requestConfig,error);
        }
    }
}