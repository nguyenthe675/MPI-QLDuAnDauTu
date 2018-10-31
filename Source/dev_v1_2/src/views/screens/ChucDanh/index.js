import React from 'react';

import MainLayout from "../../components/Layout/MainLayout";
import Ribon from '../../components/UI/Ribon';
import ListChucDanh from '../../components/ChucDanh/List';
import EditChucDanh from '../../components/ChucDanh/Edit';


export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keysearch: '',

        };
    }

    componentDidMount() {

    }

    /**
     * Khi unmount ra thì bỏ sự kiện popstate
     */
    componentWillUnmount() {

    }
    handleOnChange = (e) => {
        let keysearch = this.state.keysearch;
        keysearch = e.target.value;
        this.setState({ keysearch });
    };
    search = () => {
        console.log(this.state.keysearch);
    }
    render() {
        return (
            <MainLayout {...this.props} className={'listuser listapp'}>
                <Ribon breadCrumb={[{ name: 'Danh sách chức danh' }]} />
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-header-text">Danh mục chức danh</h5>
                            </div>
                            <div className="card-block">
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label form-control-label">
                                        Từ khóa
                                    </label>
                                    <div className="col-sm-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Từ khóa"
                                            name='keysearch'
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-10">
                                        <button
                                            className="btn btn-primary waves-effect waves-light"
                                            type="text"
                                            value="Artisanal kale"
                                            onClick={this.search}
                                        >
                                            <i className="icofont icofont-search-alt-1 "></i> Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                                <hr />
                                <div id="advanced-table_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                    <div className="dt-buttons">
                                        <button className="dt-button buttons-copy buttons-html5" aria-controls="advanced-table" onClick={() => { this.edit.handleClickOpen(); }} >
                                            <span>
                                                <i className="icofont icofont-plus"></i>
                                                Thêm mới
                                            </span>
                                        </button>

                                    </div>
                                    <EditChucDanh ref={instance => { this.edit = instance; }} />
                                    <div className="row">

                                        <a className="dt-button buttons-csv buttons-html5" aria-controls="advanced-table" href="/"><span><i className="icofont icofont-share-alt"></i> Import</span></a>
                                        <a className="dt-button buttons-excel buttons-html5" aria-controls="advanced-table" href="/"><span><i className="icofont icofont-file-excel"></i> Excel</span></a>
                                        <div className="col-md-12 table-responsive">
                                            <ListChucDanh ref={instance => { this.list = instance; }}></ListChucDanh>
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
