import React, {Component} from 'react'
import { components } from 'react-select'
import {fromJS} from "immutable";

const md5 = require("blueimp-md5");

const fake = {
    id: 0,
    code: 'root',
    children: [
        {
            id: 1, parentId: 0, description: 'Cái méo gì đây', code: 'settings', name: 'Settings',
            children: [
                {id: 11, parentId:1, description: 'Cái méo gì đây 1', code: 'settings1', name: 'Settings 1'},
                {
                    id: 12, parentId:1, code: 'settings2', name: 'Settings 2', children: [
                        {
                            id: 211, parentId:12, code: 'settings21', name: 'Settings 2 - 1',
                            children: [
                                {id: 2111, parentId:211, code: 'settings211', name: 'Settings 2 - 1 - 1'},
                            ]
                        },
                        {id: 221, parentId:12, code: 'settings22', name: 'Settings 2 - 2'},
                    ]
                },
            ]
        },
        {
            id: 10, parentId: 0, code: 'apps', name: 'Apps',
            children: [
                {
                    id: 102, parentId: 10, code: 'apps1', name: 'Apps 1', children: [
                        {
                            id: 1001, parentId: 102, code: 'apps21', name: 'Apps 2 - 1',
                            children: [
                                {id: 10001, parentId: 1001, code: 'apps211', name: 'Apps 2 - 1 - 1'},
                            ]
                        },
                    ]
                },
            ]
        }
    ]
};

