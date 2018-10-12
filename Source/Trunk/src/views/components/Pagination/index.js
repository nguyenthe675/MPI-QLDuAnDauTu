import React from 'react'
import ReactPaginate from 'react-paginate'
export default class Pagination extends React.Component {
    render() {
        let {currentPage, pageSize, pageCount, onPageChange, forcePage, total} = this.props;

        const minRecord = currentPage * pageSize + 1;
        const maxRecord = minRecord + pageSize < total ? minRecord + pageSize : total;
        return (
            <div className="pdl15 pdr15">
                <div className="row">

                    <div className="col-md-6 pdt5">
                        <h4 className="roboto-regular txt-size-h4 txt-color-black2 fll mgr10 line-height167">
                            Hiển thị {pageSize} kết quả / trang
                        </h4>
                        <span className="txt-size-h5 txt-color-black2 fll dpl-block pdt5 cursor-pointer">
                        {/*<i className="fas fa-chevron-down" />*/}
                    </span>
                    </div>


                    <div className="col-md-6">
                        {
                            pageCount > 1 &&
                            <nav>
                                <ReactPaginate
                                    previousLabel={<i className="fas fa-chevron-left" />}
                                    nextLabel={<i className="fas fa-chevron-right" />}
                                    breakLabel={<a className="page-link">...</a>}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    initialPage={currentPage}
                                    forcePage={forcePage}
                                    pageRangeDisplayed={5}
                                    onPageChange={onPageChange}
                                    previousClassName={"_paginationPrev page-item cursor-pointer"}
                                    nextClassName={"_paginationNext page-item cursor-pointer"}
                                    pageClassName={"_paginationItem page-item cursor-pointer"}
                                    breakClassName="_paginationItem page-item disabled"
                                    containerClassName="_pagination pagination flr"
                                    subContainerClassName="pages pagination"
                                    disableInitialCallback={true}
                                    activeClassName="active"
                                />
                            </nav>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
