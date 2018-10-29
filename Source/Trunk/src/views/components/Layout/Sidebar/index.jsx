import React, { Component } from 'react'
import MetisMenu from 'react-metismenu';
import '../Sidebar/react-metismenu-standart.css';
const menu1 = [
    {
        id: 1,
        icon: 'icon-speedometer',
        label: 'Tổng quan',
        to: '/',
    },
    {
        id: 2,
        icon: 'icon-briefcase',
        label: 'Quản lý danh mục',
        content: [
            {
                id: 3,
                icon: 'icon-arrow-right',
                label: 'Danh mục chức danh',
                to: '#chucdanh',
            },
            {
                id: 4,
                icon: 'icon-arrow-right',
                label: 'Danh mục địa bàn',
                to: '#diaban',
            },
            {
                id: 5,
                icon: 'icon-arrow-right',
                label: 'Danh mục loại dự án',
                to: '#duan',
            },
            {
                id: 6,
                icon: 'icon-arrow-right',
                label: 'Danh mục loại nguồn vốn',
                to: '#nguonvon',
            },
        ],
    },
    {
        id: 15,
        icon: 'icon-book-open',
        label: 'Nghiệp vụ tài sản',
        content: [
            {
                id: 16,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
            },
            {
                id: 17,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
            }
        ],
    },
    {
        id: 7,
        icon: 'icon-list',
        label: 'Quản trị hệ thống',
        content: [
            {
                id: 8,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
            },
            {
                id: 9,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#users',
            },
            {
                id: 10,
                icon: 'icon-arrow-right',
                label: 'Tham số hệ thống',
                to: '#syspra',
            },
            {
                id: 11,
                icon: 'icon-arrow-right',
                label: 'Nhật ký',
                to: '#log',
            },
            {
                id: 71,
                icon: 'icon-arrow-right',
                label: 'Cấu hình quy trình động',
                to: '#processcfg',
            },
        ],
    },
    {
        id: 12,
        icon: 'icon-calendar',
        label: 'Tiện ích',
        content: [
            {
                id: 13,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
            },
            {
                id: 14,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
            }
        ],
    },

    {
        id: 18,
        icon: 'icon-chart',
        label: 'Báo cáo',
        content: [
            {
                id: 19,
                icon: 'icon-arrow-right',
                label: 'Nhóm người dùng',
                to: '#role',
            },
            {
                id: 20,
                icon: 'icon-arrow-right',
                label: 'Người dùng',
                to: '#user',
            }
        ],
    },
];

export default class Sidebar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menu: menu1
        }
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
                            <a className="waves-effect waves-dark">
                                <i className="icon-user"></i>
                                <span className="menu-text">Thông tin tài khoản</span>
                                <span className="selected"></span>
                            </a>
                        </li>
                        <li>
                            <a className="waves-effect waves-dark">
                                <i className="icon-settings"></i>
                                <span className="menu-text">Cài đặt</span>
                                <span className="selected"></span>
                            </a>
                        </li>
                        <li>
                            <a className="waves-effect waves-dark">
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
