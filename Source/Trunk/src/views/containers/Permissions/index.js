import React from 'react'
import _ from "lodash";
import moment from "moment";
import {Modal} from "react-bootstrap";
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
import {filterToQueryString, getCurrentModule} from "../../utils/stringUtils";

//các service để call api
import permissionService from '../../services/permission.service';

const md5 = require("blueimp-md5");
const column = [
    'client',
    'name',
    'code',
    'createdAt',
    'createdBy',
    'enable',
    ''
];

let clientId = '';

export default class Permissions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        permissionService.getPermissionsByClient(clientId, queryString, (error, res) => {
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
     * tạo mới
     */
    createData = () => {
        if (this.validateForm()) {
            return;
        }
        let {dataDetail, filter, editing} = this.state;

            this.setState({editing: true}, () => {
                if (!editing) {
                    permissionService.createPermissionByClient(clientId, dataDetail, (error, res) => {
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
     * modal create toggle
     */
    modalCreateToggle = () => {
        this.setState({modalCreate: !this.state.modalCreate})
    };

    /**
     * render modal create
     * @returns {*}
     */
    renderModalCreate = () => {
        const {validateError, dataDetail} = this.state;
        return (
            <Modal
                show={this.state.modalCreate}
                onHide={this.modalCreateToggle}
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Tạo mới Permission</Modal.Title>
                </Modal.Header>
                <Modal.Body>

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

                    <Metadata
                        metadata={dataDetail.metadata}
                        onSave={this.metadataOnSave}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-success" onClick={() => this.createData()}>
                        <i className={`fa ${this.state.editing ? 'fa-spin fa-circle-o-notch' : 'fa-check'}`} aria-hidden="true" /> Tạo mới
                    </button>
                    <button type="button" className="btn btn-default" onClick={() => this.modalCreateToggle()}>
                        <i className="fa fa-times" aria-hidden="true" /> Hủy
                    </button>
                </Modal.Footer>
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
                <td className={'_tableCellClient'}>{item.client.name}</td>
                <td className={'_tableCellName'}>{item.name}</td>
                <td className={'_tableCellCode'}>{item.code}</td>
                <td className={'_tableCellCreatedAt'}>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                <td className={'_tableCellCreatedBy'}>{item.createdBy}</td>
                <td className={'_tableCellEnable'}><span className={`label ${item.enable ? 'label-success' : 'label-default'}`}>{item.enable ? 'Kích hoạt' : 'Vô hiệu'}</span></td>
                <td className={'_tableCellFunc'}>
                    <div className="btn-group display-inline pull-right text-align-left hidden-tablet">
                        <Tooltip
                            link={`/clients/${clientId}/permissions/${item.code}`}
                            icon={<i className="fa fa-eye fa-lg margin-right-5" />}
                            id={`detailFunc${index}`}
                        >
                            <span>Chi tiết</span>
                        </Tooltip>

                        <Tooltip
                            onClick={() => console.log('deleted')}
                            icon={<i className="fa fa-times fa-lg" />}
                            id={`deleteFunc${index}`}
                        >
                            <span>Xóa</span>
                        </Tooltip>
                    </div>
                </td>
            </tr>
        )
    };

    render() {
        return(
            <MainLayout {...this.props}>
                <Ribon
                    breadCrumb={[
                        {name: 'Clients', link: '/clients'},
                        {name: 'Permissions'}
                    ]}
                />

                <div id="content">
                    <div className="row margin-bottom-10">
                        <div className={'col-sm-9'}>
                            {
                                this.state.metadata &&
                                <Filters
                                    onFilterChanged={this.onFilterChanged}
                                    clearFilter={this.clearFilter}
                                    filter={this.state.filter}
                                    count={this.state.total}
                                    pageCount={this.state.metadata.page_count}
                                    currentPage={this.state.metadata.current_page}
                                    onPageChanged={this.onPageChanged}
                                />
                            }

                        </div>
                        <div className="col-sm-3">
                            <a className="btn btn-primary cursor-pointer pull-right" onClick={() => this.modalCreateToggle()}>
                                <i className="fa fa-plus"/> Tạo mới
                            </a>
                        </div>
                    </div>

                    <section id="widget-grid" className="">
                        <div className="row">
                            <article className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                {
                                    (this.state.isLoading && !this.state.data) || this.state.loadFail
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
                                        <DataTable
                                            ref={(ref) => {
                                                this.dataTable = ref;
                                            }}
                                            className={'table table-striped table-bordered table-hover'}
                                            data={this.state.data}
                                            visibleColumns={column}
                                            columnHeaders={{
                                                client: 'Client',
                                                name: 'Permission',
                                                code: 'Code',
                                                createdAt: 'Ngày tạo',
                                                createdBy: 'Người tạo',
                                                enable: 'Kích hoạt'
                                            }}
                                            sortable={['name', 'createdBy', 'createdAt']}
                                            sorting={this.state.filter.order || 'createdAt ASC'}
                                            onSort={this.onSort}
                                            emptyData={'Không có bản ghi nào được tìm thấy'}
                                            renderCustomRow={this.renderRow.bind(this)}
                                            showCheckbox={false}
                                            showSetting={false}
                                        />
                                }

                                {
                                    this.state.metadata && this.state.metadata.page_count > 1
                                        ?
                                        <Pagination
                                            currentPage={this.state.metadata.current_page}
                                            pageSize={this.state.metadata.page_size}
                                            pageCount={this.state.metadata.page_count}
                                            total={this.state.total}
                                            onPageChange={this.onPageChanged}
                                        />
                                        :
                                        null
                                }

                            </article>
                        </div>
                    </section>

                    {this.renderModalCreate()}
                </div>
            </MainLayout>
        );
    }
}
