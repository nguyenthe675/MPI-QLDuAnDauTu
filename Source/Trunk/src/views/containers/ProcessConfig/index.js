import React from 'react';

import MainLayout from "../../components/Layout/MainLayout";
import Ribon from '../../components/UI/Ribon';
import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import './tree.css';
const thuTucs = [
    { ThuTucId: 'TT1', TenThuTuc: 'Thủ tục 1' },
    { ThuTucId: 'TT2', TenThuTuc: 'Thủ tục 2' },
    { ThuTucId: 'TT3', TenThuTuc: 'Thủ tục 3' },
    { ThuTucId: 'TT4', TenThuTuc: 'Thủ tục 4' },
    { ThuTucId: 'TT5', TenThuTuc: 'Thủ tục 5' },
];
const roles = [
    { RoleId: 'R1', RoleName: 'Cá nhân, tổ chức' },
    { RoleId: 'R2', RoleName: 'Bộ phận một cửa' },
    { RoleId: 'R3', RoleName: 'Lãnh đạo xử lý' },
    { RoleId: 'R4', RoleName: 'Chuyên viên xử lý' },
    { RoleId: 'R5', RoleName: 'Lãnh đạo vụ cục' },
];

const trangthais = [
    { TrangThaiId: 'TT1', Title: 'Hồ sơ vừa khai báo' },
    { TrangThaiId: 'TT2', Title: 'Hồ sơ chờ tiếp nhận' },
    { TrangThaiId: 'TT3', Title: 'Hồ sơ yêu cầu bổ sung' },
    { TrangThaiId: 'TT4', Title: 'Hồ sơ chờ tiếp nhận bổ sung' },
    { TrangThaiId: 'TT5', Title: 'Hồ sơ chờ phân công xử lý' },
    { TrangThaiId: 'TT6', Title: 'Hồ sơ chờ kết quả thẩm định' },
    { TrangThaiId: 'TT7', Title: 'Hồ sơ bị từ chối' },
    { TrangThaiId: 'TT8', Title: 'Hồ sơ đã rút' },
    { TrangThaiId: 'TT9', Title: 'Hồ sơ đã được công nhận' },
    { TrangThaiId: 'TT10', Title: 'Hồ sơ đã có quyết định' },
    { TrangThaiId: 'TT11', Title: 'Hồ sơ đang xử lý' },
    { TrangThaiId: 'TT12', Title: 'Thông báo lệ phí' },
    { TrangThaiId: 'TT13', Title: 'Hồ sơ đã có quyết định' },
    { TrangThaiId: 'TT14', Title: 'Hồ sơ đã được công nhận' },
];

