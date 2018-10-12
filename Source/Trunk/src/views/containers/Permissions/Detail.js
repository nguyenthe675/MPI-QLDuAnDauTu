import React from 'react'
import _ from "lodash";
import moment from "moment";
import { toast } from 'react-toastify';
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import Ribon from '../../components/Ribon'
import CollapseClientList from '../../components/Collapse/CollapseClientList'
import Metadata from '../../components/Metadata'

import {
    validateUserName,
    validateFullName,
    validateEmail,
    validateRequired,
    validatePhoneNumber,
    validateMinLength,
    validateMaxLength,
    validateRole
} from "../../utils/validate";

//các service để call api
import permissionService from '../../services/permission.service';

let clientId = '';
let paramCode = '';

export default class RoleDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        permissionService.getPermissionByCode(clientId, code, (error, res) => {
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
    saveData = () => {
        let {dataDetail} = this.state;
        if (this.validateForm()) {
            return;
        }

        this.setState({editing: true});

        permissionService.updatePermissionByClient(clientId, dataDetail.code, dataDetail, (error, res) => {
            if (!error) {
                // lưu thành công load lại dữ liệu
                this.setState({
                    editing: false,
                    dataDetail: res,
                    originData: _.cloneDeep(res),
                    validateError: {}
                }, () => {
                    toast.success('Thay đổi thành công!!!');
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

    /**
     * render content
     * @returns {*}
     */
    renderContent = () => {
        const {validateError, dataDetail, originData} = this.state;
        return (
            <div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Permission</label>
                            <input
                                name="name"
                                type="text"
                                className="form-control"
                                placeholder="Permission"
                                required
                                value={dataDetail.name || ''}
                                onChange={(e) => this.inputOnChange(e, 'name')}
                            />
                            {
                                validateError.name && <div className="note note-error color-red">{validateError.name}</div>
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Code</label>
                            <input
                                name="code"
                                type="text"
                                className="form-control"
                                placeholder="Code"
                                required
                                disabled={true}
                                value={dataDetail.code || ''}
                            />
                        </div>
                    </div>
                </div>

                <div className={'row'}>
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                required
                                value={dataDetail.description || ''}
                                onChange={(e) => this.inputOnChange(e, 'description')}
                                rows={5}
                            />
                        </div>
                    </div>
                </div>

                <Metadata
                    metadata={dataDetail.metadata}
                    onSave={this.metadataOnSave}
                />

                {
                    JSON.stringify(originData) !== JSON.stringify(dataDetail)
                        ?
                        [
                            <button key={'submit'} type="button" className="btn btn-success" onClick={() => this.saveData()}>
                                <i className={`fa ${this.state.editing ? 'fa-spin fa-circle-o-notch' : 'fa-check'}`} aria-hidden="true" /> Lưu
                            </button>,
                            <button key={'cancel'} type="button" className="btn btn-default margin-left-10" onClick={() => this.setState({dataDetail: _.cloneDeep(originData)})}>
                                <i className="fa fa-times" aria-hidden="true" /> Hủy
                            </button>
                        ]
                        :
                        null
                }


            </div>
        )
    };

    render() {
        console.log('role detail', this.state);
        return(
            <MainLayout {...this.props}>
                <Ribon breadCrumb={[
                    {name: 'Clients', link: '/clients'},
                    {name: 'Permissions', link: `/clients/${clientId}/permissions`},
                    {name: 'Chi tiết'},
                ]}/>

                <div id="content">

                    <section id="widget-grid" className="">
                        <div className="row">
                            <article className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                {
                                    (this.state.isLoading && !this.state.dataDetail.id) || this.state.loadFail
                                        ?
                                        <div className={'text-center'}>
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

                            </article>
                        </div>
                    </section>
                </div>
            </MainLayout>
        );
    }
}
