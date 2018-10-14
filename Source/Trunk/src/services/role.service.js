import { ApiClient } from './api'


let client = new ApiClient();

export default {

    all() {
        return client.get('/roles');
    },

    find(userId) {
        return client.get(`/roles/${userId}`);
    },

    update(userId, data) {
        return client.put(`/roles/${userId}`, data);
    }

}