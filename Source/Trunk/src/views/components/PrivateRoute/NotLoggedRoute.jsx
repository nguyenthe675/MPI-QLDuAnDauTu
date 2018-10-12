import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        return (
            //!LocalStore.getInstance().read('loginSession')
            !(1 === 1)
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
    }} />
);