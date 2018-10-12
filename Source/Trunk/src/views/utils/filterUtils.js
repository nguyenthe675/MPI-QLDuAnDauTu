import URI from "urijs";
import moment from "moment";

let _ = require('lodash');
const SEPARATOR = ';';

export class FilterUtils {

    static buildQueryString(filter, opts = {}) {
        opts = Object.assign({
            contains: []
        }, opts);
        let uri = new URI("");
        try {
            if (filter.where && filter.where.and) {
                for (let condition of filter.where.and) {
                    //firstly, we support field
                    if (Array.isArray(condition)) {
                        // should not be array
                    }
                    else {
                        for (let field in condition) {
                            if (!condition.hasOwnProperty(field)) {
                                continue;
                            }

                            if (field === 'or') {
                                let fieldKey = this.getFieldKey(condition);
                                let queryKey = '';
                                let values = [];

                                for (let subCond of condition['or']) {
                                    let params = subCond[fieldKey];

                                    if (typeof params === 'string') {
                                        queryKey = fieldKey;
                                        values.push(params);
                                        continue;
                                    }

                                    if (!queryKey) {
                                        let keys = Object.keys(params);
                                        if (keys.length === 0) {
                                            queryKey = fieldKey;
                                        }
                                        queryKey = this.genParamKey(fieldKey, keys.length ? keys[0] : 'eq');
                                    }

                                    let value = Object.keys(params).length > 0 ? this.getParamValue(params) : params;
                                    values.push(value);
                                }

                                uri.addSearch(queryKey, values.join(SEPARATOR));
                            }
                            else if (field === 'and') {

                            }
                            else {
                                let params = condition[field];

                                if (typeof params === 'object' && !(params instanceof Date)) {
                                    this.addQueryFromCondition(uri, field, params);
                                }
                                else {
                                    this.addQueryFromCondition(uri, field, {eq: params});
                                }
                            }
                        }
                    }

                }
            }

            if (filter.limit) {
                if (!filter.skip) {
                    uri.removeSearch("page");
                }
                else {
                    let page = filter.skip/filter.limit + 1;
                    uri.removeSearch("page");
                    uri.addSearch('page', page.toFixed(0));
                }
            }

            if (filter.order) {
                uri.addSearch('sort', filter.order);
            }

            //TODO: where contains field part

            return uri.search();
        }
        catch (e) {
            return "";
        }
    }

    static addQueryFromCondition(uri, field, params) {
        let keys = Object.keys(params);
        if (keys.length === 0) {
            return;
        }

        let queryKey = this.genParamKey(field, keys[0]);
        let value = this.getParamValue(params);

        uri.addSearch(queryKey, value);
    }

    static getParamValue(params) {
        let keys = Object.keys(params);
        let value = params[keys[0]];
        if (value instanceof Date) {
            value = moment(value).format("YYYY-MM-DD");
        }
        return value;
    }

    static genParamKey(field, op) {
        switch (op.toLowerCase()) {
            case "gt":
                return _.snakeCase(field) + ".from";
            case "lt":
                return _.snakeCase(field) + ".to";
            case "eq":
                return _.snakeCase(field);
            default:
                return _.snakeCase(field) + "." + op;
        }
    }

    static createConditionFromQuery(key, value, opts = {}) {
        opts = Object.assign({
            eq: 'eq',
            wildcardStart: false,
            wildcardEnd: false
        }, opts);
        let field, op, compare;

        if (key.endsWith('.from')) {
            field = _.camelCase(key.substr(0, key.length - 5));
            op = 'gt';
        }
        else if (key.endsWith('.to')) {
            field =  _.camelCase(key.substr(0, key.length - 3));
            op = 'lt';
        }
        else if (key.indexOf('.') > -1) {
            let keys = key.split('.');
            field =  _.camelCase(keys[0]);
            op = keys[1];
        }
        else {
            field = _.camelCase(key);
            op = opts.eq;
        }

        if (/\d\d\/\d\d\/\d\d\d\d/g.test(value)) {
            if (op === 'lt') {
                compare = moment(value).format('YYYY-MM-DD 23:59:59');
            }
            else {
                compare = moment(value).format('YYYY-MM-DD 00:00:00');
            }
            // compare = moment(compare).format()
        }
        else {
            compare = value;
        }

        if (opts.wildcardStart) {
            compare = '%' + compare;
        }

        if (opts.wildcardEnd) {
            compare = compare + '%';
        }

        let result = {};

        if (compare.indexOf(SEPARATOR)> -1) {
            let values = compare.split(SEPARATOR);
            let orArray = [];
            for (let value of values) {
                if (op === 'eq') {
                    orArray.push({[field]: value});
                }
                else {
                    orArray.push({[field]: {[op]: value}});
                }
            }
            return { 'or': orArray };
        }

        if (op === 'eq') {
            result[field] = compare;
        }
        else {
            result[field] = {[op]: compare};
        }
        return result;
    }

