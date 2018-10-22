import React from "react";
import _ from "lodash";
// import { makeData } from "./FakeAPI";
import { ApiClient } from '../../../../services/api';
import CircularProgress from '@material-ui/core/CircularProgress';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
const client = new ApiClient('http://localhost/EPS.QLTS.Services.WebAPI/API/', false);
// const rawData = makeData();

const columns = [
    {
        Header: "STT",
        id: "row",
        maxWidth: 50,
        filterable: false,
        Cell: (row) => {
            return <div>{row.index + 1}</div>;
        }
    },
    {
        Header: "Tài khoản",
        accessor: "Username"
    },
    {
        Header: "Tên người dùng",
        id: "FullName",
        accessor: d => d.FullName
    },
    {
        Header: "Đơn vị",
        accessor: "TenDonVi"
    }
];

const customLoadingComponent = (props) => {
    return props.loading ?
        <div className='-loading -active'>
            <div className="-loading-inner">
                <CircularProgress />
            </div>
        </div> : null;
}

class ListUser extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            pages: null,
            loading: true
        };
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData(state, instance) {
        // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
        // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
        this.setState({ loading: true });
        // Request the data however you want.  Here, we'll use our mocked service we created earlier
        let data = {
            page: state.page,
            pageSize: state.pageSize,
            sortExpression: "Username asc",
        }

        client.post(`User/GetAllUsers`, data).then(res => {
            client.post(`User/GetTotalUsers`).then(total => {
                let pages = Math.floor(total.data / state.pageSize);
                this.setState({
                    data: res.data,
                    pages: pages,
                    loading: false
                });
            });

        });
    }
    render() {
        const { data, pages, loading } = this.state;
        return (
            <div>
                <ReactTable
                    columns={columns}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={data}
                    pages={pages} // Display the total number of pages
                    loading={loading} // Display the loading overlay when we need it
                    onFetchData={this.fetchData} // Request new data when things change
                    LoadingComponent={customLoadingComponent}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    previousText="Trang trước"
                    nextText="Trang sau"
                    loadingText="Đang tải"
                    pageText="Trang"
                    ofText="trên"
                    rowsText="bản ghi"
                    pageJumpText="chuyển đến trang"
                    rowsSelectorText="bản ghi trên trang"
                />
            </div>
        );
    }
}

export default ListUser;
