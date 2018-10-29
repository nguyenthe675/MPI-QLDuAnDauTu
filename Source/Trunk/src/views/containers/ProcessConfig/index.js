import React from 'react';

import MainLayout from "../../components/Layout/MainLayout";
import Ribon from '../../components/UI/Ribon';
import uuidv1 from 'uuid/v1';
import _ from 'lodash';
import './tree.css';
import './slidemenu.css';
import chart1 from './chart-flow-1.svg';
import chart2 from './chart-flow-2.svg';
const thuTucs = [
    { ThuTucId: 'TT1', TenThuTuc: 'Cấp thẻ Kiểm định viên kiểm định chất lượng giáo dục' },
    { ThuTucId: 'TT2', TenThuTuc: 'Cấp thẻ Kiểm định viên kiểm định chất lượng giáo dục' },
    { ThuTucId: 'TT3', TenThuTuc: 'Công nhận văn bằng tốt nghiệp trung cấp chuyên nghiệp, bằng tốt nghiệp cao đẳng, bằng tốt nghiệp đại học, bằng thạc sĩ và bằng tiến sĩ do cơ sở nước ngoài cấp' },
    { ThuTucId: 'TT4', TenThuTuc: 'Cấp giấy chứng nhận đăng ký hoạt động giáo dục nghề nghiệp đối với nhóm ngành đào tạo giáo viên trình độ cao đẳng' },
    { ThuTucId: 'TT5', TenThuTuc: 'Công nhận trường cao đẳng tư thục hoạt động không vì lợi nhuận' },
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
    { TrangThaiId: 'TT4', Title: 'Hồ sơ chờ bổ sung chờ tiếp nhận' },
    { TrangThaiId: 'TT5', Title: 'Hồ sơ chờ phân công xử lý' },
    { TrangThaiId: 'TT6', Title: 'Hồ sơ chờ thẩm định' },
    { TrangThaiId: 'TT21', Title: 'Hồ sơ chờ thẩm định lại' },
    { TrangThaiId: 'TT7', Title: 'Hồ sơ bị từ chối' },
    { TrangThaiId: 'TT9', Title: 'Hồ sơ đã được công nhận' },
    { TrangThaiId: 'TT12', Title: 'Thông báo lệ phí' },
    { TrangThaiId: 'TT15', Title: 'Hồ sơ chờ trả kết quả' },
    { TrangThaiId: 'TT16', Title: 'Hồ sơ thẩm định đạt' },
    { TrangThaiId: 'TT17', Title: 'Hồ sơ thẩm định từ chối' },
    { TrangThaiId: 'TT18', Title: 'Hồ sơ thẩm định bổ sung' },
    { TrangThaiId: 'TT19', Title: 'Hồ sơ thẩm định đạt chờ phê duyệt' },
    { TrangThaiId: 'TT20', Title: 'Hồ sơ thẩm định từ chối chờ phê duyệt' },
    { TrangThaiId: 'TT22', Title: 'Hồ sơ thẩm định đạt xem xét lại' },
    { TrangThaiId: 'TT23', Title: 'Hồ sơ thẩm định từ chối xem xét lại' },
];

const actions = [
    { ActionId: 'A2', Title: 'Gửi hồ sơ', Type: 2 },
    { ActionId: 'A3', Title: 'Từ chối hồ sơ', Type: 2 },
    { ActionId: 'A4', Title: 'Yêu cầu bổ sung hồ sơ', Type: 1 },
    { ActionId: 'A5', Title: 'Tiếp nhận hồ sơ', Type: 3 },
    { ActionId: 'A6', Title: 'Đồng ý thẩm định', Type: 1 },
    { ActionId: 'A7', Title: 'Từ chối thẩm định', Type: 3 },
    { ActionId: 'A8', Title: 'Thẩm định đạt', Type: 1 },
    { ActionId: 'A9', Title: 'Thẩm định từ chối', Type: 3 },
    { ActionId: 'A9', Title: 'Thẩm định yêu cầu bổ sung', Type: 3 },
    { ActionId: 'A10', Title: 'Phê duyệt hồ sơ', Type: 1 },
    { ActionId: 'A11', Title: 'Phê duyệt từ chối', Type: 3 },
    { ActionId: 'A12', Title: 'Bổ sung hồ sơ', Type: 3 },
    { ActionId: 'A13', Title: 'Phân công xử lý hồ sơ', Type: 3 },
    { ActionId: 'A14', Title: 'Phê duyệt từ chối', Type: 3 },
    { ActionId: 'A15', Title: 'Đồng ý thẩm định', Type: 3 },
    { ActionId: 'A16', Title: 'Từ chối thẩm định', Type: 3 },
];

