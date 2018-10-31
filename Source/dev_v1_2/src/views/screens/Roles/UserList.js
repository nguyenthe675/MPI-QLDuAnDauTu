import React from 'react'
import _ from "lodash";
import moment from "moment";
import { toast } from 'react-toastify';
import Spiner from "../../components/Spiner";
import FilterManager from '../../components/Filters/FilterManager'
import DataTable from '../../components/DataTable'
import Pagination from '../../components/Pagination'
import Tooltip from '../../components/Tooltip'
import Filters from '../Users/Filters'
import {FilterUtils} from "../../utils/filterUtils";
import {filterToQueryString} from "../../utils/stringUtils";

//các service để call api
import roleService from '../../services/role.service';
import userService from '../../services/user.service';

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

let clientId = '';
let paramCode = '';

export default class Users extends React.Component {
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
        paramCode = this.props.match && this.props.match.params ? this.props.match.params.code : '';

        this.setState({isLoading: true, }, ()=> {
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
        roleService.getUsersByRole(clientId, paramCode, queryString, (error, res) => {
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
     * activate/deactivate user
     * @param user
     */
    toggleActiveUser = (user) => {
        let {filter} = this.state;

        if(user.enable) {
            userService.deactivateUser(user.id, (error, res) => {
                if (!error) {
                    //load lại data
                    this.loadData(filter)
                } else {
                    toast.error('Có lỗi xảy ra, vui lòng liên hệ ký thuật viên để được hỗ trợ.')
                }
            });
        } else {
            userService.activateUser(user.id, (error, res) => {
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
            // this.props.history.push(getCurrentModule() + queryString);
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
                // this.props.history.push(getCurrentModule() + queryString);
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
                    <img src={avatar} className={'fll bd-rdu50 mgr15'}/>
                    <span className="fll dpl-block">
                        {item.username}
                    </span>
                </td>
                <td className={'_tableCellFullname'}>
                    <span className="txt-color-blue2">{item.fullname}</span>
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
                                onClick={() => console.log('deleted')}
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
            <div className="bd1px bd-color-gray pdt15 bd-rdu4">
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
        )
    };

    render() {
        return(
            <div className="tabsdetail__user">

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

            </div>
        );
    }
}
