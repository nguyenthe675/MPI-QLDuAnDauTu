import React, { Component } from 'react';
import UserMenu from '../UserMenu';
const md5 = require("blueimp-md5");

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
        //this.getCurrentUser()
    }

    getCurrentUser = () => {

    };

    logout = () => {

    };

    render() {
        return (
            <header className="main-header-top hidden-print">
                <a href="index.html" className="logo"><img className="img-fluid able-logo" />
                    <span >Dự án đầu tư</span>
                </a>
                <nav className="navbar navbar-static-top">
                    <a href="#!" data-toggle="offcanvas" className="sidebar-toggle"></a>
                    <div className="navbar-custom-menu f-right">
                        <ul className="top-nav">
                            <li className="dropdown pc-rheader-submenu message-notification search-toggle">
                                <a href="#!" id="morphsearch-search" className="drop icon-circle txt-white">
                                    <i className="icofont icofont-search-alt-1"></i>
                                </a>
                            </li>
                            <li className="dropdown notification-menu">
                                <a href="#!" data-toggle="dropdown" aria-expanded="false" className="dropdown-toggle">
                                    <i className="icon-bell"></i>
                                    <span className="badge badge-danger header-badge">9</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="not-head">You have <b className="text-primary">4</b> new notifications.</li>
                                    <li className="bell-notification">
                                        <a href="javascript:;" className="media">
                                            <span className="media-left media-icon">
                                                <img className="img-circle" src="assets/images/avatar-1.png" alt="User Image" />
                                            </span>
                                            <div className="media-body"><span className="block">Lisa sent you a mail</span><span
                                                className="text-muted block-time">2min ago</span></div>
                                        </a>
                                    </li>
                                    <li className="bell-notification">
                                        <a href="javascript:;" className="media">
                                            <span className="media-left media-icon">
                                                <img className="img-circle" src="assets/images/avatar-2.png" alt="User Image" />
                                            </span>
                                            <div className="media-body"><span className="block">Server Not Working</span><span
                                                className="text-muted block-time">20min ago</span></div>
                                        </a>
                                    </li>
                                    <li className="bell-notification">
                                        <a href="javascript:;" className="media"><span className="media-left media-icon">
                                            <img className="img-circle" src="assets/images/avatar-3.png" alt="User Image" />
                                        </span>
                                            <div className="media-body"><span className="block">Transaction xyz complete</span><span
                                                className="text-muted block-time">3 hours ago</span></div>
                                        </a>
                                    </li>
                                    <li className="not-footer">
                                        <a href="#!">See all notifications.</a>
                                    </li>
                                </ul>
                            </li>
                            <li className="pc-rheader-submenu ">
                                <a href="#!" className="drop icon-circle displayChatbox">
                                    <i className="icon-bubbles"></i>
                                    <span className="badge badge-danger header-badge blink">5</span>
                                </a>

                            </li>
                            <li className="pc-rheader-submenu">
                                <a href="#!" className="drop icon-circle" >
                                    <i className="icon-size-fullscreen"></i>
                                </a>

                            </li>
                            <li className="dropdown">
                                {/* <a href="#!" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                                    className="dropdown-toggle drop icon-circle drop-image">
                                    <span><img className="img-circle " src="assets/images/avatar-1.png" alt="User Image" /></span>
                                    <span>Administrator <i className=" icofont icofont-simple-down"></i></span>

                                </a>
                                <ul className="dropdown-menu settings-menu">
                                    <li><a href="#!"><i className="icon-settings"></i> Cài đặt</a></li>
                                    <li><a href="profile.html"><i className="icon-user"></i> Thông tin tài khoản</a></li>
                                    <li><a href="message.html"><i className="icon-envelope-open"></i> Tin nhắn</a></li>
                                    <li className="p-0">
                                        <div className="dropdown-divider m-0"></div>
                                    </li>
                                    <li><a href="#!"><i className="icon-logout"></i> Đăng xuất</a></li>

                                </ul> */}
                                <UserMenu></UserMenu>
                            </li>
                        </ul>

                        <div id="morphsearch" className="morphsearch">
                            <form className="morphsearch-form">

                                <input className="morphsearch-input" type="search" placeholder="Tìm kiếm..." />

                                <button className="morphsearch-submit" type="submit"></button>

                            </form>
                            <div className="morphsearch-content">
                                <div className="dummy-column">
                                    <h2>People</h2>
                                    <a className="dummy-media-object" href="#!">
                                        <img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G"
                                            alt="Sara Soueidan" />
                                        <h3>Sara Soueidan</h3>
                                    </a>

                                    <a className="dummy-media-object" href="#!">
                                        <img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G"
                                            alt="Shaun Dona" />
                                        <h3>Shaun Dona</h3>
                                    </a>
                                </div>
                                <div className="dummy-column">
                                    <h2>Popular</h2>
                                    <a className="dummy-media-object" href="#!">
                                        <img src="assets/images/avatar-1.png" alt="PagePreloadingEffect" />
                                        <h3>Page Preloading Effect</h3>
                                    </a>

                                    <a className="dummy-media-object" href="#!">
                                        <img src="assets/images/avatar-1.png" alt="DraggableDualViewSlideshow" />
                                        <h3>Draggable Dual-View Slideshow</h3>
                                    </a>
                                </div>
                                <div className="dummy-column">
                                    <h2>Recent</h2>
                                    <a className="dummy-media-object" href="#!">
                                        <img src="assets/images/avatar-1.png" alt="TooltipStylesInspiration" />
                                        <h3>Tooltip Styles Inspiration</h3>
                                    </a>
                                    <a className="dummy-media-object" href="#!">
                                        <img src="assets/images/avatar-1.png" alt="NotificationStyles" />
                                        <h3>Notification Styles Inspiration</h3>
                                    </a>
                                </div>
                            </div>
                            <span className="morphsearch-close"><i className="icofont icofont-search-alt-1"></i></span>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}
