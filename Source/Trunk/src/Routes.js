import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { PrivateRoute } from './views/components/PrivateRoute';

import Dashboard from './views/containers/Dashboard';


import Login from './views/containers/Authentication/signin';
import Signout from './views/containers/Authentication/signout';
import NotFound from './views/containers/Authentication/notfound';

function Loading() {
    return <div>Đang tải...</div>;
}


const Users = Loadable({
    loader: () => import('./views/containers/Users'),
    loading: Loading,
});


const routes = [
    { path: '/', exact: true, name: 'Dashboard', component: Dashboard, permission: ['TS_DanhSachTaiSanDonVi'] },
    { path: '/users', exact: true, name: 'Users', component: Users, permission: ['QTHT_QuanLyNguoiDung'] },
];

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    {
                        routes.map((route, index) => {
                            return (
                                <PrivateRoute key={index} exact={route.exact} path={route.path} component={route.component} permission={route.permission} />
                            )
                        })
                    }
                    <Route path="/login" component={Login} />
                    <Route path="/signout" component={Signout} />
                    <Route path="/notfound" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;
