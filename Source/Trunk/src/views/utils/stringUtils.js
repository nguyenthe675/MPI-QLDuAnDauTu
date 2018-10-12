/**
 * Lấy module hiện tại trên URL
 * @returns {string}
 */
export function getCurrentModule(url) {
    return window.location.pathname;
}

/**
 * Parse query string to an object
 * @param queryString
 * @returns {{}}
 */
export function parseQueryStringToObject( queryString ) {
    let params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
}

/**
 * thêm mới hoặc sửa lại param của query string
 * @param uri
 * @param key
 * @param value
 * @returns {*}
 */
export function updateQueryStringParameter(uri, key, value) {
    let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    let separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

/**
 * format secret id
 * @param id
 */
export function formatSecretId(id) {
    if (id) {
        let length = id.length;
        if (length >= 5) {
            id = '*******' + id[length-4]+id[length-3]+id[length-2]+id[length-1]
        }

    }
    return id
}

/**
 * chuyển filter sang thành queryString
 * @param filter
 */
export function filterToQueryString(filter) {
    let queryString = '';
    if (filter) {
        // update order
        const order = filter.order;
        if (order) {
            queryString = updateQueryStringParameter(queryString, 'sort', order.split(' ')[0]);
            queryString = updateQueryStringParameter(queryString, 'order', order.split(' ')[1]);
        }

        //update page, limit
        const size = filter.limit || 20;
        const page = (filter.skip || 0)/size;
        if (order) {
            queryString = updateQueryStringParameter(queryString, 'page', page);
            queryString = updateQueryStringParameter(queryString, 'size', size);
        }

        // xử lý với mảng where.and
        let label = '';
        let query = '';
        if (filter.where && filter.where.and) {
            const and = filter.where.and;
            and.map((item, index) => {
                if (typeof item === 'object' && !item.or) {
                    //gán label bằng property của item
                    for (let p in item) {
                        label = p;
                    }
                    // nếu item[label] === 'object'
                    if (typeof item[label] === 'object') {
                        //với trường hợp search like
                        if (item[label].ilike) {
                            query = query + `${label}=='*${item[label].ilike.replace(/%/g, '')}*';`;
                        }
                        //với trường hợp search between
                        if (item[label].between) {
                            //something
                        }
                    } else {
                        //search equal
                        query = query + `${label}==${item[label]};`;
                    }
                } else if (typeof item === 'object' && item.or) {
                    let orQuery = '(';
                    // trường hợp or
                    item.or.map((i, j) => {
                        for (let p in i) {
                            label = p;
                        }
                        //something
                        orQuery = orQuery + `${label}==${i[label]},`;
                        if (j === item.or.length - 1) orQuery = orQuery + ');'
                    });
                    //loại bỏ dấu ',' ở cuối
                    if(orQuery.indexOf(',') > -1 && orQuery[orQuery.length - 2] === ',') orQuery = orQuery.substr(0, orQuery.length - 2);
                    // add vào query string
                    query = query + orQuery;
                }
            });
            //loại bỏ dấu ';' ở cuối
            if(query.indexOf(';') > -1 && query[query.length - 1] === ';') query = query.substr(0, query.length - 1);
            queryString = updateQueryStringParameter(queryString, 'query', query);
        }

        return queryString;
    }
    return ''
}

export function makeid() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function eclipseString(text, length, eclipseChar) {
    let result = '';
    eclipseChar = eclipseChar || '...';
    if (text && typeof text === 'string') {
        if (text.length > length) {
            result = text.substr(0, length - eclipseChar.length) + eclipseChar;
        } else {
            result = text;
        }
    }

    return result
}
