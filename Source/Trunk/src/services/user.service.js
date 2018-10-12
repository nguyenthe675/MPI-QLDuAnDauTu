import PolimClient from "../utils/api/PolimClient";
import {LocalStore} from "../utils/LocalStore";
import {apiUrl} from "../config";

export default class UserService {

    static getCurrentUser(cb) {
        PolimClient.request({
            endpoint: apiUrl.replace('api', '') + "oauth/userinfo",
            method: "GET",
        }, cb);
    }

    /**
     * đăng xuất
     * @param cb
     */
    static logout(cb) {
        // remove user from local storage to log user out
        LocalStore.getInstance().save('loginSession', null);
        if (cb) cb();
    }

    /**
     * lấy danh sách user
     * @param filter
     * @param cb
     */
    static getAllUser(filter ,cb) {
        PolimClient.request({
            endpoint: `users${filter}`,
            method: "GET",
        }, cb);
    }

    /**
     * tạo mới user
     * @param data
     * @param cb
     */
    static createUser(data ,cb) {
        PolimClient.request({
            endpoint: `users`,
            method: "POST",
            body: data
        }, cb);
    }

    /**
     * xem chi tiết user
     * @param id
     * @param cb
     */
    static getUserById(id ,cb) {
        PolimClient.request({
            endpoint: `users/${id}`,
            method: "GET",
        }, cb);
    }

    /**
     * Update user
     * @param id
     * @param cb
     */
    static updateUserById(id, data ,cb) {
        PolimClient.request({
            endpoint: `users/${id}`,
            method: "PUT",
            body: data
        }, cb);
    }

    /**
     * xóa user
     * @param id
     * @param cb
     */
    static deleteUserById(id ,cb) {
        PolimClient.request({
            endpoint: `users/${id}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * Lấy danh sách clients theo user
     * @param username
     * @param cb
     */
    static getClientsByUsername(username ,cb) {
        PolimClient.request({
            endpoint: `users/${username}/clients`,
            method: "GET",
        }, cb);
    }

    /**
     * Lấy danh sách role của user theo client
     * @param username
     * @param clientId
     * @param cb
     */
    static getRolesByUsername(username, clientId ,cb) {
        PolimClient.request({
            endpoint: `users/${username}/clients/${clientId}/roles`,
            method: "GET",
        }, cb);
    }

    /**
     * Lấy danh sách role của user theo client
     * @param username
     * @param clientId
     * @param roles 'role1,role2,role3'
     * @param cb
     */
    static grantRolesByUsername(username, clientId, roles ,cb) {
        PolimClient.request({
            endpoint: `users/${username}/clients/${clientId}/roles?roles=${roles}`,
            method: "POST",
        }, cb);
    }

    /**
     * Lấy danh sách role của user theo client
     * @param username
     * @param clientId
     * @param roles 'role1,role2,role3'
     * @param cb
     */
    static revokeRolesByUsername(username, clientId, roles ,cb) {
        PolimClient.request({
            endpoint: `users/${username}/clients/${clientId}/roles?roles=${roles}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * Lấy danh sách clients theo user
     * @param Username
     * @param clients
     * @param cb
     */
    static deleteClientsByUsername(Username, clients, cb) {
        PolimClient.request({
            endpoint: `users/${Username}?clients=${clients}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * Activate user
     * @param id
     * @param cb
     */
    static activateUser(id, cb) {
        PolimClient.request({
            endpoint: `users/${id}/activate`,
            method: "POST",
        }, cb);
    }

    /**
     * Deactivate user
     * @param id
     * @param cb
     */
    static deactivateUser(id, cb) {
        PolimClient.request({
            endpoint: `users/${id}/deactivate`,
            method: "POST",
        }, cb);
    }
}