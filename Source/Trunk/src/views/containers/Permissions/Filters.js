import React from 'react'
import FilterManager from '../../components/Filters/FilterManager'
import TextInputFilter from '../../components/Filters/TextInputFilter'
import {FilterUtils} from "../../utils/filterUtils";
import * as _ from "lodash";
import moment from 'moment';

export default class Filters extends React.PureComponent {

    addFilter = (e, cond) => {
        FilterManager.addFilter(this, e, cond);
    };

    replaceFilter = (e, cond) => {
        FilterManager.replaceFilter(this, e, cond);
    };

    handleRemoveItem = (item) => {
        if (!this.props.filter.where || !this.props.filter.where.and) {
            return;
        }

        let filter = _.cloneDeep(this.props.filter);
        let found = false;
        let conArray = filter.where.and || [];

        let condObj = null;
        for (let index in conArray) {
            let field = FilterUtils.getFieldKey(conArray[index]);
            // console.log('field...', index, ': ', field, item);
            if (field === item.field) {
                found = true;
                //found him
                condObj = conArray[index];
                let keys = Object.keys(condObj);
                if (keys[0] === 'or') {
                    if (condObj['or'].length > 1) {
                        // lấy ra index của item trong mảng or
                        let indexItem = condObj['or'].map(function(x) { return x[field] }).indexOf(item.value);
                        condObj['or'].splice(indexItem, 1);
                    } else {
                        conArray.splice(index, 1);
                    }
                }
                else if (keys[0] === 'and') {
                    conArray.splice(index, 1);
                }
                else {
                    conArray.splice(index, 1);
                }
            }
        }

        if (filter.where.and.length === 0) {
            delete filter.where.and;
        }

        if (found) {
            filter.skip = 0;
        }
        this.props.onFilterChanged(filter);
    };

    onPageChangedNext = () => {
        let page = {};
        if (this.props.currentPage < this.props.pageCount) {
            page.selected = (this.props.currentPage - 1) + 1;
            this.props.onPageChanged(page)
        }
    };
    onPageChangedPrev = () => {
        let page = {};
        if (this.props.currentPage >= 2) {
            page.selected = this.props.currentPage - 1 - 1;
            this.props.onPageChanged(page)
        }
    };

    /**
     * chuyển giá trị của Prop sang string, tránh 1 vài lỗi liên quan đến việc so sánh tuyệt đối giữa số với string (vd: id)
     * @param data
     * @param prop
     * @returns {Array}
     */
    convertPropToString = (data, prop) => {
        let array = [];
        if (data && data.length > 0) {
            //Chuyển giá trị của prop sang string
            data.map(item => {
                array.push({...item, [prop]: item[prop] + ''})
            })
        }
        return array;
    };

    render() {
        // console.log('order filter props', this.props);
        const {currentPage, pageCount, count} = this.props;
        return (
            <div className="filter pdl15 pdr15">
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-6 pdr5">
                                <TextInputFilter
                                    className={'_name'}
                                    name={"name"}
                                    placeholder={'Permission'}
                                    field={"name"}
                                    fieldName={'Permission'}
                                    op={"ilike"}
                                    wildcardStart={true}
                                    wildcardEnd={true}
                                    onChanged={this.replaceFilter}
                                    filter={this.props.filter}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <ul className="overflow-hidden list-inline">
                            <li className="fll mgr10">
                                <a id={'_prevBtn'} className={currentPage === 1 ? '' : 'cursor-pointer'} onClick={() => this.onPageChangedPrev()}>{'<'}</a>
                            </li>
                            <li className="fll mgr10">
                                <span className="txt-size-h6 txt-color-black openSans-regular dpl-block pdt5">
                                    Trang <span id={'_currentPage'}>{currentPage + 1}</span>/<span id={'_pageCount'}>{pageCount}</span> (<span id={'_totalCount'}>{count}</span>)
                                </span>
                            </li>
                            <li className="fll">
                                <a id={'_nextBtn'} className={currentPage >= pageCount ? '' : 'cursor-pointer'} onClick={() => this.onPageChangedNext()}>
                                    {'>'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/*<div className="col-md-12">*/}
                        {/*<FilterDisplayBar*/}
                            {/*clearFilter={this.props.clearFilter}*/}
                            {/*items={this.props.filterDisplayItems}*/}
                            {/*onRemoveItem={this.handleRemoveItem}*/}
                        {/*/>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}
