import { ApiClient } from './api';
import { apiUrl } from '../config';
const client = new ApiClient(apiUrl, true, false);
const clientv2 = new ApiClient(apiUrl, true, true);

export default {

    all() {
        return client.get('/DanhMuc/GetAllChucDanh');
    },
    allPage(data) {
        return client.post('/DanhMuc/GetAllChucDanh', data);
    },
    totalPage() {
        return client.post('/User/GetTotalUsers');
    },
    find(userId) {
        return client.get(`/users/${userId}`);
    },

    update(userId, data) {
        return client.put(`/users/${userId}`, data);
    },
    create(data) {
        return clientv2.post('DanhMuc/CreateChucDanh', data);
    }

}