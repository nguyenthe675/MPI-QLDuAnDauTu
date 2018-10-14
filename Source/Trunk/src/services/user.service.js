import { ApiClient } from './api'


let client = new ApiClient();

export default {

    all() {
        return client.get('/users');
    },

    find(userId) {
        return client.get(`/users/${userId}`);
    },

    update(userId, data) {
        return client.put(`/users/${userId}`, data);
    }

}