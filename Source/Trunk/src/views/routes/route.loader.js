import React from 'react';
import Loadable from 'react-loadable';
//Import Page
function Loading() {
    return <div>Đang tải trang...</div>;
}
const Dashboard = Loadable({
    loader: () => import('../containers/Dashboard'),
    loading: Loading,
});
const Users = Loadable({
    loader: () => import('../containers/Users'),
    loading: Loading,
});
const ChucDanh = Loadable({
    loader: () => import('../containers/ChucDanh'),
    loading: Loading,
});
const ProcessConfig = Loadable({
    loader: () => import('../containers/ProcessConfig'),
    loading: Loading,
});

const routes = [
    { path: '/', exact: true, name: 'Danh sách tài sản', component: Dashboard, permission: ['TS_001'] },
    { path: '/users', exact: true, name: 'Users', component: Users, permission: ['TS_002'] },
    { path: '/chucdanh', exact: true, name: 'Chức danh', component: ChucDanh, permission: ['DM_006'] },
    { path: '/processcfg', exact: true, name: 'ProcessConfig', component: ProcessConfig, permission: ['QTHT_012'] },
];

export default routes;
