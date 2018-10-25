import React from 'react';
import Loadable from 'react-loadable';
//Import Page
function Loading() {
    return <div>Đang tải trang...</div>;
}

const Users = Loadable({
    loader: () => import('../containers/Users'),
    loading: Loading,
});
const ProcessConfig = Loadable({
    loader: () => import('../containers/ProcessConfig'),
    loading: Loading,
});

const routes = [
    { path: '/users', exact: true, name: 'Users', component: Users, permission: ['TS_002'] },
    { path: '/processcfg', exact: true, name: 'ProcessConfig', component: ProcessConfig, permission: ['TS_002'] },
];

export default routes;
