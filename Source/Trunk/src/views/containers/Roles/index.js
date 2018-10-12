import React from 'react'
import _ from "lodash";
import moment from "moment";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import FilterManager from '../../components/Filters/FilterManager'
import Filters from './Filters'
import DataTable from '../../components/DataTable'
import Pagination from '../../components/Pagination'
import Ribon from '../../components/Ribon'
import Tooltip from '../../components/Tooltip'
import Metadata from '../../components/Metadata'
import {FilterUtils} from "../../utils/filterUtils";
import {validateRequired, validateRole, validateCode} from "../../utils/validate";
import {eclipseString, filterToQueryString, getCurrentModule} from "../../utils/stringUtils";

//các service để call api
import roleService from '../../services/role.service';
import clientService from "../../services/client.service";
import userService from "../../services/user.service";

const md5 = require("blueimp-md5");
const column = [
    'name',
    'totalUsers',
    'createdAt',
    'createdBy',
    'description',
    'enable',
    ''
];

let clientId = '';

export default class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentItem: {},
            loadFail: false,
            loadFailMsg: '',
            isLoading: true,
            pageSize: 20, // initial page size
            modalCreate: false,
            modalDetail: false,
            dataDetail: {
                metadata: {}
            },
            validateError: {},
            filter: {}
        }
    }

    componentDidMount () {
        window.addEventListener("popstate", this.onPopstate.bind(this));
        clientId = this.props.match && this.props.match.params ? this.props.match.params.clientId : '';
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
     * Load từ QueryString (dành cho lần load đầu tiên)
     */
    loadFromQueryString = () => {
        let qIndex = window.location.search.indexOf('?');
        let queryString = '';
        if (qIndex >= 0) {
            queryString = window.location.search.substr(qIndex);
        }
        let filter = FilterUtils.buildFilterFromQueryString({}, queryString, {
            limit: this.state.pageSize,
        });

        if (!filter.order) {
            filter.order = 'createdAt ASC';
        }

        this.setState({isLoading: true, filter: filter}, ()=> {
            this.loadClientById();
            this.loadData(filter);
        });
    };

    /**
     * On popstate
     */
    onPopstate() {
        this.setState({isLoading: true}, ()=> {
            this.loadFromQueryString();
        });
    };

    /**
     * lấy dánh sách dữ liệu
     * @param filter
     */
    loadData = (filter) => {
        const queryString = filterToQueryString(filter);
        this.setState({loadFail: false});
        roleService.getRoleByClient(clientId, queryString, (error, res) => {
            if (!error) {
                this.setState({
                    ...res,
                    isLoading: false
                })
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
     * lấy ra client theo id
     */
    loadClientById = () => {
        clientService.getClientById(clientId, (error, res) => {
            if (!error) {
                this.setState({
                    clientData: res,
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
     * tạo mới
     */
    createData = () => {
        if (this.validateForm()) {
            return;
        }
        let {dataDetail, filter, editing} = this.state;

        this.setState({editing: true}, () => {
            if (!editing) {
                roleService.createRoleByClient(clientId, dataDetail, (error, res) => {
                    if (!error) {
                        // tạo thành công thì tắt modal và load lại dữ liệu
                        this.setState({
                            editing: false,
                            modalCreate: false,
                            dataDetail: {
                                metadata: {}
                            },
                            validateError: {}
                        }, () => {
                            this.loadData(filter);
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
        });
    };

    /**
     * xóa bản ghi
     */
    deleteData = (data) => {

        let {filter, editing} = this.state;
        this.setState({editing: true}, () => {
            if (!editing) {
                roleService.deleteRole(clientId, data.code, (error, res) => {
                    if (!error) {
                        // xóa thành công thì tắt modal và load lại dữ liệu
                        this.setState({
                            editing: false,
                            modalDelete: false,
                        }, () => {
                            toast.success('Xóa nhóm quyền thành công');
                            this.loadData(filter);
                        });
                    } else {
                        this.setState({
                            editing: false
                        }, () => {
                            toast.error(error.message);
                        })
                    }
                });
            }
        });
    };

    /**
     * activate/deactivate
     * @param data
     */
    toggleActiveData = (data) => {
        let {filter} = this.state;

        if(data.enable) {
            roleService.deactivate(clientId, data.code, (error, res) => {
                if (!error) {
                    //load lại data
                    this.loadData(filter)
                } else {
                    toast.error('Có lỗi xảy ra, vui lòng liên hệ ký thuật viên để được hỗ trợ.')
                }
            });
        } else {
            roleService.activate(clientId, data.code, (error, res) => {
                if (!error) {
                    //load lại data
                    this.loadData(filter)
                } else {
                    toast.error('Có lỗi xảy ra, vui lòng liên hệ ký thuật viên để được hỗ trợ.')
                }
            });
        }
    };

    /**
     * Handle event người dùng chuyển trang
     * @param page
     */
    onPageChanged = (page) => {
        let filter = this.state.filter;
        filter.limit = this.state.pageSize;
        filter.skip = page.selected * filter.limit;
        this.setState({filter: filter, isLoading: true, currentItem: null}, () => {
            let queryString = FilterUtils.buildQueryString(filter, {});
            this.props.history.push(getCurrentModule() + queryString);
            this.loadData(filter);
        });
    };

    /**
     * Handle khi filter thay đổi (bao gồm điều kiện lọc, phân trang, sắp xếp)
     * @param newFilter
     */
    onFilterChanged = (newFilter) => {
        if (!_.isEqual(this.state.filter, newFilter)) {
            //only update if there is different
            this.setState({filter: newFilter, isLoading: true}, () => {
                let queryString = FilterUtils.buildQueryString(newFilter, {});
                this.props.history.push(getCurrentModule() + queryString);
                this.loadData(this.state.filter);
            });
        }
    };

    /**
     * clear filter
     */
    clearFilter = () => {
        this.onFilterChanged(FilterManager.clearFilter(this.state.filter));
    };

    /**
     * Handle sự kiện người dùng ấn vào sort trên datatable
     * @param e
     * @param order
     */
    onSort = (e, order) => {
        let filter = _.cloneDeep(this.state.filter);
        if (filter.order !== order) {
            filter.order = order;
            this.onFilterChanged(filter);
        }
    };

    /**
     * thay đổi giá trị của data trong state
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

        this.setState({dataDetail})
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

        //validate code
        if (validateRequired(dataDetail.code)) {
            validateError.code = validateRequired(dataDetail.code);
            this.setState({
                validateError
            });
            validate = true
        } else if (validateCode(dataDetail.code)) {
            validateError.code = validateCode(dataDetail.code);
            this.setState({
                validateError
            });
            validate = true
        } else {
            validateError.code = '';
            this.setState({
                validateError
            })
        }

        return validate
    };

    /**
     * render modal create
     * @returns {*}
     */
    renderModalCreate = () => {
        const {validateError, dataDetail} = this.state;
        return (
            <Modal
                isOpen={this.state.modalCreate}
                toggle={() => this.setState({modalCreate: !this.state.modalCreate})}
                aria-labelledby="contained-modal-title-lg"
            >
                <ModalHeader toggle={() => this.setState({modalCreate: !this.state.modalCreate})}>Tạo mới Nhóm quyền</ModalHeader>
                <ModalBody>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Tên nhóm quyền</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Tên nhóm quyền"
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
                                <label>Code <span className={'text-muted'}>(Snake Case)</span></label>
                                <input
                                    name="code"
                                    type="text"
                                    className="form-control"
                                    placeholder="Code"
                                    required
                                    value={dataDetail.code || ''}
                                    onChange={(e) => this.inputOnChange(e, 'code')}
                                />
                                {
                                    validateError.code && <div className="note note-error color-red">{validateError.code}</div>
                                }
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <a onClick={() => this.createData()} className="_btnSave cursor-pointer modal-btn btn--green mgr15">
                        <i className={`fa ${this.state.editing ? 'fa-spin fal fa-spinner-third' : 'fa-check'}`} aria-hidden="true" /> Tạo mới
                    </a>

                    <a onClick={() => this.setState({modalCreate: !this.state.modalCreate})} className="_btnCancel cursor-pointer modal-btn btn--blue">
                        <i className="fa fa-times" aria-hidden="true" /> Hủy
                    </a>
                </ModalFooter>
            </Modal>
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

                    <p className={'text-center'}>Bạn muốn xóa {this.state.currentItem.name}?</p>

                </ModalBody>
                <ModalFooter>
                    <a onClick={() => this.deleteData(this.state.currentItem)} className="_btnSave cursor-pointer modal-btn btn--error mgr15">
                        <i className={`fa ${this.state.editing ? 'fa-spin fal fa-spinner-third' : 'fa-check'}`} aria-hidden="true" /> Xóa
                    </a>

                    <a onClick={() => this.setState({modalDelete: !this.state.modalDelete})} className="_btnCancel cursor-pointer modal-btn btn--blue">
                        <i className="fa fa-times" aria-hidden="true" /> Hủy
                    </a>
                </ModalFooter>
            </Modal>
        )
    };

    /**
     * render row của table
     * @param item
     * @param index
     * @returns {*}
     */
    renderRow = (item, index) => {
        // const avatar = 'https://www.gravatar.com/avatar/' + md5(item.email) + '?d=identicon';
        return (
            <tr key={index} className={'_tableRow'}>
                <td className={'_tableCellName'}><Link to={`/clients/${clientId}/roles/${item.code}`} className={'cursor-pointer'}>{item.name}</Link></td>
                <td className={'_tableCellTotalUsers text-center'}>
                    <span className="txt-color-blue2">
                        {item.totalUsers}
                    </span>
                </td>
                <td className={'_tableCellCreatedAt'}>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                <td className={'_tableCellCreatedBy'}>{item.createdBy}</td>
                <td className={'_tableCellDescription'}>{eclipseString(item.description, 40)}</td>
                <td className={'_tableCellEnable'}>
                    {
                        item.enable
                            ?
                            <span className="active" />
                            :
                            <span className="active active-none" />
                    }
                </td>
                <td className={'_tableCellFunc td-ic position-re'}>
                    <ul className="dpl-none">
                        <li className="flr mgl15">
                            <Tooltip
                                linkClassName={'_roleDisableFunc'}
                                onClick={() => this.toggleActiveData(item)}
                                icon={<span className="cursor-pointer txt-color-black"><i className={item.enable ? `far fa-lock-alt` : 'far fa-lock-open-alt'} /></span>}
                                id={`roleDisableFunc${index}`}
                            >
                                <span>{item.enable ? 'Khóa' : 'Mở'}</span>
                            </Tooltip>
                        </li>
                        <li className="flr mgl15">
                            <Tooltip
                                linkClassName={'_roleDetailFunc'}
                                link={`/clients/${clientId}/roles/${item.code}`}
                                icon={<span className="cursor-pointer txt-color-black"><i className="far fa-edit" /></span>}
                                id={`roleDetailFunc${index}`}
                            >
                                <span>Chỉnh sửa</span>
                            </Tooltip>
                        </li>
                        <li className="flr mgl15">
                            <Tooltip
                                linkClassName={'_roleDeleteFunc'}
                                onClick={() => this.setState({
                                    currentItem: item,
                                    modalDelete: !this.state.modalDelete
                                })}
                                icon={<span className="cursor-pointer txt-color-black"><i className="far fa-trash-alt" /></span>}
                                id={`roleDeleteFunc${index}`}
                            >
                                <span>Xóa</span>
                            </Tooltip>
                        </li>
                    </ul>

                </td>
            </tr>
        )
    };

    renderContent = () => {
        return (
            <div className="listnhomquyen__content">
                <div className="container-fluid">
                    <div className="bd1px bd-color-gray pdt15 pdbt15 bd-rdu4">
                        {
                            this.state.metadata && this.state.clientData &&
                            <Filters
                                onFilterChanged={this.onFilterChanged}
                                clearFilter={this.clearFilter}
                                filter={this.state.filter}
                                count={this.state.total}
                                pageCount={this.state.metadata.pageCount}
                                currentPage={this.state.metadata.currentPage}
                                onPageChanged={this.onPageChanged}
                                clientData={this.state.clientData}
                            />
                        }

                        <DataTable
                            ref={(ref) => {
                                this.dataTable = ref;
                            }}
                            data={this.state.data}
                            visibleColumns={column}
                            columnHeaders={{
                                name: 'Tên nhóm',
                                totalUsers: 'Thành viên',
                                createdAt: 'Ngày tạo',
                                createdBy: 'Người tạo',
                                description: 'Mô tả',
                                enable: 'Hoạt động'
                            }}
                            sortable={['name', 'createdBy', 'createdAt']}
                            sorting={this.state.filter.order || 'createdAt ASC'}
                            onSort={this.onSort}
                            emptyData={'Không có bản ghi nào được tìm thấy'}
                            renderCustomRow={this.renderRow.bind(this)}
                            showCheckbox={false}
                            showSetting={false}
                        />

                        {
                            this.state.metadata && this.state.metadata.pageCount > 1
                                ?
                                <Pagination
                                    currentPage={this.state.metadata.currentPage}
                                    pageSize={this.state.metadata.pageSize}
                                    pageCount={this.state.metadata.pageCount}
                                    total={this.state.total}
                                    onPageChange={this.onPageChanged}
                                />
                                :
                                null
                        }

                    </div>
                </div>
            </div>
        )
    };

    render() {
        return(
            <MainLayout {...this.props} className={'listuser listapp'}>
                <Ribon
                    breadCrumb={[
                        {name: 'Danh sách ứng dụng', link: '/clients'},
                        {name: 'Danh sách nhóm quyền'}
                    ]}
                />

                <div className="container-fluid mgbt30">
                    <div className="row">
                        <div className="col-xl-3 col-md-6 col-12">
                            <h2 className="listapp__title roboto-bold txt-color-black2 txt-size-h2">
                                DANH SÁCH NHÓM QUYỀN
                            </h2>
                        </div>
                        <div className="col-xl-9 col-md-6 col-12">
                            <div className="wp-btn flr">
                                <a onClick={() => this.setState({
                                    modalCreate: !this.state.modalCreate,
                                    dataDetail: {
                                        metadata: {}
                                    },
                                    validateError: {}
                                })} className="_btnCreate btn btn--blue">Thêm mới</a>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (this.state.isLoading && !this.state.data) || this.state.loadFail
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
                {this.renderModalCreate()}
                {this.renderModalDelete()}
            </MainLayout>
        );
    }
}
