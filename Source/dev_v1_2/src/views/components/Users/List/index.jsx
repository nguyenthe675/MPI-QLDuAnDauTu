import React from "react";
import UserService from '../../../../services/UserService';
import Table from '../../UI/Table';


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

        UserService.allPage(data).then(res => {
            UserService.totalPage().then(total => {
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
                <Table
                    columns={columns}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={data}
                    pages={pages} // Display the total number of pages
                    loading={loading} // Display the loading overlay when we need it
                    onFetchData={this.fetchData} // Request new data when things change
                    defaultPageSize={10}
                />
            </div>
        );
    }
}

export default ListUser;
