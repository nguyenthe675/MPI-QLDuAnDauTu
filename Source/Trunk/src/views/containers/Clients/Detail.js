import React from 'react'
import _ from "lodash";
import moment from "moment";
import {history} from "../../helpers";
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Link} from 'react-router-dom'
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import Ribon from '../../components/Ribon'
import Metadata from '../../components/Metadata'
import ArrayInput from '../../components/ArrayInput'
import Scope from '../../components/TreeView/Scope'
import GrantTypes from '../../components/ArrayInput/GrantTypes'
import CopyList from '../../components/CopyList'

import {validateFullName, validateRequired} from "../../utils/validate";

//các service để call api
import clientService from '../../services/client.service';

const md5 = require("blueimp-md5");

export default class ClientDetail extends React.Component {
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
        let id = this.props.match.params.id;
        this.loadData(id);
    };

    /**
     * lấy dữ liệu
     * @param id
     */
    loadData = (id) => {
        this.setState({loadFail: false});
        clientService.getClientById(id, (error, res) => {
            if (!error) {
                this.setState({
                    dataDetail: res,
                    originData: _.cloneDeep(res),
                    isLoading: false
                });
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
     * lưu lại data
     */
    saveData = (showToast) => {
        let {dataDetail} = this.state;
        if (this.validateForm()) {
            return;
        }

        this.setState({editing: true});

        if (dataDetail.id) {
            clientService.updateClientById(dataDetail.id, dataDetail, (error, res) => {
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
        }
    };

    /**
     * xóa data
     */
    deleteData = () => {
        let {dataDetail} = this.state;
        if (dataDetail.id) {
            clientService.deleteClientById(dataDetail.id, (error, res) => {
                if (!error) {
                    // xóa thành công quay lại trang list
                    toast.success('Xóa thành công.');
                    history.replace('/clients');
                } else {
                    toast.error('Xóa bản ghi không thành công.');
                }
            });
        }
    };

    generateSecret = () => {
        let {dataDetail} = this.state;
        if (dataDetail.id) {
            clientService.generateSecret(dataDetail.id, (error, res) => {
                if (!error) {
                    this.setState({
                        dataDetail: res,
                        originData: _.cloneDeep(res),
                    })
                } else {
                    this.setState({
                        loadFail: true,
                        loadFailMsg: error.message,
                    })
                }
            });
        }
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

    /**
     * thay đổi giá trị của metadata user trong state
     * @param arrayData
     * @param field
     */
    arrayDataOnSave = (arrayData, field) => {
        //chuyển array obj về array value
        let newArray = [];
        arrayData.map(item => newArray.push(item.value));

        let dataDetail = this.state.dataDetail;
        dataDetail[field] = newArray;

        this.setState({dataDetail}, () => {
            this.saveData()
        })
    };

    /**
     * thay đổi giá trị của GrantType trong state
     * @param grantTypes
     */
    arrayGrantTypeOnSave = (grantTypes) => {
        let dataDetail = this.state.dataDetail;
        dataDetail.grantTypes = grantTypes;

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
        } else if (validateFullName(dataDetail.name)) {
            validateError.name = validateFullName(dataDetail.name);
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

    tabChange = (id) => {
        this.setState({
            currentTab: id
        })
    };

    renderTabs = () => {
        const {currentTab, dataDetail} = this.state;
        if (!dataDetail.id) return null;
        return (
            <div className="tabsdetail" key={'tabs'}>
                <div className="container-fluid">
                    <ul className="tabsdetail__top mgbt30">
                        <li className={`fll ${currentTab === 'tabOne' ? 'active' : ''}`}>
                            <a onClick={() => this.tabChange('tabOne')} className={'_tabOne cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Metadata</a>
                        </li>
                        <li className={`fll ${currentTab === 'tabTwo' ? 'active' : ''}`}>
                            {/*<a onClick={() => this.tabChange('tabTwo')} className={'_tabTwo cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Scopes</a>*/}
                            <a className={'_tabTwo cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Scopes</a>
                        </li>
                        <li className={`fll ${currentTab === 'tabThree' ? 'active' : ''}`}>
                            <a onClick={() => this.tabChange('tabThree')} className={'_tabThree cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Grant Types</a>
                        </li>
                        <li className={`fll ${currentTab === 'tabFour' ? 'active' : ''}`}>
                            <a onClick={() => this.tabChange('tabFour')} className={'_tabFour cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>URIs Redirect</a>
                        </li>
                        <li className={`fll ${currentTab === 'tabFive' ? 'active' : ''}`}>
                            {/*<a onClick={() => this.tabChange('tabFive')} className={'_tabFive cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Endpoints</a>*/}
                            <a className={'_tabFive cursor-pointer txt-size-h3 roboto-regular txt-color-black2 dpl-block'}>Endpoints</a>
                        </li>
                    </ul>

                    <div className="tab-content">

                        <div className={`tab-pane ${currentTab === 'tabOne' ? 'active' : 'display-none'}`}>
                            <Metadata
                                metadata={dataDetail.metadata}
                                onSave={this.metadataOnSave}
                            />
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabTwo' ? 'active' : 'display-none'}`}>
                            <Scope />
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabThree' ? 'active' : 'display-none'}`}>
                            <GrantTypes
                                onSave={this.arrayGrantTypeOnSave}
                                orginData={dataDetail.grantTypes}
                            />
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabFour' ? 'active' : 'display-none'}`}>
                            <ArrayInput
                                arrayData={dataDetail.redirectUris}
                                placeholder={'Nhập đường dẫn'}
                                onSave={this.arrayDataOnSave}
                                field={'redirectUris'}
                            />
                        </div>

                        <div className={`tab-pane ${currentTab === 'tabFive' ? 'active' : 'display-none'}`}>
                            <CopyList />
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    renderContent = () => {
        const {dataDetail, originData} = this.state;
        if (!dataDetail.id) return null;
        return (
            [
                <div className="appinfo mgt30 mgbt50" key='appinfo'>
                    <div className="container-fluid">
                        {this.renderAppInfoTop()}
                        {this.renderAppInfoBottom()}
                        {
                            originData.accessTokenValidity !== dataDetail.accessTokenValidity
                            || originData.refreshTokenValidity !== dataDetail.refreshTokenValidity
                            || originData.description !== dataDetail.description
                                ?
                                this.renderAppInfoBtn()
                                :
                                null
                        }
                    </div>
                </div>,
                this.renderTabs()
            ]
        )
    };

    /**
     * render app info
     * @returns {*}
     */
    renderAppInfoTop = () => {
        const {dataDetail} = this.state;
        const avatar = 'https://www.gravatar.com/avatar/' + md5(dataDetail.name) + '?d=identicon';
        return (
            <div className="appinfo__top mgbt25">
                <div className="row">
                    <div className="col-xl-5 col-lg-5 col-md-12">
                        <ul className="appinfo__top_left">
                            <li className="fll appinfo__top_left--avt mgr30">
                                <img src={avatar} className="width100" />
                            </li>
                            <li className="fll">
                                <h2 className="_clientName txt-size-24 roboto-regular txt-color-blue2 mgbt10 dpl-block">
                                    {dataDetail.name}
                                </h2>
                                <ul className="mgbt15">
                                    <li className="fll">
                                        <label className="roboto-regular txt-size-h3 txt-color-black3 dpl-il-block">
                                            Thành viên:
                                        </label>
                                    </li>
                                    <li className="fll">
                                      <span className="_members txt-size-h4 txt-color-black2 roboto-bold">
                                          {dataDetail.totalUsers || '0'}
                                      </span>
                                    </li>
                                </ul>
                                <ul>
                                    <li className="fll">
                                        <label className="roboto-regular txt-size-h3 txt-color-black3 dpl-il-block">
                                            Người tạo:
                                        </label>
                                    </li>
                                    <li className="fll mgr5">
                                      <span className="_adminName btn--blue txt-size-h4 txt-color-white roboto-regular bd-rdu">
                                          {dataDetail.createdBy}
                                      </span>
                                    </li>
                                    {/*<li className="fll">*/}
                                      {/*<span className="_changeAdmin btn--white txt-size-h4 txt-color-blue2 roboto-regular bd-rdu">*/}
                                        {/*Đổi*/}
                                      {/*</span>*/}
                                    {/*</li>*/}
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div className="col-xl-7 col-lg-7 col-md-12">
                        <div className="position-re pdt35">
                            <ul className="mgbt15 ">
                                <li className="fll">
                                    <label className="roboto-regular txt-size-h3 txt-color-black3 dpl-il-block">
                                        ID:
                                    </label>
                                </li>
                                <li className="fll">
                                    <span className="_id txt-size-h4 txt-color-black2 roboto-regular">
                                      {dataDetail.id}
                                    </span>
                                </li>
                            </ul>
                            <ul className="mgbt15">
                                <li className="fll">
                                    <label className="roboto-regular txt-size-h3 txt-color-black3 dpl-il-block">
                                        ID Secret:
                                    </label>
                                </li>
                                <li className="fll mgr10">
                                    <span className="_secret txt-size-h4 txt-color-black2 roboto-regular">
                                      {dataDetail.secret}
                                    </span>
                                </li>
                                <li className="fll mgr10">
                                    <div className="wp-tooltip position-re cursor-pointer">
                                        <span className="txt-color-yellow2 txt-size-20">
                                            <i className="fas fa-info-circle" />
                                        </span>
                                        <div className="tooltip position-ab boxshadow15 bg-color-white pd15 bd-rdu4 zindex99 dpl-none">
                                            <p className="txt-color-yellow2 txt-size-h4 line-height167 roboto-light">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                                industry. Lorem Ipsum has been the industry's standard dummy text ever
                                                since the 1500s.
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li className="fll">
                                    <span onClick={this.generateSecret} className="_takeSecretKey btn--white txt-size-h4 txt-color-blue2 roboto-regular bd-rdu">
                                        Cấp lại mã bí mật
                                    </span>
                                </li>
                            </ul>
                            <div className="appinfo__top_btn position-ab">
                                <ul>
                                    <li className="fll mgr10">
                                        <a onClick={() => this.setState({modalDelete: !this.state.modalDelete})} className="_delete cursor-pointer btn btn--red">
                                            <span>
                                              <i className="far fa-trash-alt" />
                                            </span> Xoá ứng dụng
                                        </a>
                                    </li>
                                    <li className="fll mgr10">
                                        <Link to={`/clients/${dataDetail.id}/roles`} className="_listRole btn btn--green">
                                            Nhóm quyền
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    renderAppInfoBottom = () => {
        const {dataDetail} = this.state;
        if (!dataDetail.id) return null;
        return (
            <div className="appinfo__bottom bg-color-gray">
                <div className="row">
                    <div className="col-xl-4 col-md-6 col-lg-4">
                        <ul>
                            <li className="overflow-hidden mgbt10">
                                <label className="fll roboto-regular txt-size-h4 txt-color-black3 ">
                                    Accesstoken Validity:
                                </label>
                                <span className="fll wp-ip">
                                    <input
                                        className={'_accessTokenValidity'}
                                        type="text"
                                        name="accessTokenValidity"
                                        value={dataDetail.accessTokenValidity || dataDetail.accessTokenValidity === 0 ? dataDetail.accessTokenValidity : ''}
                                        onChange={(e) => {
                                            if (/^\d+$/.test(e.target.value) || !e.target.value) this.inputOnChange(e, 'accessTokenValidity')
                                        }}
                                    />
                                </span>
                            </li>
                            <li className="overflow-hidden">
                                <label className="fll roboto-regular txt-size-h4 txt-color-black3 ">
                                    Refresh Token Validity:
                                </label>
                                <span className="fll wp-ip">
                                    <input
                                        className={'_refreshTokenValidity'}
                                        type="text"
                                        name="refreshTokenValidity"
                                        value={dataDetail.refreshTokenValidity || dataDetail.refreshTokenValidity === 0 ? dataDetail.refreshTokenValidity : ''}
                                        onChange={(e) => {
                                            if (/^\d+$/.test(e.target.value) || !e.target.value) this.inputOnChange(e, 'refreshTokenValidity')
                                        }}
                                    />
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xl-8 col-md-6 col-lg-8">
                        <div className="appinfo__bottom_des">
                            <label className="fll roboto-regular txt-size-h4 txt-color-black3 ">
                                Description:
                            </label>
                            <span className="fll">
                              <textarea
                                  className={'_description'}
                                  value={dataDetail.description}
                                  onChange={(e) => this.inputOnChange(e, 'description')}
                              />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    renderAppInfoBtn = () => {
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

    renderModalDelete = () => {
        return (
            <Modal
                isOpen={this.state.modalDelete}
                toggle={() => this.setState({modalDelete: !this.state.modalDelete})}
                aria-labelledby="contained-modal-title-lg"
            >
                <ModalHeader toggle={() => this.setState({modalDelete: !this.state.modalDelete})}>Xóa ứng dụng</ModalHeader>
                <ModalBody>

                    <p className={'text-center'}>Bạn muốn xóa Ứng dụng?</p>

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
        console.log(this.state);
        return(
            <MainLayout {...this.props} className={'detaillistapp'}>

                <Ribon breadCrumb={[
                    {name: 'Danh sách ứng dụng', link: '/clients'},
                    {name: 'Quản lý ứng dụng'},
                ]}/>

                <div className="container-fluid mgbt30">
                    <div className="row">
                        <div className="col-xl-12">
                            <h2 className="listapp__title roboto-bold txt-color-black2 txt-size-h2">
                                QUẢN LÝ ỨNG DỤNG
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