    static buildFilterFromQueryString(filter, query, opts = {}) {
        opts = Object.assign({
            includes: [],
            excludes: [],
            ilike: [],
            limit: 20
            //contains: []
        }, opts);
        let queryStringObject = URI.parseQuery(query);

        filter.where = { and : [ ]};

        for (let key in queryStringObject) {
            if (!queryStringObject.hasOwnProperty(key)) {
                continue;
            }

            if (opts.excludes.indexOf(key) > -1) {
                continue;
            }

            if (key === 'page' || key === 'sort' || key === 'include') {
                continue;
            }

            // has includes and the key is not allowed
            if (opts.includes.length > 0 && opts.includes.indexOf(key) === -1) {
                continue;
            }

            let condOpts = {};
            //TODO: consider
            // if (opts.contains.indexOf(key) > -1) {
            //     condOpts = {
            //         eq: 'ilike',
            //         wildcardStart: true,
            //         wildcardEnd: true
            //     }
            // }

            let cond = this.createConditionFromQuery(key, queryStringObject[key], condOpts);
            filter.where.and.push(cond);
        }

        if (filter.where.and.length === 0) {
            delete filter.where.and;
        }

        if (queryStringObject.page) {
            filter.limit = opts.limit;
            filter.skip = (queryStringObject.page - 1) * opts.limit;
        } else {
            filter.limit = opts.limit;
            filter.skip = 0;
        }

        if (queryStringObject.sort) {
            filter.order = queryStringObject.sort;
        }

        return filter;
    }

    static addFilter(filter, cond) {
        if (!cond) return filter;

        let newKey = this.getFieldKey(cond);

        //nếu là add filter thì sẽ add thành or
        if (filter && filter.where && filter.where.and) {
            //tìm trong where đến field cần tìm kiếm
            let condIndex = -1;
            for (let index in filter.where.and) {
                let condObj = filter.where.and[index];
                let key = this.getFieldKey(condObj);
                if (key === newKey) {
                    condIndex = index;
                    break;
                }
            }

            if (condIndex > -1) {
                // noinspection JSUnusedAssignment
                filter.where.and[condIndex] = this.addCondition(filter.where.and[condIndex], cond);
            } else {
                filter.where.and.push(cond);
            }
        }
        else {
            if (!filter.where) {
                filter.where = {};
            }
            filter.where.and = [];
            filter.where.and.push(cond);
        }

        return filter;
    }

    static replaceFilter(filter, cond) {
        if (!cond) return filter;

        let newKey = this.getFieldKey(cond);

        if (filter && filter.where && filter.where.and) {
            //tìm trong where đến field cần tìm kiếm
            let condIndex = -1;
            for (let index in filter.where.and) {
                let condObj = filter.where.and[index];
                let key = this.getFieldKey(condObj);
                if (key === newKey) {
                    condIndex = index;
                    break;
                }
            }

            if (condIndex > -1) {
                // noinspection JSUnusedAssignment
                filter.where.and[condIndex] = cond;
            } else {
                filter.where.and.push(cond);
            }
        }
        else {
            if (!filter.where) {
                filter.where = {};
            }
            filter.where.and = [];
            filter.where.and.push(cond);
        }

        return filter;
    }

    /**
     * Thêm một điều kiện tìm kiếm vào dưới dạng or (nếu đang là điều kiện thường thì biến thành or)
     * @param condition điều kiện gốc (có thể là or sẵn hoặc là điều kiện thường)
     * @param cond điều kiện thêm mới
     * @returns {*}
     */
    static addCondition(condition, cond) {
        let key = Object.keys(condition)[0];
        if (key === 'or') {
            if (Array.isArray(condition[key])) {
                for (let existed of condition[key]) {
                    if (JSON.stringify(existed) === JSON.stringify(cond)) {
                        //cond is existed, we do not add anything
                        return condition;
                    }
                }
                condition[key].push(cond);
            }
        }
        else if (key === 'and') {
            console.error("Unexpected condition");
        }
        else {
            let oldCond = Object.assign({}, condition);
            if (JSON.stringify(oldCond) === JSON.stringify(cond)) {
                //cond is existed, we do not add anything
                return condition;
            }
            condition  = {
                or: [oldCond, cond]
            }
        }
        return condition;
    }

