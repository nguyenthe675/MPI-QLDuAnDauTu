import {FilterUtils} from "../../utils/filterUtils";
let _ = require('lodash');

export default class FilterManager {
    /**
     * Thêm một điều kiện lọc dạng AND, thay thế vào điều kiện cũ nếu đã có
     * @param component
     * @param e
     * @param cond
     */
    static replaceFilter(component,e, cond) {
        let isChanged = false;
        let filter = _.cloneDeep(component.props.filter) || {where: {and: []}};
        if (cond) {
            let before = JSON.stringify(filter.where);
            filter = FilterUtils.replaceFilter(filter, cond);
            let after = JSON.stringify(filter.where);
            isChanged = before !== after;
        }
        else {
            let arr = filter.where && filter.where.and ? filter.where.and : [];
            for (let condIndex in arr) {
                let condObj = arr[condIndex];
                if (e.props.field === FilterUtils.getFieldKey(condObj)) {
                    arr.splice(condIndex, 1);
                    isChanged = true;
                    break;
                }
            }
        }

        if (isChanged) {
            filter.skip = 0;
            component.props.onFilterChanged(filter);
        }
    }

    /**
     * Thêm một điều kiện lọc dạng AND, nếu đã có một điều kiện cùng trường thông tin thì sẽ là OR cho trường thông tin đó
     * @param component
     * @param e
     * @param cond
     */
    static addFilter(component, e, cond) {
        let filter;
        if (component.props.filter) {
            filter = _.cloneDeep(component.props.filter);
        }
        else { filter = {}}

        if (!filter.where) {
            filter.where = { and : []};
        }
        if (!Array.isArray(filter.where.and)) {
            filter.where.and = [];
        }

        let isChanged = false;
        if (cond) {
            filter = FilterUtils.addFilter(filter, cond);
            isChanged = true;
        }
        else {
            let arr = filter.where && filter.where.and ? filter.where.and : [];
            for (let condIndex in arr) {
                let condObj = arr[condIndex];
                if (e.props.field === FilterUtils.getFieldKey(condObj)) {
                    arr.splice(condIndex, 1);
                    isChanged = true;
                    break;
                }
            }
        }

        if (isChanged) {
            filter.skip = 0;
            component.props.onFilterChanged(filter);
        }
    }

    /**
     * Xóa bộ lọc: xóa điều kiện where và reset về trang đầu, việc sorting và số phần tử mỗi trang giữ nguyên
     * @param filter
     * @returns {*}
     */
    static clearFilter(filter) {
        let newFilter = _.cloneDeep(filter);
        delete newFilter.where;
        delete newFilter.skip;
        return newFilter
    }
}