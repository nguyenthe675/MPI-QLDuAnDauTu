import PolimClient from "../utils/api/PolimClient";

export default class PermissionService {

    /**
     * lấy danh sách permission theo client
     * @param clientId
     * @param filter
     * @param cb
     */
    static getPermissionsByClient(clientId, filter, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/permissions${filter}`,
            method: "GET",
        }, cb);
    }

    /**
     * lấy chi tiết permission theo clientId và code
     * @param clientId
     * @param permissionCode
     * @param cb
     */
    static getPermissionByCode(clientId, permissionCode, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/permissions/${permissionCode}`,
            method: "GET",
        }, cb);
    }

    /**
     * tạo mới permission theo client
     * @param clientId
     * @param data
     * @param cb
     */
    static createPermissionByClient(clientId, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/permissions`,
            method: "POST",
            body: data
        }, cb);
    }

    /**
     * update permission theo client
     * @param clientId
     * @param code
     * @param data
     * @param cb
     */
    static updatePermissionByClient(clientId, code, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/permissions/${code}`,
            method: "PUT",
            body: data
        }, cb);
    }
}