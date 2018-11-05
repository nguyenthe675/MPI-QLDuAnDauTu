import React, { Component } from 'react'
import MetisMenu from 'react-metismenu';
import '../Sidebar/react-metismenu-standart.css';
import StorageService from '../../../../services/StorageService';
import MenuTree from './MenuTree';

export default class Sidebar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menu: []
        }
    }
    componentDidMount() {
        this.getTree();
    }
    filterTree = (menu) => {
        let kq = menu.filter((item) => {
            if (StorageService.checkPermission(item.permission)) {
                return true;
            } else {
                return false;
            }
        });
        return kq;
    }

    getTree = () => {
        let kq = this.filterTree(MenuTree);
        kq.forEach((item) => {
            if (item.content && item.content.length > 0) {
                item.content = this.filterTree(item.content);
            }
        });
        this.setState({
            menu: kq
        })
    }
    render() {
        // let params = window.location.href.split("#");
        return (
            <aside className="main-sidebar hidden-print ">
                <section className="sidebar">

                    <div className="user-panel">
                        <div className="f-left image"><img src="assets/images/avatar-1.png" alt="User" className="img-circle" /></div>
                        <div className="f-left info">
                            <p>Administrator</p>
                            <p className="designation">Quản lý tài sản <i className="icofont icofont-caret-down m-l-5"></i></p>
                        </div>
                    </div>
                    <ul className="nav sidebar-menu extra-profile-list">
                        <li>
                            <a href="/" className="waves-effect waves-dark">
                                <i className="icon-user"></i>
                                <span className="menu-text">Thông tin tài khoản</span>
                                <span className="selected"></span>
                            </a>
                        </li>
                        <li>
                            <a href="/" className="waves-effect waves-dark">
                                <i className="icon-settings"></i>
                                <span className="menu-text">Cài đặt</span>
                                <span className="selected"></span>
                            </a>
                        </li>
                        <li>
                            <a href="/" className="waves-effect waves-dark">
                                <i className="icon-logout"></i>
                                <span className="menu-text">Đăng xuất</span>
                                <span className="selected"></span>
                            </a>
                        </li>
                    </ul>
                    <MetisMenu
                        ref={(r) => { this.menu = r; }}
                        activeLinkFromLocation
                        iconNamePrefix=""
                        iconNameStateVisible="icon-arrow-up"
                        iconNameStateHidden="icon-arrow-down"
                        classNameItemHasVisibleChild="open"
                        className="menu"
                        content={this.state.menu}
                    />
                </section>
            </aside>
        )
    }
}
