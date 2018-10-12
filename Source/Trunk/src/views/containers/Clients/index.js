import React from 'react'
import _ from "lodash";
import {Link} from 'react-router-dom'
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import FilterManager from '../../components/Filters/FilterManager'
import Ribon from '../../components/Ribon'
import Tooltip from '../../components/Tooltip'
import {FilterUtils} from "../../utils/filterUtils";
import {filterToQueryString, getCurrentModule} from "../../utils/stringUtils";

//các service để call api
import clientService from '../../services/client.service';

const md5 = require("blueimp-md5");
const column = [
    'icon',
    'name',
    'description',
    ''
];

export default class Clients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadFail: false,
            loadFailMsg: '',
            isLoading: true,
            pageSize: 20, // initial page size
            modalCreate: false,
            modalDetail: false,
            dataDetail: {},
            validateError: {},
            filter: {}
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
        clientService.getAllClients(queryString, (error, res) => {
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
     * render row của table
     * @param item
     * @param index
     * @returns {*}
     */
    renderRow = (item, index) => {
        return (
            <tr key={index} className={'_tableRow'}>
                <td className={'_tableCellIcon'}><img src={item.icon} className={'avatar'}/></td>
                <td className={'_tableCellName'}>{item.name}</td>
                <td className={'_tableCellDescription'}>{item.description}</td>
                <td className={'_tableCellFunc'}>
                    <div className="btn-group display-inline pull-right text-align-left hidden-tablet">
                        <Tooltip
                            link={`/clients/${item.id}/permissions`}
                            icon={<i className="fa fa-user fa-lg margin-right-5" />}
                            id={`listPermissionsFunc${index}`}
                        >
                            <span>Danh sách Permissions</span>
                        </Tooltip>

                        <Tooltip
                            link={`/clients/${item.id}/roles`}
                            icon={<i className="fa fa-users fa-lg margin-right-5" />}
                            id={`listRolesFunc${index}`}
                        >
                            <span>Danh sách Roles</span>
                        </Tooltip>

                        <Tooltip
                            link={`/clients/${item.id}`}
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

    renderItem = (item, index) => {
        const avatar = 'https://www.gravatar.com/avatar/' + md5(item.name) + '?d=identicon';
        return (
            <div className="_item listapp__box border-bootom-1x bd-color-gray pd15" key={index}>
                <ul className="dpl-flex">
                    <li className="mgr15">
                    <span className="listapp__box_icon dpl-block">
                      <img src={avatar} />
                    </span>
                    </li>
                    <li className="width100">
                        <h2 className="overflow-hidden mgbt5">
                            <Link to={`/clients/${item.id}`} className="_itemName fll roboto-regular txt-size-h2 txt-color-blue2">
                                {item.name}
                            </Link>
                            <span className="_itemId flr txt-size-h4 roboto-regular txt-color-gray">ID: {item.id}</span>
                        </h2>
                        <div className="position-re">
                            <p className="_itemDescription txt-size-h4 line-height167 roboto-regular txt-color-black2 width80">
                                {item.description}
                            </p>
                            <Link to={`/clients/${item.id}/roles`} className="_itemRoles btn btn--green position-ab">
                                Nhóm quyền
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        )
    };

    renderContent = () => {
        if (!Array.isArray(this.state.data)) return null;
        return (
            <div className="container-fluid">
                <div className="listapp bd1px bd-color-gray bd-rdu">
                    {
                        this.state.data.map((item, index) => this.renderItem(item, index))
                    }
                </div>
            </div>
        )
    };


    render() {
        return(
            <MainLayout {...this.props} className={'listapp'}>
                <Ribon breadCrumb={[{name: 'Danh sách ứng dụng'}]}/>

                <div className="container-fluid mgbt30">
                    <div className="row">

                        <div className="col-xl-3">
                            <h2 className="listapp__title roboto-bold txt-color-black2 txt-size-h2">
                                DANH SÁCH ỨNG DỤNG
                            </h2>
                        </div>

                        {/*<div className="col-xl-9">*/}
                            {/*<div className="wp-btn flr">*/}
                                {/*<a href="#" className="btn btn--blue">Thêm ứng dụng</a>*/}
                            {/*</div>*/}
                        {/*</div>*/}

                    </div>
                </div>

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
                        this.renderContent()
                }

            </MainLayout>
        );
    }
}