const getRoleById = (id) => {
    return _.find(roles, { RoleId: id });
}
const getTrangThaiById = (id) => {
    return _.find(trangthais, { TrangThaiId: id });
}
const getActionById = (id) => {
    return _.find(actions, { ActionId: id });
}
const getThuTucById = (id) => {
    return _.find(thuTucs, { ThuTucId: id });
}
export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            khoitao: false,
            chart: true,
            resulft: "Chưa khởi tạo dữ liệu"
        }
    }

    componentDidMount() {

    }

    /**
     * Khi unmount ra thì bỏ sự kiện popstate
     */
    componentWillUnmount() {

    }
    setChart = (val) => {
        this.setState({
            chart: val,
        });
    }
    initConfig = () => {
        this.setState({
            khoitao: true,
            config: JSON.parse("{\"id\":\"49155cc0-db55-11e8-a551-6f7866e567f9\",\"thutucid\":\"TT1\",\"title\":\"C\u1EA5p th\u1EBB Ki\u1EC3m \u0111\u1ECBnh vi\u00EAn ki\u1EC3m \u0111\u1ECBnh ch\u1EA5t l\u01B0\u1EE3ng gi\u00E1o d\u1EE5c\",\"childrens\":[{\"id\":\"491583d0-db55-11e8-a551-6f7866e567f9\",\"roleid\":\"R1\",\"title\":\"C\u00E1 nh\u00E2n, t\u1ED5 ch\u1EE9c\",\"childrens\":[{\"id\":\"4cbae520-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT1\",\"title\":\"H\u1ED3 s\u01A1 v\u1EEBa khai b\u00E1o\",\"childrens\":[{\"id\":\"54c77120-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A2\",\"title\":\"G\u1EEDi h\u1ED3 s\u01A1\",\"type\":2,\"trangthaiid\":\"TT2\"}]},{\"id\":\"59906ae0-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT3\",\"title\":\"H\u1ED3 s\u01A1 y\u00EAu c\u1EA7u b\u1ED5 sung\",\"childrens\":[{\"id\":\"5dfa54b0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A12\",\"title\":\"B\u1ED5 sung h\u1ED3 s\u01A1\",\"type\":3,\"trangthaiid\":\"TT4\"}]}]},{\"id\":\"4a93e670-db55-11e8-a551-6f7866e567f9\",\"roleid\":\"R2\",\"title\":\"B\u1ED9 ph\u1EADn m\u1ED9t c\u1EEDa\",\"childrens\":[{\"id\":\"4e0fedd0-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT2\",\"title\":\"H\u1ED3 s\u01A1 ch\u1EDD ti\u1EBFp nh\u1EADn\",\"childrens\":[{\"id\":\"7ccaaac0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A5\",\"title\":\"Ti\u1EBFp nh\u1EADn h\u1ED3 s\u01A1\",\"type\":3,\"trangthaiid\":\"TT5\"},{\"id\":\"7e47d4e0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A3\",\"title\":\"T\u1EEB ch\u1ED1i h\u1ED3 s\u01A1\",\"type\":2,\"trangthaiid\":\"TT7\"},{\"id\":\"7eac3c00-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A4\",\"title\":\"Y\u00EAu c\u1EA7u b\u1ED5 sung h\u1ED3 s\u01A1\",\"type\":1,\"trangthaiid\":\"TT3\"}]},{\"id\":\"912f4f20-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT4\",\"title\":\"H\u1ED3 s\u01A1 ch\u1EDD ti\u1EBFp nh\u1EADn b\u1ED5 sung\",\"childrens\":[{\"id\":\"936d5840-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A5\",\"title\":\"Ti\u1EBFp nh\u1EADn h\u1ED3 s\u01A1\",\"type\":3,\"trangthaiid\":\"TT5\"},{\"id\":\"98347d40-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A3\",\"title\":\"T\u1EEB ch\u1ED1i h\u1ED3 s\u01A1\",\"type\":2,\"trangthaiid\":\"TT7\"},{\"id\":\"9bc7dd30-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A4\",\"title\":\"Y\u00EAu c\u1EA7u b\u1ED5 sung h\u1ED3 s\u01A1\",\"type\":1,\"trangthaiid\":\"TT3\"}]}]},{\"id\":\"4b2e9fd0-db55-11e8-a551-6f7866e567f9\",\"roleid\":\"R3\",\"title\":\"L\u00E3nh \u0111\u1EA1o x\u1EED l\u00FD\",\"childrens\":[{\"id\":\"4f7b8bc0-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT5\",\"title\":\"H\u1ED3 s\u01A1 ch\u1EDD ph\u00E2n c\u00F4ng x\u1EED l\u00FD\",\"childrens\":[{\"id\":\"b900f170-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A13\",\"title\":\"Ph\u00E2n c\u00F4ng x\u1EED l\u00FD h\u1ED3 s\u01A1\",\"type\":3,\"trangthaiid\":\"TT6\"}]},{\"id\":\"c5faef20-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT16\",\"title\":\"H\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh \u0111\u1EA1t\",\"childrens\":[{\"id\":\"cd71cad0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A15\",\"title\":\"\u0110\u1ED3ng \u00FD th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT19\"},{\"id\":\"d45f0420-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A16\",\"title\":\"T\u1EEB ch\u1ED1i th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT21\"}]},{\"id\":\"c8b52d20-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT17\",\"title\":\"H\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i\",\"childrens\":[{\"id\":\"db40f2d0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A15\",\"title\":\"\u0110\u1ED3ng \u00FD th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT20\"},{\"id\":\"dd7956a0-db55-11e8-a551-6f7866e567f9\",\"actionid\":\"A16\",\"title\":\"T\u1EEB ch\u1ED1i th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT21\"}]},{\"id\":\"c92c0ad0-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT18\",\"title\":\"H\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh b\u1ED5 sung\",\"childrens\":[{\"id\":\"3b631620-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A15\",\"title\":\"\u0110\u1ED3ng \u00FD th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT3\"},{\"id\":\"41829f30-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A16\",\"title\":\"T\u1EEB ch\u1ED1i th\u1EA9m \u0111\u1ECBnh\",\"type\":3,\"trangthaiid\":\"TT21\"}]}]},{\"id\":\"4b817ac0-db55-11e8-a551-6f7866e567f9\",\"roleid\":\"R4\",\"title\":\"Chuy\u00EAn vi\u00EAn x\u1EED l\u00FD\",\"childrens\":[{\"id\":\"50a3df20-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT6\",\"title\":\"H\u1ED3 s\u01A1 ch\u1EDD th\u1EA9m \u0111\u1ECBnh\",\"childrens\":[{\"id\":\"4ccb6a70-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A8\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh \u0111\u1EA1t\",\"type\":1,\"trangthaiid\":\"TT16\"},{\"id\":\"50089410-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A9\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i\",\"type\":3,\"trangthaiid\":\"TT17\"},{\"id\":\"5074c360-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A9\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i\",\"type\":3,\"trangthaiid\":\"TT18\"}]},{\"id\":\"588b6180-db56-11e8-aca5-33c165fa24fb\",\"trangthaiid\":\"TT21\",\"title\":\"H\u1ED3 s\u01A1 ch\u1EDD th\u1EA9m \u0111\u1ECBnh l\u1EA1i\",\"childrens\":[{\"id\":\"5a68d410-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A8\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh \u0111\u1EA1t\",\"type\":1,\"trangthaiid\":\"TT16\"},{\"id\":\"7319a110-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A9\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i\",\"type\":3,\"trangthaiid\":\"TT17\"},{\"id\":\"7385f770-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A9\",\"title\":\"Th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i\",\"type\":3,\"trangthaiid\":\"TT18\"}]}]},{\"id\":\"4bdbcfc0-db55-11e8-a551-6f7866e567f9\",\"roleid\":\"R5\",\"title\":\"L\u00E3nh \u0111\u1EA1o v\u1EE5 c\u1EE5c\",\"childrens\":[{\"id\":\"520c21b0-db55-11e8-a551-6f7866e567f9\",\"trangthaiid\":\"TT19\",\"title\":\"H\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh \u0111\u1EA1t ch\u1EDD ph\u00EA duy\u1EC7t\",\"childrens\":[{\"id\":\"7f35c1e0-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A10\",\"title\":\"Ph\u00EA duy\u1EC7t h\u1ED3 s\u01A1\",\"type\":1,\"trangthaiid\":\"TT22\"}]},{\"id\":\"800c24b0-db56-11e8-aca5-33c165fa24fb\",\"trangthaiid\":\"TT20\",\"title\":\"H\u1ED3 s\u01A1 th\u1EA9m \u0111\u1ECBnh t\u1EEB ch\u1ED1i ch\u1EDD ph\u00EA duy\u1EC7t\",\"childrens\":[{\"id\":\"81551f70-db56-11e8-aca5-33c165fa24fb\",\"actionid\":\"A11\",\"title\":\"Ph\u00EA duy\u1EC7t t\u1EEB ch\u1ED1i\",\"type\":3,\"trangthaiid\":\"TT23\"}]}]}]}")
        })
    }
    initActionCfg = (id, title, trangthaiid, type) => {
        return {
            id: uuidv1(),
            actionid: id,
            title: title,
            type: type,
            trangthaiid: trangthaiid
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
                this.initRoleCfg("", "")
            ]
        }
    }
    onRoleChange = (event) => {
        var target = event.target;
        var id = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateRole(id, value, this.initTrangThaiCfg("", ""));
    }

    onTrangThaiChange = (event) => {
        var target = event.target;
        var listid = target.name.split('|');
        var rolekey = listid[1];
        var ttkey = listid[0];
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateTrangThai(rolekey, value, ttkey, this.initActionCfg("", "", "", ""));
    }
    onActionChange = (event) => {
        var target = event.target;
        var listid = target.name.split('|');
        var rolekey = listid[1];
        var ttkey = listid[0];
        var actionkey = listid[2];
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateAction(rolekey, value, ttkey, actionkey);
    }
    onTrangThaiSauChange = (event) => {
        var target = event.target;
        var listid = target.name.split('|');
        var rolekey = listid[1];
        var ttkey = listid[0];
        var actionkey = listid[2];
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.updateTrangThaiSau(rolekey, value, ttkey, actionkey);
    }
    onHandleChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        var thutuc = getThuTucById(value);
        let config = this.initThuTucCfg(value, thutuc.TenThuTuc);
        var resulft = JSON.stringify(config);
        this.setState({
            config: config,
            khoitao: true,
            resulft: resulft
        });
    }
    onRoleAdd = () => {
        var config = this.state.config;
        var role = this.initRoleCfg("", "");
        config.childrens.push(role);
        this.setState({
            config: config,
        });
    }
    onAddTrangThai = (roleid) => {
        var config = this.state.config;
        var trangthai = this.initTrangThaiCfg("", "");
        config.childrens.forEach(item => {
            if (item.id == roleid) {
                item.childrens.push(trangthai);
            }
        })
        this.setState({
            config: config,
        });
    }
    onAddAction = (roleid, ttid) => {
        var config = this.state.config;
        var action = this.initActionCfg("", "", "", "");
        config.childrens.forEach(item => {
            if (item.id == roleid) {
                item.childrens.forEach(itemT => {
                    if (itemT.id == ttid) {
                        itemT.childrens.push(action);
                    }
                })
            }
        })
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
                var role = getRoleById(roleid);
                item.title = role.RoleName;
            }
        });
        this.setState({
            config: config,
        });
        this.getData();
    }
    updateTrangThai = (id, trangthaiid, keytrangthai, childs) => {
        var config = this.state.config;
        config.childrens.forEach((item, index) => {
            if (item.id == id) {
                item.childrens.forEach((itemT, index) => {
                    if (itemT.id === keytrangthai) {
                        itemT.trangthaiid = trangthaiid;
                        itemT.childrens = [childs];
                        var tt = getTrangThaiById(trangthaiid);
                        itemT.title = tt.Title;
                    }
                })
            }
        });
        this.setState({
            config: config,
        });
        this.getData();
    }

    updateAction = (id, actionid, keytrangthai, keyaction) => {
        var config = this.state.config;
        config.childrens.forEach((item, index) => {
            if (item.id == id) {
                item.childrens.forEach((itemT, index) => {
                    if (itemT.id == keytrangthai) {
                        itemT.childrens.forEach(itemA => {
                            if (itemA.id == keyaction) {
                                itemA.actionid = actionid;
                                var act = getActionById(actionid);
                                itemA.title = act.Title;
                                itemA.type = act.Type;
                            }
                        })

                    }
                })
            }
        });
        this.setState({
            config: config,
        });
        this.getData();
    }

    updateTrangThaiSau = (id, trangthaiid, keytrangthai, keyaction) => {
        var config = this.state.config;
        config.childrens.forEach((item, index) => {
            if (item.id == id) {
                item.childrens.forEach((itemT, index) => {
                    if (itemT.id == keytrangthai) {
                        itemT.childrens.forEach(itemA => {
                            if (itemA.id == keyaction) {
                                itemA.trangthaiid = trangthaiid;

                            }
                        })

                    }
                })
            }
        });
        this.setState({
            config: config,
        });
        this.getData();
    }

    getData = () => {
        var resulft = JSON.stringify(this.state.config);
        window.config = this.state.config;
        localStorage.setItem('config', resulft);
        this.setState({
            resulft: resulft
        });
    }
    initData = () => {
        let config = JSON.parse(localStorage.getItem('config'));
        console.log(config);
        this.setState({
            config: config,
            khoitao: true
        });

    }
    render() {
        var self = this;
        let classChart = 'col-sm-12';
        if (this.state.chart) {
            classChart += ' tree';
        } else {
            classChart += ' slidemenu';
        }
        return (
            <MainLayout {...this.props} className={'listuser listapp'}>
                <Ribon breadCrumb={[{ name: 'Cấu hình quy trình động' }]} />

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-header-text">Cấu hình quy trình động</h5>
                                <div className="f-right">
                                    <button className="btn btn-inverse-success waves-effect waves-light" onClick={this.initConfig}>
                                        <i className="icofont icofont-code-alt"></i> Khởi tạo dữ liệu
                                    </button>
                                    <button className="btn btn-inverse-success waves-effect waves-light" onClick={this.getData}>
                                        <i className="icofont icofont-code-alt"></i> Lưu dữ liệu localStorage
                                    </button>
                                    <button className="btn btn-inverse-success waves-effect waves-light" onClick={this.initData}>
                                        <i className="icofont icofont-code-alt"></i> Lấy dữ liệu từ localStorage
                                    </button>
                                </div>
                            </div>
                            <div className="card-block">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <label><b>Thực hiện cấu hình:</b></label>
                                        <button className="btn btn-inverse-success waves-effect waves-light" onClick={() => { this.setChart(true) }}>
                                            <img src={chart1} className="tree-style" alt="logo" />
                                        </button>
                                        <button className="btn btn-inverse-success waves-effect waves-light" onClick={() => this.setChart(false)}>
                                            <img src={chart2} className="tree-style" alt="logo" />
                                        </button>
                                        <br />
                                    </div>
                                    <div className={classChart}>
                                        <ul>
                                            <li>
                                                <div className="node">
                                                    <button className="btn btn-success waves-effect waves-light close-node"><i className=" icofont icofont-ui-settings"></i></button>
                                                    <select
                                                        className="form-control"
                                                        onChange={this.onHandleChange}
                                                        name="thutucs"
                                                        value={this.state.config.thutucid}
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
                                                                                <button className="btn btn-danger waves-effect waves-light close-node"><i className=" icofont icofont-close"></i></button>
                                                                                <select
                                                                                    className="form-control"
                                                                                    onChange={this.onRoleChange}
                                                                                    name={chilrole.id}
                                                                                    value={chilrole.roleid}
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
                                                                                _.isArray(chilrole.childrens) && chilrole.childrens.length > 0 ?
                                                                                    <ul className="childs">
                                                                                        {
                                                                                            chilrole.childrens.map((childtrangthai, index) => {
                                                                                                return (
                                                                                                    <li key={index}>
                                                                                                        <div className="node">
                                                                                                            <button className="btn btn-danger waves-effect waves-light close-node"><i className=" icofont icofont-close"></i></button>
                                                                                                            <select
                                                                                                                className="form-control"
                                                                                                                onChange={this.onTrangThaiChange}
                                                                                                                name={childtrangthai.id + '|' + chilrole.id}
                                                                                                                value={childtrangthai.trangthaiid}
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
                                                                                                            _.isArray(childtrangthai.childrens) && childtrangthai.childrens.length > 0 ?
                                                                                                                <ul>
                                                                                                                    {
                                                                                                                        childtrangthai.childrens.map((childaction, index) => {
                                                                                                                            return (
                                                                                                                                <li key={index}>
                                                                                                                                    <div className="node">
                                                                                                                                        <button className="btn btn-danger waves-effect waves-light close-node"><i className=" icofont icofont-close"></i></button>
                                                                                                                                        <select
                                                                                                                                            className="form-control"
                                                                                                                                            onChange={this.onActionChange}
                                                                                                                                            name={childtrangthai.id + '|' + chilrole.id + '|' + childaction.id}
                                                                                                                                            value={childaction.actionid}
                                                                                                                                        >
                                                                                                                                            <option value="">Chọn tác vụ</option>
                                                                                                                                            {
                                                                                                                                                actions.map((action, index) => {
                                                                                                                                                    return <option key={index} value={action.ActionId}>{action.Title}</option>
                                                                                                                                                })
                                                                                                                                            }
                                                                                                                                        </select>
                                                                                                                                        <select
                                                                                                                                            className="form-control"
                                                                                                                                            onChange={this.onTrangThaiSauChange}
                                                                                                                                            name={childtrangthai.id + '|' + chilrole.id + '|' + childaction.id}
                                                                                                                                            value={childaction.trangthaiid}
                                                                                                                                        >
                                                                                                                                            <option value="">Chọn trạng thái kết thúc</option>
                                                                                                                                            {
                                                                                                                                                trangthais.map((trangthai, index) => {
                                                                                                                                                    return <option key={index} value={trangthai.TrangThaiId}>{trangthai.Title}</option>
                                                                                                                                                })
                                                                                                                                            }
                                                                                                                                        </select>
                                                                                                                                    </div>
                                                                                                                                </li>
                                                                                                                            )
                                                                                                                        })
                                                                                                                    }
                                                                                                                    <li className="last">
                                                                                                                        <div className="node"><button className="btn btn-sm btn-primary waves-effect waves-light" onClick={() => { self.onAddAction(chilrole.id, childtrangthai.id) }}><i className="icofont icofont-plus"></i></button>
                                                                                                                        </div>
                                                                                                                    </li>
                                                                                                                </ul>
                                                                                                                :
                                                                                                                <span className="require-mess">(required)</span>
                                                                                                        }
                                                                                                    </li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                        <li className="last">
                                                                                            <div className="node"><button className='btn btn-sm btn-primary waves-effect waves-light ' name={chilrole.id} onClick={() => { self.onAddTrangThai(chilrole.id) }}><i className="icofont icofont-plus"></i></button>
                                                                                            </div>
                                                                                        </li>
                                                                                    </ul>
                                                                                    : <span className="require-mess">(required)</span>
                                                                            }
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                            <li className="last">
                                                                <div className="node"><button className="btn btn-sm btn-primary waves-effect waves-light" onClick={this.onRoleAdd}><i className="icofont icofont-plus"></i></button>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                        : null
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <label><b>Kết quả cấu hình:</b></label>
                                    </div>
                                    <div className="col-md-12">
                                        <textarea className="form-control" rows="10" value={this.state.resulft} readOnly></textarea>
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
