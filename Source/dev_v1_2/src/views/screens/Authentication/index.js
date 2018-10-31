/**
 * created by Taobao dev team - 15/1/2018
 */
import React from 'react'
import DocumentTitle from "react-document-title";

export default class Authentication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            msg: 'Đang kiểm tra xác thực, vui lòng đợi'
        }
    }

    componentWillMount() {

    }



    /**
     * chuyển về trang chủ sau khi đăng nhập thành công
     */
    redirectParent = () => {
        window.opener.location.href = window.location.origin;
    };

    render() {
        return (
            <DocumentTitle title={'Quản lý dự án đầu tư - Đăng nhập hệ thống'}>

            </DocumentTitle>
        );
    }
}
