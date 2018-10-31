import React from 'react'
import _ from "lodash";
import moment from "moment";
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import Ribon from '../../components/Ribon'
import Metadata from '../../components/Metadata'
import TreeView from '../../components/TreeView'
import {filterToQueryString} from "../../utils/stringUtils";
import UserList from './UserList'

import {
    validateRequired,
    validateRole
} from "../../utils/validate";

//các service để call api
import roleService from '../../services/role.service';
import permissionService from '../../services/permission.service';
import {history} from "../../helpers";
import clientService from "../../services/client.service";

let clientId = '';
let paramCode = '';

export default class RoleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 'tabOne',
            loadFail: false,
            loadFailMsg: '',
            isLoading: true,
            dataDetail: {},
            originData: {},
            validateError: {}
        }
    }

    componentDidMount () {
        window.addEventListener("popstate", this.onPopstate.bind(this));
        clientId = this.props.match && this.props.match.params ? this.props.match.params.clientId : '';
        paramCode = this.props.match && this.props.match.params ? this.props.match.params.code : '';

        this.setState({isLoading: true}, ()=> {
            this.loadFromQueryString();
        });
    }

    /**
     * Khi unmount ra thì bỏ sự kiện popstate
     */
    componentWillUnmount() {
        window.removeEventListener("popstate", this.onPopstate.bind(this));
    }

    /**
     * On popstate
     */
    onPopstate() {
        this.setState({isLoading: true}, ()=> {
            this.loadFromQueryString();
        });
    };

    /**
     * Load từ QueryString (dành cho lần load đầu tiên)
     */
    loadFromQueryString = () => {
        this.loadData(clientId, paramCode);
    };

    /**
     * lấy dữ liệu
     * @param clientId
     * @param code
     */
    loadData = (clientId, code) => {
        this.setState({loadFail: false});
        roleService.getRoleByCode(clientId, code, (error, res) => {
            if (!error) {
                this.setState({
                    dataDetail: res,
                    originData: _.cloneDeep(res),
                    isLoading: false
                });

                //lấy danh sách permissions
                this.getPermissionsByClient(clientId);
                //lấy danh sách permissions của role
                this.getPermissionsByRoleCode(clientId, code)
            } else {
                this.setState({
                    loadFail: true,
                    loadFailMsg: error.message,
                    isLoading: false
                })
            }
        });
    };

    /**
     * lấy permissions theo role code
     * @param clientId
     * @param roleCode
     */
    getPermissionsByRoleCode = (clientId, roleCode) => {
        this.setState({loadFail: false});
        roleService.getPermissionsByRoleCode(clientId, roleCode, (error, res) => {
            if (!error) {
                this.setState({
                    rolePermissionsData: res,
                });
            } else {
                this.setState({
                    loadFail: true,
                    loadFailMsg: error.message,
                })
            }
        });
    };

    /**
     * lấy permissions theo role code
     * @param clientId
     */
    getPermissionsByClient = (clientId) => {
        this.setState({loadFail: false});
        const queryString = filterToQueryString({});
        permissionService.getPermissionsByClient(clientId, queryString, (error, res) => {
            if (!error) {
                this.setState({
                    permissionsData: res,
                });
            } else {
                this.setState({
                    loadFail: true,
                    loadFailMsg: error.message,
                })
            }
        });
    };

    /**
     * lưu lại data
     */
    saveData = (showToast) => {
        let {dataDetail} = this.state;
        if (this.validateForm()) {
            return;
        }

        this.setState({editing: true});

        roleService.updateRoleByClient(clientId, dataDetail.code, dataDetail, (error, res) => {
            if (!error) {
                // lưu thành công load lại dữ liệu
                this.setState({
                    editing: false,
                    dataDetail: res,
                    originData: _.cloneDeep(res),
                    validateError: {}
                }, () => {
                    if (showToast) toast.success('Thay đổi thành công.');
                });
            } else {
                this.setState({
                    loadFail: true,
                    loadFailMsg: error.message,
                    editing: false
                })
            }
        });
    };

    /**
     * xóa data
     */
    deleteData = () => {
        let {dataDetail} = this.state;
        if (dataDetail.code) {
            roleService.deleteRole(clientId, dataDetail.code, (error, res) => {
                if (!error) {
                    // xóa thành công quay lại trang list
                    toast.success('Xóa thành công.');
                    history.replace(`/clients/${clientId}/roles`);
                } else {
                    toast.error('Xóa bản ghi không thành công.');
                }
            });
        }
    };

    /**
     * add permissions
     * @param permissionCode
     */
    savePermission = (permissionCode) => {

        roleService.addPermissionsByRoleCode(clientId, paramCode, permissionCode, (error, res) => {
            if (!error) {
                // lưu thành công load lại dữ liệu
                // this.getPermissionsByRoleCode(clientId, paramCode)
                // toast.success('Thay đổi thành công.');
            } else {
                toast.error('Có lỗi xảy ra vui lòng liên hệ kỹ thuật viên để được hỗ trợ');
            }
        })
    };

    /**
     * delete permissions
     * @param permissionCode
     */
    deletePermission = (permissionCode) => {

        roleService.deletePermissionsByRoleCode(clientId, paramCode, permissionCode, (error, res) => {
            if (!error) {
                // lưu thành công load lại dữ liệu
                // this.getPermissionsByRoleCode(clientId, paramCode)
                // toast.success('Thay đổi thành công.');
            } else {
                toast.error('Có lỗi xảy ra vui lòng liên hệ kỹ thuật viên để được hỗ trợ');
            }
        })
    };

    /**
     * thay đổi giá trị của user trong state
     * @param e
     * @param key
     */
    inputOnChange = (e, key) => {
        let dataDetail = this.state.dataDetail;
        dataDetail[key] = e.target.value;
        this.setState({dataDetail})
    };

    /**
     * lưu lại thay đổi giá trị của metadata
     * @param metadata
     */
    metadataOnSave = (metadata) => {
        let checkMetadata = false;
        let dataDetail = this.state.dataDetail;

        // chuyển mảng metadata về obj
        let newMetadata = {};
        if(Array.isArray(metadata)) {
            metadata.map((item) => {
                if (item.error || !item.key) {
                    checkMetadata = true;
                } else {
                    newMetadata[item.key] = item.value
                }
            });
        }
        // nếu mảng metadata còn lỗi thì return
        if (checkMetadata) return;

        dataDetail.metadata = newMetadata;

        this.setState({dataDetail}, () => {
            this.saveData()
        })
    };

    validateForm = () => {
        let {dataDetail, validateError} = this.state;
        let validate = false;

        //validate name
        if (validateRequired(dataDetail.name)) {
            validateError.name = validateRequired(dataDetail.name);
            this.setState({
                validateError
            });
            validate = true
        } else if (validateRole(dataDetail.name)) {
            validateError.name = validateRole(dataDetail.name);
            this.setState({
                validateError
            });
            validate = true
        } else {
            validateError.name = '';
            this.setState({
                validateError
            })
        }

        return validate
    };

    /**
     * chuyển metadata obj sang array
     * @param obj
     */
    convertObjToArray = (obj) => {
        let array = [];
        for (let prop in obj) {
            array.push({
                key: prop,
                value: obj[prop]
            })
        }

        return array;
    };

    renderBtn = () => {
        const {originData} = this.state;
        return (
            <div className="appinfo__top_btn overflow-hidden">
                <ul className="flr mgt20">
                    <li className="fll mgr10">
                        <a onClick={() => this.setState({dataDetail: _.cloneDeep(originData)})} className="_btnCancelData btn cursor-pointer btn--red">
                            Huỷ bỏ
                        </a>
                    </li>
                    <li className="fll mgr10">
                        <a onClick={() => this.saveData()} className="_btnSaveData btn cursor-pointer btn--green">
                            Lưu
                        </a>
                    </li>
                </ul>
            </div>
        )
    };

    tabChange = (id) => {
        this.setState({
            currentTab: id
        })
    };

    renderTabs = () => {
        const {
            currentTab, dataDetail,
            permissionsData,
            rolePermissionsData
        } = this.state;

        if (!dataDetail.code) return null;
        return (
            <div className="tabsdetail mgt50" key={'tabs'}>
                <div className="container-fluid">
                    <ul className="tabsdetail__top mgbt30">
                        <li className={`fll ${currentTab === 'tabOne' ? 'active' : ''}`}>
                            <a
                                onClick={() => this.tabChange('tabOne')}
                                className={'_tabOne cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}
                            >
                                Quyền chức năng
                            </a>
                        </li>
                        <li className={`fll ${currentTab === 'tabTwo' ? 'active' : ''}`}>
                            <a
                                onClick={() => this.tabChange('tabTwo')}
                                className={'_tabTwo cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}
                            >
                                Thành viên
                            </a>
                        </li>
                        <li className={`fll ${currentTab === 'tabThree' ? 'active' : ''}`}>
                            <a
                                onClick={() => this.tabChange('tabThree')}
                                className={'_tabThree cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}
                            >
                                Metadata
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content">

                        <div className={`tab-pane ${currentTab === 'tabOne' ? 'active' : 'display-none'}`}>
                            {
                                permissionsData && rolePermissionsData && Array.isArray(permissionsData.data) && Array.isArray(rolePermissionsData.data)
                                &&
                                <TreeView
                                    data={permissionsData.data}
                                    activeData={rolePermissionsData.data}
                                    valueField={'code'}
                                    labelField={'name'}
                                    onAdd={this.savePermission}
                                    onDelete={this.deletePermission}
                                />
                            }
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabTwo' ? 'active' : 'display-none'}`}>
                            <UserList match={this.props.match}/>
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabThree' ? 'active' : 'display-none'}`}>
                            <Metadata
                                metadata={dataDetail.metadata}
                                onSave={this.metadataOnSave}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    /**
     * render content
     * @returns {*}
     */
    renderContent = () => {
        const {
            validateError, dataDetail, originData,
            permissionsData,
            rolePermissionsData
        } = this.state;
        return (
            <div className="detailnhomquyen detaillistapp">

                <div className="container-fluid">
                    <div className="bd1px bd-color-gray bg-color-gray pd15 bd-rdu4">
                        <div className="detailnhomquyen__top mgbt15">
                            <div className="row position-re">
                                <div className="col-md-6">
                                    <h2 className="roboto-regular txt-color-black2 txt-size-h2 txt-uppercase mgbt20 pdt5">
                                        {dataDetail.name}
                                        {
                                            dataDetail.enable ? <span className="" /> : <span className="active-none" />
                                        }
                                    </h2>
                                </div>
                                <div className="col-md-6">
                                    <div className="appinfo__top_btn flr">
                                        <a onClick={() => this.setState({modalDelete: !this.state.modalDelete})} className="_btnDelete cursor-pointer btn btn--red">
                                            <span>
                                              <i className="far fa-trash-alt" />
                                            </span> Xóa nhóm
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <ul>
                                        <li className="mgbt15 overflow-hidden">
                                            <label className="fll roboto-regular txt-size-h3 txt-color-black3">
                                                Ứng dụng:
                                            </label>
                                            <span className="fll txt-color-blue2 roboto-regular txt-size-h3">
                                                {dataDetail.client.name}
                                            </span>
                                        </li>
                                        <li className="">
                                            <label className="fll roboto-regular txt-size-h3 txt-color-black3">
                                                Thành viên:
                                            </label>
                                            <span className="fll txt-color-black2 roboto-regular txt-size-h3">
                                                {dataDetail.totalUsers}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="col-lg-3 col-md-6">
                                    <ul>
                                        <li className="mgbt15 overflow-hidden">
                                            <label className="fll roboto-regular txt-size-h3 txt-color-black3">
                                                Người tạo:
                                            </label>
                                            <span className="fll txt-color-black2 roboto-regular txt-size-h3">
                                                {dataDetail.createdBy}
                                            </span>
                                        </li>
                                        <li className="">
                                            <label className="fll roboto-regular txt-size-h3 txt-color-black3">
                                                Ngày tạo:
                                            </label>
                                            <span className="fll txt-color-black2 roboto-regular txt-size-h3">
                                                {moment(dataDetail.createdAt).format('DD/MM/YYYY')}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="detailnhomquyen__top_des overflow-hidden">
                                        <label className="fll roboto-regular txt-size-h3 txt-color-black3 mgt5">
                                            Mô tả:
                                        </label>
                                        <span className="fll">
                                            <textarea
                                                value={dataDetail.description || ''}
                                                onChange={(e) => this.inputOnChange(e, 'description')}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        originData.description !== dataDetail.description
                        ?
                        this.renderBtn()
                        :
                        null
                    }

                </div>

                {this.renderTabs()}

            </div>
        )
    };

    renderModalDelete = () => {
        return (
            <Modal
                isOpen={this.state.modalDelete}
                toggle={() => this.setState({modalDelete: !this.state.modalDelete})}
                aria-labelledby="contained-modal-title-lg"
            >
                <ModalHeader toggle={() => this.setState({modalDelete: !this.state.modalDelete})}>Xóa nhóm quyền</ModalHeader>
                <ModalBody>

                    <p className={'text-center'}>Bạn muốn xóa Nhóm Quyền?</p>

                </ModalBody>
                <ModalFooter>
                    <a onClick={() => this.deleteData()} className="_btnSave cursor-pointer modal-btn btn--error mgr15">
                        <i className={`fa ${this.state.editing ? 'fa-spin fal fa-spinner-third' : 'fa-check'}`} aria-hidden="true" /> Xóa
                    </a>

                    <a onClick={() => this.setState({modalDelete: !this.state.modalDelete})} className="_btnCancel cursor-pointer modal-btn btn--blue">
                        <i className="fa fa-times" aria-hidden="true" /> Hủy
                    </a>
                </ModalFooter>
            </Modal>
        )
    };

    render() {
        return(
            <MainLayout {...this.props}>
                <Ribon breadCrumb={[
                    {name: 'Danh sách ứng dụng', link: '/clients'},
                    {name: 'Danh sách nhóm quyền', link: `/clients/${clientId}/roles`},
                    {name: 'Chi tiết nhóm quyền'},
                ]}/>

                <div className="container-fluid mgbt30">
                    <div className="row">
                        <div className="col-12">
                            <h2 className=" roboto-bold txt-color-black2 txt-size-h2 txt-uppercase">
                                Chi tiết nhóm quyền
                            </h2>
                        </div>
                    </div>
                </div>

                {
                    (this.state.isLoading && !this.state.dataDetail.id) || this.state.loadFail
                        ?
                        <div className={'text-center mgt20'}>
                            {
                                this.state.loadFail
                                    ?
                                    this.state.loadFailMsg
                                    :
                                    <Spiner/>
                            }
                        </div>
                        :
                        this.renderContent()
                }
                {this.renderModalDelete()}
            </MainLayout>
        );
    }
}