export default class CollapseClientList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            clients: []
        }
    }

    componentDidMount () {
        let {clients} = this.props;
        if(Array.isArray(clients) && clients.length > 0) {
            this.setState({
                clients: clients
            })
        }
    }

    /**
     * kiểm tra thay đổi va set lại state
     */
    componentDidUpdate (prevProps) {
        if (JSON.stringify(this.props.clients) !== JSON.stringify(prevProps.clients)) {
            if(Array.isArray(this.props.clients) && this.props.clients.length > 0) {
                this.setState({
                    clients: this.props.clients
                })
            }
        }
    }

    /**
     * toggle show hide
     */
    toggleHandle = (field) => {
        let state = this.state;
        if (!state[field]) {
            state[field] = true;
        } else {
            state[field] = false;
        }

        this.setState({...state})
    };

    /**
     * kiểm tra item với current item
     * @param id
     * @returns {boolean}
     */
    checkCurrent = (id) => {
        return id+'' === this.state.current+''
    };

    /**
     * render rowchild các permission phân quyền chi tiết
     * @param item
     * @param index
     * @param mgl
     * @returns {*[]}
     */
    renderRowChild = (item, index, mgl) => {
        mgl = mgl + 20;
        return [
            <div className="row mgbt20">
                <div className="col-xl-4 col-md-4 col-4">
                    <div className={`position-re mgl${mgl}`}>
                        <h3 className="roboto-regular txt-size-h4 txt-color-black3 line-height134">
                            {item.name}
                        </h3>
                    </div>
                </div>
                <div className="col-xl-8 col-md-8 col-4">
                    <p className="txt-color-black3 roboto-regular txt-size-h4 line-height134">
                        {item.description}
                    </p>
                </div>
            </div>,
            Array.isArray(item.children) && item.children.map((i, j) => this.renderRowChild(i, j, mgl))
        ]
    };

    /**
     * render row các permission chức năng
     * @param item
     * @param index
     * @returns {*}
     */
    renderRow = (item, index) => {
        return (
            <div className={`tabsdetail__permission_content--box ${!this.state[`code_${item.code}`] && 'tabsdetail__userpermission_content--down'}`} key={index}>
                <div className="row">
                    <div className="col-12" >
                        <div className="border-bootom-1x bd-color-gray pd15 pdl0">
                    <div className="row">
                        <div className="col-xl-4 col-md-4 col-4">
                            <span className="txt-size-h3 txt-color-black2 roboto-bold">
                                {item.name}
                            </span>
                        </div>
                        <div className="col-xl-6 col-md-5 col-4">
                            <p className="txt-color-black3 roboto-regular txt-size-h4 line-height134">
                                {item.description}
                            </p>
                        </div>
                        <div className="col-xl-2 col-md-3 col-4">
                            {
                                this.state[`code_${item.code}`]
                                ?
                                <span onClick={() => this.toggleHandle(`code_${item.code}`)} className="_toggleRole roboto-regular txt-size-h4 txt-color-blue2 flr cursor-pointer">
                                    Thu gọn <i className="fas fa-chevron-up txt-size-h5" />
                                </span>
                                :
                                <span onClick={() => this.toggleHandle(`code_${item.code}`)} className="_toggleRole roboto-regular txt-size-h4 txt-color-blue2 flr cursor-pointer">
                                    Xem thêm <i className="fas fa-chevron-down txt-size-h5" />
                                </span>
                            }

                        </div>
                    </div>
                    {
                        Array.isArray(item.children)
                        &&
                        <div className="wp-row tabsdetail__content mgt30">
                            {item.children.map((i, j) => this.renderRowChild(i, j, 0))}
                        </div>
                    }
                </div>
                    </div>
                </div>
            </div>
        )
    };

    /**
     * render row nhóm quyền
     * @param item
     * @param index
     * @returns {*}
     */
    renderRoleRow = (item, index) => {
        return (
            <div className="row" key={index}>
                <div className="col-md-2 pdt15">
                    <h3 className="roboto-bold txt-size-h4 txt-color-blue2">
                        Telesales
                    </h3>
                </div>
                <div className="col-md-10 col-12">
                    {
                        fake.children.map((i, j) => this.renderRow(i, j))
                    }
                </div>
            </div>
        )
    };

    /**
     * render collase ẩn hiện
     * @returns {*[]}
     */
    renderCollapse = () => {
        return ([
            <div className="tabsdetail__permission_top pd15 mgt20">
                <div className="row ">
                    <div className="col-xl-2 col-md-3 col-4">
                        <span className="txt-color-black txt-size-h4 roboto-bold">
                            Tên nhóm
                        </span>
                    </div>
                    <div className="col-xl-10 col-md-9 col-8">
                        <div className="row">
                            <div className="col-xl-4 col-md-4 col-8">
                                <span className="txt-color-black txt-size-h4 roboto-bold">
                                    Tên chức năng
                                </span>
                            </div>
                            <div className="col-xl-8 col-md-8 col-4">
                                <span className="txt-color-black txt-size-h4 roboto-bold">
                                    Mô tả
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            <div className="pdl15 pdr15">
                {this.renderRoleRow()}
            </div>
        ])
    };

    render() {
        const {data} = this.props;
        if (data.id === undefined || data.id === null) return null;
        const avatar = 'https://www.gravatar.com/avatar/' + md5(data.name) + '?d=identicon';
        return (
            <div className="bd1px bd-color-gray bd-rdu4 pdt20 pdbt20 mgbt30">
                <div className="pdl15 pdr15">
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="pdt5">
                                <li className="fll mgr15">
                                    <span className="img-app dpl-block">
                                        <img src={avatar} className="img-w-30" />
                                    </span>
                                </li>
                                <li className="fll pdt5">
                                    <span className="txt-app roboto-bold txt-size-h2 txt-color-blue2 dpl-il-block">
                                        {data.name}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <div className="wp-btn flr mgt5 align-center">
                                <a className="_addCollapse btn btn--blue cursor-pointer">Thêm vào nhóm</a>

                                <span
                                    onClick={() => this.setState({showing: !this.state.showing})}
                                    className="_toggleCollapse roboto-regular txt-size-h4 txt-color-blue2 flr cursor-pointer txt-nowrap mgl10"
                                >
                                    {this.state.showing ? 'Thu gọn' : 'Chi tiết'} <i className={`fas ${this.state.showing ? 'fa-chevron-up' : 'fa-chevron-down'} txt-size-h5`} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    this.state.showing && this.renderCollapse()
                }

            </div>
        )
    }
}
