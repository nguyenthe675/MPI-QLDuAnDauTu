import React from 'react'
import _ from "lodash";
import moment from "moment";
import { toast } from 'react-toastify';
import MainLayout from "../../components/Layout/MainLayout";
import Spiner from "../../components/Spiner";
import Ribon from '../../components/Ribon'
import CollapseClientList from '../../components/Collapse/CollapseClientList'
import Metadata from '../../components/Metadata';

//các service để call api
const md5 = require("blueimp-md5");

export default class UserDetail extends React.Component {
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
     * On popstate
     */
    onPopstate() {
        this.setState({ isLoading: true }, () => {
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
        this.setState({ loadFail: false });

    };

    /**
     * lưu lại data
     */
    saveData = () => {
        let { dataDetail } = this.state;


        this.setState({ editing: true });

        if (dataDetail.id) {

        }
    };

    /**
     * lấy danh sách clients theo username
     * @param username
     */
    getClients = (username) => {
        this.setState({ loadFail: false });

    };

    /**
     * lấy dữ liệu collapse data khi collapse toggle
     * @param clientId
     */
    getRolesUser = (clientId) => {
        const { dataDetail } = this.state;
        this.setState({ loadFail: false });

    };

    getRolesClient = (clientId) => {
        const { dataDetail } = this.state;
        this.setState({ loadFail: false });
        // clientService.get(dataDetail.username, clientId, (error, res) => {
        //     if (!error) {
        //         this.setState({
        //             rolesUserData: res,
        //         })
        //     } else {
        //         this.setState({
        //             loadFail: true,
        //             loadFailMsg: error.message,
        //         })
        //     }
        // });
    };

    /**
     * thay đổi giá trị của user trong state
     * @param e
     * @param key
     */
    userInputOnChange = (e, key) => {
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

        this.setState({ dataDetail }, () => {
            this.saveData()
        })
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
        const { originData } = this.state;
        return (
            <div className="appinfo__top_btn overflow-hidden">
                <ul className="flr mgt20">
                    <li className="fll mgr10">
                        <a onClick={() => this.setState({ dataDetail: _.cloneDeep(originData) })} className="_btnCancelData btn cursor-pointer btn--red">
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
            clientsData,
            permissionsData,
            rolePermissionsData
        } = this.state;

        console.log('clientsData', clientsData);

        if (!dataDetail.id) return null;
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
                                Metadata
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content">

                        <div className={`tab-pane ${currentTab === 'tabOne' ? 'active' : 'display-none'}`}>

                            {
                                Array.isArray(clientsData) && clientsData.length > 0
                                    ?
                                    clientsData.map((item, index) => <CollapseClientList
                                        loadData={this.getRolesUser}
                                        key={index}
                                        data={item}
                                    />)
                                    :
                                    <p className={'text-center'}>Chưa thuộc ứng dụng nào</p>
                            }


                        </div>

                        <div className={`tab-pane ${currentTab === 'tabTwo' ? 'active' : 'display-none'}`}>
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
        const { validateError, dataDetail, originData, clientsData, originClientsData } = this.state;
        const avatar = 'https://www.gravatar.com/avatar/' + md5(dataDetail.email) + '?d=identicon';
        return (
            <div className="usermanager detaillistapp ">
                <div className="container-fluid">
                    <div className="usermanager__top bd1px bd-color-gray bg-color-gray pd15 bd-rdu4">
                        <div className="row">
                            <div className="col-lg-5 col-md-6">
                                <ul>
                                    <li className="usermanager__top_avt fll mgr30">
                                        <img src={avatar} className="img-w-80" />
                                    </li>
                                    <li className="fll">
                                        <ul>
                                            <li className="mgbt15">
                                                <h3 className="roboto-regular txt-size-h2 txt-color-black2">
                                                    {dataDetail.fullname}
                                                </h3>
                                            </li>
                                            <li className="overflow-hidden mgbt15">
                                                <label className="fll roboto-regular txt-size-h3 txt-color-black3 label100">
                                                    Nickname:
                                                </label>
                                                <span className="fll txt-size-h3 txt-color-black2 roboto-regular">
                                                    {dataDetail.nickname}
                                                </span>
                                            </li>
                                            <li className="overflow-hidden">
                                                <label className="fll roboto-regular txt-size-h3 txt-color-black3 label100">
                                                    Email:
                                                </label>
                                                <span className="fll txt-size-h3 txt-color-black2 roboto-regular">
                                                    {dataDetail.email}
                                                </span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ul className="mgt35">
                                    <li className="mgbt15">
                                        <label className="fll roboto-regular txt-size-h3 txt-color-black3 label150">
                                            Tên đăng nhập:
                                        </label>
                                        <span className="txt-size-h3 txt-color-black2 roboto-regular bg-color-yellow2 bd-rdu4 pd5 dpl-il-block mgt-5">
                                            {dataDetail.username}
                                        </span>
                                    </li>
                                    <li className="overflow-hidden mgbt15">
                                        <label className="fll roboto-regular txt-size-h3 txt-color-black3 label150">
                                            Trạng thái:
                                        </label>
                                        <span className="txt-size-h3 txt-color-black2 roboto-regular">
                                            <i className={`fas fa-circle ${dataDetail.enable ? 'txt-color-green' : ''} txt-size-h5`} /> {dataDetail.enable ? 'Đang hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <ul className="mgt35">
                                    <li className="overflow-hidden mgbt15">
                                        <label className="fll roboto-regular txt-size-h3 txt-color-black3 label100">
                                            Người tạo:
                                        </label>
                                        <span className="fll txt-size-h3 txt-color-black2 roboto-regular">
                                            {dataDetail.createdBy || 'Anonymous'}
                                        </span>
                                    </li>
                                    <li className="overflow-hidden">
                                        <label className="fll roboto-regular txt-size-h3 txt-color-black3 label100">
                                            Ngày tạo:
                                        </label>
                                        <span className="fll txt-size-h3 txt-color-black2 roboto-regular">
                                            {moment(dataDetail.createdAt).format('DD/MM/YYYY')}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {
                        originData.fullname !== dataDetail.fullname
                            || originData.nickname !== dataDetail.nickname
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

    render() {
        console.log(this.state);
        return (
            <MainLayout {...this.props} className={'listapp'}>
                <Ribon breadCrumb={[
                    { name: 'Danh sách người dùng', link: '/users' },
                    { name: 'Quản lý người dùng' },
                ]} />

                <div className="container-fluid mgbt30">
                    <div className="row">
                        <div className="col-12">
                            <h2 className=" roboto-bold txt-color-black2 txt-size-h2 txt-uppercase">
                                Quản lý người dùng
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
                                    <Spiner />
                            }
                        </div>
                        :
                        this.renderContent()
                }
            </MainLayout>
        );
    }
}