const actions = [
    { ActionId: 'A1', Title: 'Cá nhân, tổ chức', Type: 1 },
    { ActionId: 'A2', Title: 'Bộ phận một cửa', Type: 2 },
    { ActionId: 'A3', Title: 'Lãnh đạo xử lý', Type: 2 },
    { ActionId: 'A4', Title: 'Chuyên viên xử lý', Type: 1 },
    { ActionId: 'A5', Title: 'Lãnh đạo vụ cục', Type: 3 },
];

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            khoitao: false
        }
    }

    componentDidMount() {

    }

    /**
     * Khi unmount ra thì bỏ sự kiện popstate
     */
    componentWillUnmount() {

    }
    initActionCfg = (id, title, thutucid) => {
        return {
            id: uuidv1(),
            actionid: id,
            title: title,
            thutucid: thutucid
        }
    }
    initRoleCfg = (id, title) => {
        return {
            id: uuidv1(),
            roleid: id,
            title: title,
            childrens: [

            ]
        }
    }
    initTrangThaiCfg = (id, title) => {
        return {
            id: uuidv1(),
            trangthaiid: id,
            title: title,
            childrens: [

            ]
        }
    }
    initThuTucCfg = (id, title) => {
        return {
            id: uuidv1(),
            thutucid: id,
            title: title,
            childrens: [
                this.initRoleCfg(null, null)
            ]
        }
    }
    onRoleChange = (event) => {
        var target = event.target;
        var id = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateRole(id, value, this.initTrangThaiCfg(null, null));
    }

    onTrangThaiChange = (event) => {
        var target = event.target;
        var id = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateRole(id, value, this.initTrangThaiCfg(null, null));
    }

    onHandleChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        let config = this.initThuTucCfg(value, name);
        console.log(config);
        this.setState({
            config: config,
            khoitao: true
        });
    }
    onRoleAdd = () => {
        var config = this.state.config;
        var role = this.initRoleCfg(null, null);
        config.childrens.push(role);
        this.setState({
            config: config,
        });
    }
    updateRole = (id, roleid, childs) => {
        var config = this.state.config;
        config.childrens.forEach((item, index) => {
            if (item.id == id) {
                item.roleid = roleid;
                item.childrens = [childs];
            }
        });
        this.setState({
            config: config,
        });
        console.log('Đổi role');
        console.log(config);
    }
    render() {
        return (
            <MainLayout {...this.props} className={'listuser listapp'}>
                <Ribon breadCrumb={[{ name: 'Cấu hình quy trình động' }]} />

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-header-text">Cấu hình quy trình động</h5>
                            </div>
                            <div className="card-block">
                                <div className="form-group row">
                                    <div className="tree">
                                        <ul>
                                            <li>
                                                <div className="node">
                                                    <select
                                                        className="form-control"
                                                        onChange={this.onHandleChange}
                                                        name="thutucs"
                                                    >
                                                        <option value="">Chọn thủ tục</option>
                                                        {
                                                            thuTucs.map((thutuc, index) => {
                                                                return <option key={index} value={thutuc.ThuTucId}>{thutuc.TenThuTuc}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                {
                                                    this.state.khoitao ?
                                                        <ul >
                                                            {
                                                                this.state.config.childrens.map((chilrole, index) => {
                                                                    return (
                                                                        <li key={index}>
                                                                            <div className="node">
                                                                                <select
                                                                                    className="form-control"
                                                                                    onChange={this.onRoleChange}
                                                                                    name={chilrole.id}
                                                                                >
                                                                                    <option value="">Chọn bộ phận</option>
                                                                                    {
                                                                                        roles.map((role, index) => {
                                                                                            return <option key={index} value={role.RoleId}>{role.RoleName}</option>
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                            {
                                                                                _.isArray(chilrole.childrens) ?
                                                                                    <ul className="childs">
                                                                                        {
                                                                                            chilrole.childrens.map((childtrangthai, index) => {
                                                                                                return (
                                                                                                    <li key={index}>
                                                                                                        <div className="node">
                                                                                                            <select
                                                                                                                className="form-control"
                                                                                                                onChange={this.onTrangThaiChange}
                                                                                                                name={childtrangthai.id}
                                                                                                            >
                                                                                                                <option value="">Chọn trạng thái</option>
                                                                                                                {
                                                                                                                    trangthais.map((trangthai, index) => {
                                                                                                                        return <option key={index} value={trangthai.TrangThaiId}>{trangthai.Title}</option>
                                                                                                                    })
                                                                                                                }
                                                                                                            </select>
                                                                                                        </div>
                                                                                                        {
                                                                                                            _.isArray(childtrangthai.childrens) ?
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        childtrangthai.childrens.map((childaction, index) => {
                                                                                                                            return (
                                                                                                                                <li key={index}>
                                                                                                                                    <div className="node">
                                                                                                                                        <select
                                                                                                                                            className="form-control"
                                                                                                                                            onChange={this.onRoleChange}
                                                                                                                                            name={childtrangthai.id}
                                                                                                                                        >
                                                                                                                                            <option value="">Chọn trạng thái</option>
                                                                                                                                            {
                                                                                                                                                actions.map((action, index) => {
                                                                                                                                                    return <option key={index} value={action.ActionId}>{action.Title}</option>
                                                                                                                                                })
                                                                                                                                            }
                                                                                                                                        </select>
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                </ul>
                                                                                                                :
                                                                                                                <span>Chưa chọn trạng thái</span>
                                                                                                        }
                                                                                                    </li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                        <li>
                                                                                            <div className="node"><i className="icofont icofont-plus"></i></div>
                                                                                        </li>
                                                                                    </ul>
                                                                                    : <span>Chưa chọn bộ phận</span>
                                                                            }
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                            <li>
                                                                <div className="node"><a onClick={this.onRoleAdd}><i className="icofont icofont-plus"></i></a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        : <span>Chưa chọn thủ tục</span>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout >
        );
    }
}
