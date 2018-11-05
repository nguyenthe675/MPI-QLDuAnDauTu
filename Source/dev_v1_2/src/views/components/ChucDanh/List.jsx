import React from "react";
import svc from '../../../services/ChucDanhService';
import Table from '../UI/Table';


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
        Header: "Mã chức danh",
        accessor: "maChucDanh"
    },
    {
        Header: "Tên chức danh",
        id: "tenChucDanh",
        accessor: d => d.tenChucDanh
    },
    {
        Header: "Mô tả",
        accessor: "moTa"
    }
];

class ListChucDanh extends React.Component {
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
            sortExpression: "maChucDanh asc",
        }

        svc.allPage(data).then(res => {
            let pages = Math.floor(res.data.Count / state.pageSize);
            this.setState({
                data: res.data.Items,
                pages: pages,
                loading: false
            });
        });
    }
    render() {
        const { data, pages, loading } = this.state;
        return (
            <div>
                <Table
                    columns={columns}
                    data={data}
                    pages={pages} // Tổng số trang
                    loading={loading} // Hiển thị loading trên table khi load dữ liệu
                    onFetchData={this.fetchData} // Get change data
                    defaultPageSize={10}
                />
            </div>
        );
    }
}

export default ListChucDanh;
