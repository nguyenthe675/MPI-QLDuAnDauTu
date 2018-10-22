import { ApiClient } from './api'
const client = new ApiClient('http://localhost/EPS.QLTS.Services.WebAPI/API/', false);

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