    static getFieldKey(cond) {
        if (!cond) return null;
        if (Object.keys(cond).length === 0) return null;

        let key = Object.keys(cond)[0];
        if (key === 'or') {
            let condArray = cond[key];
            if (condArray.length === 0) return null;
            return this.getFieldKey(condArray[0]);
        }
        else if (key === 'and') {
            let condArray = cond[key];
            if (condArray.length === 0) return null;
            return this.getFieldKey(condArray[0]);
        }
        else {
            //key chính là tên field
            return key;
        }
    }

    static getFilterDisplay(filter, fields = {}, opts = {}) {
        if (!filter.where || !filter.where.and) {
            return [];
        }

        let result = [];
        let andArray = filter.where.and;

        for (let condIndex in andArray) {
            let item = {};
            let condObj = andArray[condIndex];
            let fieldKey = this.getFieldKey(condObj);
            item.field = fieldKey;

            if (fields[fieldKey]) {
                item.name = fields[fieldKey]
            }
            else {
                item.name = fieldKey;
            }

            let key = Object.keys(condObj)[0];
            //nếu là or thì phải thêm nhiều đối tượng
            if (key === 'or') {
                let condArray = condObj['or'];
                for (let index in condArray) {
                    let subItem = Object.assign({}, item);
                    subItem.text = this._getTextValue(condArray[index], opts[fieldKey]);
                    subItem.value = this.getOpValue(condArray[index]);
                    subItem.index = index;
                    result.push(subItem);
                }
            }
            //nếu là and thì thêm 1 đối tượng thay vì nhiều
            else if (key === 'and') {

            }
            //nếu không thì lấy trực tiếp
            else {
                item.text = this._getTextValue(condObj, opts[fieldKey]);
                item.value = this.getOpValue(condObj);
                result.push(item);
            }
        }

        return result;
    }

    static _getTextValue(condObj, opts) {
        let value = this.getOpValue(condObj);

        if (opts) {
            if (opts.hasOwnProperty(value)) {
                return opts[value];
            }
        }

        return value;
    }

    static getOpValue(condObj) {
        if (condObj == null) return '';
        let ops = condObj[Object.keys(condObj)[0]];
        if (typeof ops === 'object') {
            let op = Object.keys(ops)[0];
            let value = Object.values(ops)[0];

            if (op === 'eq') {
                return value;
            }
            else if (op === 'like' || op === 'ilike') {
                return Object.values(ops)[0].replace ? Object.values(ops)[0].replace(/%/g,'') : Object.values(ops)[0];
            }
            else if (op === 'between'){
                let from, to;
                if (/\d\d\d\d-\d\d-\d\d.*/g.test(value[0])) {
                    from = moment(value[0]).format("DD MMM YYYY");
                }
                else {
                    from = value[0];
                }
                if (/\d\d\d\d-\d\d-\d\d.*/g.test(value[1])) {
                    to = moment(value[1]).format("DD MMM YYYY");
                }
                else {
                    to = value[1];
                }
                return `${from} - ${to}`
            }
            else if (op === 'gte') {
                return `>= ${value}`;
            }
            else if (op === 'lte') {
                return `<= ${value}`;
            }
            else if (op === 'gt'){
                return `> ${value}`;
            }
            else if (op === 'lt'){
                return `< ${value}`;
            }
        }
        else {
            return ops.replace ? ops.replace(/%/g,'') : ops;
        }
    }

    static findFieldValue(filter, needle){
        if (!needle) return null;

        //nếu là add filter thì sẽ add thành or
        if (filter && filter.where && filter.where.and) {
            //tìm trong where đến field cần tìm kiếm
            let condIndex = -1;
            for (let index in filter.where.and) {
                let condObj = filter.where.and[index];
                let key = this.getFieldKey(condObj);
                if (key === needle) {
                    condIndex = index;
                    break;
                }
            }

            if (condIndex > -1) {
                let condObj = filter.where.and[condIndex];
                if (condObj['or']) {
                    return this.getOpValue(condObj['or'][0]);
                }
                return this.getOpValue(condObj);
            }
        }

        return null;
    }
}