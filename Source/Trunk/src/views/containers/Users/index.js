import React from 'react'
import _ from "lodash";
import moment from "moment";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import FilterManager from '../../components/Filters/FilterManager'
import DataTable from '../../components/DataTable'
import Pagination from '../../components/Pagination'
import Ribon from '../../components/Ribon'
import Tooltip from '../../components/Tooltip'
import Filters from './Filters'
import { FilterUtils } from "../../utils/filterUtils";
import { filterToQueryString, getCurrentModule } from "../../utils/stringUtils";

//các service để call api


const md5 = require("blueimp-md5");
const column = [
    'username',
    'fullname',
    'email',
    'createdAt',
    'createdBy',
    'enable',
    ''
];

export default class Users extends React.Component {
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

    componentDidMount() {
        window.addEventListener("popstate", this.onPopstate.bind(this));

        this.setState({ isLoading: true }, () => {
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

        this.setState({ isLoading: true, filter: filter }, () => {
            this.loadData(filter);
        });
    };

    /**
     * On popstate
     */
    onPopstate() {
        this.setState({ isLoading: true }, () => {
            this.loadFromQueryString();
        });
    };

    /**
     * lấy dánh sách dữ liệu
     * @param filter
     */
    loadData = (filter) => {
        const queryString = filterToQueryString(filter);
        this.setState({ loadFail: false });

    };

    /**
     * tạo mới
     */
    createData = () => {

        let { dataDetail, filter, editing } = this.state;
        this.setState({ editing: true }, () => {
            if (!editing) {

            }
        });
    };

    /**
     * xóa bản ghi
     */
    deleteData = (data) => {

        let { filter, editing } = this.state;
        this.setState({ editing: true }, () => {
            if (!editing) {

            }
        });
    };

    /**
     * activate/deactivate user
     * @param user
     */
    toggleActiveUser = (user) => {
        let { filter } = this.state;

        if (user.enable) {

        } else {

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
        this.setState({ filter: filter, isLoading: true, currentItem: null }, () => {
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
            this.setState({ filter: newFilter, isLoading: true }, () => {
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
        this.setState({ dataDetail })
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
        if (Array.isArray(metadata)) {
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

        this.setState({ dataDetail })
    };


    /**
     * render modal create
     * @returns {*}
     */
    renderModalCreate = () => {
        const { validateError, dataDetail } = this.state;
        return (
            <Modal
                isOpen={this.state.modalCreate}
                toggle={() => this.setState({ modalCreate: !this.state.modalCreate })}
                aria-labelledby="contained-modal-title-lg"
            >
                <ModalHeader toggle={() => this.setState({ modalCreate: !this.state.modalCreate })}>Thêm người dùng</ModalHeader>
                <ModalBody>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="username">Tên tài khoản</label>
                                <input
                                    name="username"
                                    type="text"
                                    className="form-control"
                                    placeholder="User Name"
                                    required
                                    value={dataDetail.username || ''}
                                    onChange={(e) => this.inputOnChange(e, 'username')}
                                />
                                {
                                    validateError.username && <div className="note note-error color-red">{validateError.username}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="username">Họ tên</label>
                                <input
                                    name="fullname"
                                    type="text"
                                    className="form-control"
                                    placeholder="Full Name"
                                    required
                                    value={dataDetail.fullname || ''}
                                    onChange={(e) => this.inputOnChange(e, 'fullname')}
                                />
                                {
                                    validateError.fullname && <div className="note note-error color-red">{validateError.fullname}</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    required
                                    value={dataDetail.password || ''}
                                    onChange={(e) => this.inputOnChange(e, 'password')}
                                />
                                {
                                    validateError.password && <div className="note note-error color-red">{validateError.password}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="nickname">Nickname</label>
                                <input
                                    name="nickname"
                                    type="text"
                                    className="form-control"
                                    placeholder="Nickname"
                                    required
                                    value={dataDetail.nickname || ''}
                                    onChange={(e) => this.inputOnChange(e, 'nickname')}
                                />
                                {
                                    validateError.nickname && <div className="note note-error color-red">{validateError.nickname}</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    required
                                    value={dataDetail.confirmPassword || ''}
                                    onChange={(e) => this.inputOnChange(e, 'confirmPassword')}
                                />
                                {
                                    validateError.confirmPassword && <div className="note note-error color-red">{validateError.confirmPassword}</div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    required
                                    value={dataDetail.email || ''}
                                    onChange={(e) => this.inputOnChange(e, 'email')}
                                />
                                {
                                    validateError.email && <div className="note note-error color-red">{validateError.email}</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                    placeholder="Phone"
                                    required
                                    value={dataDetail.phone || ''}
                                    onChange={(e) => this.inputOnChange(e, 'phone')}
                                />
                                {
                                    validateError.phone && <div className="note note-error color-red">{validateError.phone}</div>
                                }
                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <a onClick={() => this.createData()} className="_btnSave cursor-pointer modal-btn btn--green mgr15">
                        <i className={`fa ${this.state.editing ? 'fa-spin fal fa-spinner-third' : 'fa-check'}`} aria-hidden="true" /> Tạo mới
                    </a>

                    <a onClick={() => this.setState({ modalCreate: !this.state.modalCreate })} className="_btnCancel cursor-pointer modal-btn btn--blue">
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
                toggle={() => this.setState({ modalDelete: !this.state.modalDelete })}
                aria-labelledby="contained-modal-title-lg"
            >
                <ModalHeader toggle={() => this.setState({ modalDelete: !this.state.modalDelete })}>Xóa người dùng</ModalHeader>
                <ModalBody>

                    <p className={'text-center'}>Bạn muốn xóa {this.state.currentItem.fullname}?</p>

                </ModalBody>
                <ModalFooter>
                    <a onClick={() => this.deleteData(this.state.currentItem)} className="_btnSave cursor-pointer modal-btn btn--error mgr15">
                        <i className={`fa ${this.state.editing ? 'fa-spin fal fa-spinner-third' : 'fa-check'}`} aria-hidden="true" /> Xóa
                    </a>

                    <a onClick={() => this.setState({ modalDelete: !this.state.modalDelete })} className="_btnCancel cursor-pointer modal-btn btn--blue">
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
        const avatar = 'https://www.gravatar.com/avatar/' + md5(item.email) + '?d=identicon';
        return (
            <tr key={index} className={'_tableRow '}>
                <td className={'_tableCellUsername'}>
                    <Link to={`/users/${item.id}`}>
                        <img src={avatar} className={'fll bd-rdu50 mgr15'} />
                        <span className="fll dpl-block txt-color-black">
                            {item.username}
                        </span>
                    </Link>
                </td>
                <td className={'_tableCellFullname'}>
                    <Link to={`/users/${item.id}`}>
                        <span className="txt-color-blue2">{item.fullname}</span>
                    </Link>
                </td>
                <td className={'_tableCellEmail'}>{item.email}</td>
                <td className={'_tableCellCreatedAt'}>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                <td className={'_tableCellCreatedBy'}>{item.createdBy}</td>
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
                                linkClassName={'_userDisableFunc'}
                                onClick={() => this.toggleActiveUser(item)}
                                icon={<span className="cursor-pointer txt-color-black"><i className={item.enable ? `far fa-lock-alt` : 'far fa-lock-open-alt'} /></span>}
                                id={`userDisableFunc${index}`}
                            >
                                <span>{item.enable ? 'Khóa' : 'Mở'}</span>
                            </Tooltip>
                        </li>
                        <li className="flr mgl15">
                            <Tooltip
                                linkClassName={'_userDetailFunc'}
                                link={`/users/${item.id}`}
                                icon={<span className="cursor-pointer txt-color-black"><i className="far fa-edit" /></span>}
                                id={`userDetailFunc${index}`}
                            >
                                <span>Chỉnh sửa</span>
                            </Tooltip>
                        </li>
                        <li className="flr mgl15">
                            <Tooltip
                                linkClassName={'_userDeleteFunc'}
                                onClick={() => this.setState({
                                    currentItem: item,
                                    modalDelete: true
                                })}
                                icon={<span className="cursor-pointer txt-color-black"><i className="far fa-trash-alt" /></span>}
                                id={`userDeleteFunc${index}`}
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
            <div className="listuser__content">
                <div className="container-fluid">
                    <div className="bd1px bd-color-gray pdt15 pdbt15 bd-rdu4">
                        {
                            this.state.metadata &&
                            <Filters
                                onFilterChanged={this.onFilterChanged}
                                clearFilter={this.clearFilter}
                                filter={this.state.filter}
                                count={this.state.total}
                                pageCount={this.state.metadata.pageCount}
                                currentPage={this.state.metadata.currentPage}
                                onPageChanged={this.onPageChanged}
                            />
                        }

                        <DataTable
                            ref={(ref) => {
                                this.dataTable = ref;
                            }}
                            data={this.state.data}
                            visibleColumns={column}
                            columnHeaders={{
                                username: 'Tên đăng nhập',
                                fullname: 'Họ tên',
                                email: 'Email',
                                createdAt: 'Ngày tạo',
                                createdBy: 'Người tạo',
                                enable: 'Hoạt động'
                            }}
                            sortable={['username', 'fullname', 'createdAt']}
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
        return (
            <MainLayout {...this.props} className={'listuser listapp'}>
                <Ribon breadCrumb={[{ name: 'Danh sách người dùng' }]} />

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-header-text">Danh mục quốc gia</h5>
                            </div>
                            <div className="card-block">
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label form-control-label">
                                        Tên quốc gia
                                    </label>
                                    <div className="col-sm-10">
                                        <input className="form-control" type="text" placeholder="Từ khóa" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-10">
                                        <button className="btn btn-primary waves-effect waves-light" type="text" value="Artisanal kale">
                                            <i className="icofont icofont-search-alt-1 "></i> Tìm kiếm
                                            </button>
                                    </div>
                                </div>
                                <hr />
                                <div id="advanced-table_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="dt-buttons">
                                        <a className="dt-button buttons-copy buttons-html5" aria-controls="advanced-table" href="#">
                                            <span>
                                                <i className="icofont icofont-plus"></i>
                                                Thêm mới
                                            </span>
                                        </a>

                                    </div>
                                    <div className="row">

                                        <a className="dt-button buttons-csv buttons-html5" aria-controls="advanced-table" href="#"><span><i className="icofont icofont-share-alt"></i> Import</span></a>
                                        <a className="dt-button buttons-excel buttons-html5" aria-controls="advanced-table" href="#"><span><i className="icofont icofont-file-excel"></i> Excel</span></a>
                                        <div className="col-md-12 table-responsive">
                                            <table id="advanced-table" className="table dt-responsive table-striped table-bordered nowrap dataTable dtr-inline" role="grid" aria-describedby="advanced-table_info">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="sorting_asc" aria-controls="advanced-table" rowSpan="1" colSpan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending">STT</th>
                                                        <th className="sorting" aria-controls="advanced-table" rowSpan="1" colSpan="1" aria-label="Position: activate to sort column ascending">Mã
                                                            quốc gia</th>
                                                        <th className="sorting" aria-controls="advanced-table" rowSpan="1" colSpan="1" aria-label="Office: activate to sort column ascending">Tên
                                                            quốc gia</th>
                                                        <th className="sorting" aria-controls="advanced-table" rowSpan="1" colSpan="1" aria-label="Age: activate to sort column ascending"></th>

                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">1</td>
                                                        <td>ARU</td>
                                                        <td>Aruba</td>
                                                        <td>
                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">2</td>
                                                        <td>ADO</td>
                                                        <td>An-đô-ra</td>
                                                        <td>

                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">3</td>
                                                        <td>ARA</td>
                                                        <td>Các tiểu VQ ả rập</td>
                                                        <td>
                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">4</td>
                                                        <td>ARU</td>
                                                        <td>Aruba</td>
                                                        <td>
                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">5</td>
                                                        <td>ARU</td>
                                                        <td>Aruba</td>
                                                        <td>
                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr role="row" className="odd">
                                                        <td className="sorting_1">6</td>
                                                        <td>ARU</td>
                                                        <td>Aruba</td>
                                                        <td>
                                                            <div className="tabledit-toolbar btn-toolbar" >
                                                                <div className="btn-group btn-group-sm" ><button type="button" className="tabledit-edit-button btn btn-primary waves-effect waves-light" ><span className="icofont icofont-ui-edit"></span></button><button type="button" className="tabledit-delete-button btn btn-danger waves-effect waves-light" ><span className="icofont icofont-ui-delete"></span></button></div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="dataTables_info" id="advanced-table_info" role="status" aria-live="polite">
                                                Showing 1 to 10 of 57 entries
                                                    </div>
                                            <div className="dataTables_paginate paging_simple_numbers" id="advanced-table_paginate">
                                                <ul className="pagination">
                                                    <li className="paginate_button page-item previous disabled" id="advanced-table_previous"><a href="#" aria-controls="advanced-table" data-dt-idx="0" className="page-link">Previous</a></li>
                                                    <li className="paginate_button page-item active"><a href="#" aria-controls="advanced-table" data-dt-idx="1" className="page-link">1</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="advanced-table" data-dt-idx="2" className="page-link">2</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="advanced-table" data-dt-idx="3" className="page-link">3</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="advanced-table" data-dt-idx="4" className="page-link">4</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="advanced-table" data-dt-idx="5" className="page-link">5</a></li>
                                                    <li className="paginate_button page-item "><a href="#" aria-controls="advanced-table" data-dt-idx="6" className="page-link">6</a></li>
                                                    <li className="paginate_button page-item next" id="advanced-table_next"><a href="#" aria-controls="advanced-table" data-dt-idx="7" className="page-link">Next</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }
}
