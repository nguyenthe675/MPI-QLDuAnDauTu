
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import StorageService from '../../services/StorageService';

export const PrivateRoute = ({ component: ComposedComponent, permission: Permission, ...rest }) => {

    class Authentication extends Component {

        // redirect if not authenticated; otherwise, return the component imputted into <PrivateRoute />
        handleRender(props) {
            if (!this.props.authenticated) {
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        from: props.location,
                        message: 'Bạn cần đăng nhập hệ thống!'
                    }
                }} />
            } else if (!StorageService.checkPermission(Permission)) {
                return <Redirect to={{
                    pathname: '/notfound',
                    state: {
                        from: props.location,
                        message: 'Bạn không có quyền truy cập trang này!'
                    }
                }} />
            } else {
                return <ComposedComponent {...props} />
            }
        }

        render() {
            return (
                <Route {...rest} render={this.handleRender.bind(this)} />
            )
        }
    }

    function mapStateToProps(state) {
        return { authenticated: state.auth.authenticated };
    }

    const AuthenticationContainer = connect(mapStateToProps)(Authentication)
    return <AuthenticationContainer />
}