import _ from 'lodash';

export default class StorageService {

    static getAccessToken() {
        return JSON.parse(sessionStorage.getItem("_accessToken"));
    }

    static isLoggedIn() {
        return _.isObject(this.getAccessToken());
    }

    static getPrivileges() {
        return this.getAccessToken().privileges.split(',');
    }
    static checkPermission(permission) {
        let check = _.intersection(this.getPrivileges(), permission);
        return check.length > 0;
    }
    static setAccessToken(token) {
        sessionStorage.setItem("_accessToken", JSON.stringify(token));
    }
}