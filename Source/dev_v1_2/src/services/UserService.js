import { APIService } from './APIService';
import { apiUrl } from '../config';
const client = new APIService(apiUrl, true, false);

export default {

    all() {
        return client.get('/users');
    },
    allPage(data) {
        return client.post('/User/GetAllUsers', data);
    },
    totalPage() {
        return client.post('/User/GetTotalUsers');
    },
    find(userId) {
        return client.get(`/users/${userId}`);
    },

    update(userId, data) {
        return client.put(`/users/${userId}`, data);
    }

}