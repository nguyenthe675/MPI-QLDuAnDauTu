import PolimClient from "../utils/api/PolimClient";

export default class ScopeService {

    /**
     * Create a scope
     * @param data
     * @param cb
     */
    static createScope(data, cb) {
        PolimClient.request({
            endpoint: `scopes`,
            method: "POST",
            body: data
        }, cb);
    }

    /**
     * Read a scope
     * @param id
     * @param cb
     */
    static getScopeById(id, cb) {
        PolimClient.request({
            endpoint: `scopes/${id}`,
            method: "GET",
        }, cb);
    }

    /**
     * Update
     * @param id
     * @param data
     * @param cb
     */
    static updateScopeById(id, data, cb) {
        PolimClient.request({
            endpoint: `scopes/${id}`,
            method: "PUT",
            body: data
        }, cb);
    }

    /**
     * Delete
     * @param id
     * @param cb
     */
    static deleteScopeById(id, cb) {
        PolimClient.request({
            endpoint: `scopes/${id}`,
            method: "DELETE",
        }, cb);
    }

}