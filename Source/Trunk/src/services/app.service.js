import _ from 'lodash';

export default class AppService {

    static getAccessToken() {
        return JSON.parse(sessionStorage.getItem("_accessToken"));
    }

    static isLoggedIn() {
        return _.isObject(this.getAccessToken());
    }
}