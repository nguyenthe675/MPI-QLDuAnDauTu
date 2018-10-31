import React from "react";
import CustomTableLoader from './CustomTableLoader';
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class Table extends React.Component {
    render() {
        return (
            <div>
                <ReactTable
                    columns={this.props.columns}
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    data={this.props.data}
                    pages={this.props.pages} // Display the total number of pages
                    loading={this.props.loading} // Display the loading overlay when we need it
                    onFetchData={this.props.onFetchData} // Request new data when things change
                    LoadingComponent={CustomTableLoader}
                    defaultPageSize={this.props.defaultPageSize}
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

export default Table;
