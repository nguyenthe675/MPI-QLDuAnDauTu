import PolimClient from "../utils/api/PolimClient";

export default class ClientService {

    /**
     * lấy danh sách clients
     * @param filter
     * @param cb
     */
    static getAllClients(filter, cb) {
        PolimClient.request({
            endpoint: `clients${filter}`,
            method: "GET",
        }, cb);
    }

    /**
     * Create a OAuth Client
     * @param data
     * @param cb
     */
    static createClient(data, cb) {
        PolimClient.request({
            endpoint: `clients`,
            method: "POST",
            body: data
        }, cb);
    }

    /**
     * Read
     * @param id
     * @param cb
     */
    static getClientById(id, cb) {
        PolimClient.request({
            endpoint: `clients/${id}`,
            method: "GET",
        }, cb);
    }

    /**
     * Update
     * @param id
     * @param data
     * @param cb
     */
    static updateClientById(id, data, cb) {
        PolimClient.request({
            endpoint: `clients/${id}`,
            method: "PUT",
            body: data
        }, cb);
    }

    /**
     * Delete
     * @param id
     * @param cb
     */
    static deleteClientById(id, cb) {
        PolimClient.request({
            endpoint: `clients/${id}`,
            method: "DELETE",
        }, cb);
    }

    /**
     * Delete
     * @param id
     * @param cb
     */
    static generateSecret(id, cb) {
        PolimClient.request({
            endpoint: `clients/${id}/generate-secret`,
            method: "GET",
        }, cb);
    }

}