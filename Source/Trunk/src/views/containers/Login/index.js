/**
 * created by Taobao dev team - 15/1/2018
 */
import React from 'react'
import MainLayout from "../../components/Layout/MainLayout";
import { history } from "../../helpers";
import userService from '../../services/user.service';

class Login extends React.Component {
    componentWillMount() {
        // reset login status
        //userService.logout();
    }

    render() {
        return (
            <MainLayout {...this.props}>
                <span>Login Page</span>
                <a onClick={() => history.push('/')}>Click me</a>
            </MainLayout>
        );
    }
}

export default Login;