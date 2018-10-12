import PolimClient from "../utils/api/PolimClient";

export default class RoleService {

    /**
     * lấy danh sách role theo client
     * @param clientId
     * @param filter
     * @param cb
     */
    static getRoleByClient(clientId, filter, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles${filter}`,
            method: "GET",
        }, cb);
    }

    /**
     * lấy danh sách users theo role code
     * @param clientId
     * @param filter
     * @param code
     * @param cb
     */
    static getUsersByRole(clientId, code, filter, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${code}/users${filter}`,
            method: "GET",
        }, cb);
    }

    /**
     * lấy chi tiết role theo clientId và code
     * @param clientId
     * @param roleCode
     * @param cb
     */
    static getRoleByCode(clientId, roleCode, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}`,
            method: "GET",
        }, cb);
    }

    /**
     * tạo mới role theo client
     * @param clientId
     * @param data
     * @param cb
     */
    static createRoleByClient(clientId, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles`,
            method: "POST",
            body: data
        }, cb);
    }

    /**
     * update role theo client
     * @param clientId
     * @param code
     * @param data
     * @param cb
     */
    static updateRoleByClient(clientId, code, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${code}`,
            method: "PUT",
            body: data
        }, cb);
    }

    /**
     * delete role theo client và code
     * @param clientId
     * @param code
     * @param cb
     */
    static deleteRole(clientId, code, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${code}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * lấy danh sách permissions theo clientId và role code
     * @param clientId
     * @param roleCode
     * @param cb
     */
    static getPermissionsByRoleCode(clientId, roleCode, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}/permissions`,
            method: "GET",
        }, cb);
    }

    /**
     * lấy danh sách permissions theo clientId và role code
     * @param clientId
     * @param roleCode
     * @param data là string array các id của permission, dạng 1,3,4,5,22
     * @param cb
     */
    static addPermissionsByRoleCode(clientId, roleCode, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}/permissions?permissions=${data}`,
            method: "POST",
        }, cb);
    }

    /**
     * lấy danh sách permissions theo clientId và role code
     * @param clientId
     * @param roleCode
     * @param data là string array các id của permission, dạng 1,3,4,5,22
     * @param cb
     */
    static deletePermissionsByRoleCode(clientId, roleCode, data, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}/permissions?permissions=${data}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * Activate
     * @param clientId
     * @param roleCode
     * @param cb
     */
    static activate(clientId, roleCode, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}/activate`,
            method: "POST",
        }, cb);
    }

    /**
     * Deactivate
     * @param clientId
     * @param roleCode
     * @param cb
     */
    static deactivate(clientId, roleCode, cb) {
        PolimClient.request({
            endpoint: `clients/${clientId}/roles/${roleCode}/deactivate`,
            method: "POST",
        }, cb);
    }
}