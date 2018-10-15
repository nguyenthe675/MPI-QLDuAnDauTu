import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import { PrivateRoute } from './views/components/PrivateRoute';

import Dashboard from './views/containers/Dashboard';


import Login from './views/containers/Authentication/signin';
import Signout from './views/containers/Authentication/signout';

function Loading() {
    return <div>Đang tải...</div>;
}


const Users = Loadable({
    loader: () => import('./views/containers/Users'),
    loading: Loading,
});

const UserDetail = Loadable({
    loader: () => import('./views/containers/Users/Detail'),
    loading: Loading,
});

const routes = [
    { path: '/', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/users', exact: true, name: 'Users', component: Users },
    { path: '/users/:id', exact: true, name: 'UserDetail', component: UserDetail },
];

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    {
                        routes.map((route, index) => {
                            return (
                                <PrivateRoute key={index} exact={route.exact} path={route.path} component={route.component} />
                            )
                        })
                    }
                    <Route path="/login" component={Login} />
                    <Route path="/signout" component={Signout} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;
