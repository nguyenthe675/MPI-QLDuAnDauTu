import React from 'react'
import FilterManager from '../../components/Filters/FilterManager'
import TextInputFilter from '../../components/Filters/TextInputFilter'
import {FilterUtils} from "../../utils/filterUtils";
import * as _ from "lodash";
import moment from 'moment';
const md5 = require("blueimp-md5");

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
        const {currentPage, pageCount, count, clientData} = this.props;
        const avatar = 'https://www.gravatar.com/avatar/' + md5(clientData.name) + '?d=identicon';
        return (
            <div className="filter pdr15 pdl15 mgbt15">
                <div className="row">

                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-lg-5 col-md-4">
                                <ul className="pdt5">
                                    <li className="fll mgr15">
                                        <span className="img-app dpl-block">
                                            <img src={avatar} />
                                        </span>
                                    </li>
                                    <li className="fll">
                                        <span className="_filterClientName txt-app roboto-bold txt-size-h4 txt-color-blue2 dpl-il-block">
                                            {clientData.name}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-7 col-md-8">
                                <TextInputFilter
                                    className={'_name'}
                                    name={"name"}
                                    placeholder={'Tìm kiếm tên nhóm'}
                                    field={"name"}
                                    fieldName={'Role'}
                                    op={"ilike"}
                                    wildcardStart={true}
                                    wildcardEnd={true}
                                    onChanged={this.replaceFilter}
                                    filter={this.props.filter}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <ul className="flr pdt10">
                            <li className="fll">
                                <h3 className="roboto-regular txt-color-black2 txt-size-h3">
                                    Trang {currentPage ? currentPage + 1 : 1}/{pageCount || 1}
                                </h3>
                            </li>
                            <li className="fll">
                                <span className="roboto-regular txt-color-black2 txt-size-h3 dpl-block mgr10 mgl10">|</span>
                            </li>
                            <li className="fll">
                                <span className="roboto-regular txt-color-black2 txt-size-h3">Hiện tại có {count} người dùng</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}
