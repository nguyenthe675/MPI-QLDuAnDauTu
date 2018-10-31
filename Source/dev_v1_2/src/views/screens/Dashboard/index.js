import React from 'react'
import MainLayout from "../../components/Layout/MainLayout";
import Ribon from '../../components/UI/Ribon';
import DanhSachTaiSan from '../../components/DanhSachTaiSan'

class Dashboard extends React.Component {
    render() {
        return (
            <MainLayout {...this.props}>
                <Ribon breadCrumb={[{ name: 'Danh sách người dùng' }]} />

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-header-text">Danh mục người dùng</h5>
                            </div>
                            <div className="card-block">
                                <div className="form-group row">
                                    <label className="col-xs-2 col-form-label form-control-label">
                                        Tên người dùng
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
                                        <a className="dt-button buttons-copy buttons-html5" aria-controls="advanced-table" href='/' >
                                            <span>
                                                <i className="icofont icofont-plus"></i>
                                                Thêm mới
                                            </span>
                                        </a>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-12 table-responsive">
                                            <DanhSachTaiSan />
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


export default Dashboard;