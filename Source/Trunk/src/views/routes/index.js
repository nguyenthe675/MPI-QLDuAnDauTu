import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './private.route';
import routes from './route.loader';
//Import Page
import Dashboard from '../containers/Dashboard';
import Login from '../containers/Authentication/signin';
import Signout from '../containers/Authentication/signout';
import NotFound from '../containers/Authentication/notfound';
import ProcessConfig from '../containers/ProcessConfig';

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    {/* <PrivateRoute exact path="/" component={Dashboard} permission={['TS_001']} /> */}
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
                    <Route path="/cfg" component={ProcessConfig} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;
