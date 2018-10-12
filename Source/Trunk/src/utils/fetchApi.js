/**
 * created by Taobao dev team - 15/1/2018
 */
import * as config from '../config';
const HTTP_NO_CONTENT = 204;

/**
 * function fetch api from server
 * @param endpoint
 * @param payload
 * @returns {Promise<*>}
 */
export default async(endpoint, payload) => {

    if (!global.fetchOverwrite) {
        global.fetch = null;
        require('whatwg-fetch-timeout');
        global.fetchOverwrite = true;
    }

    let fullURL = endpoint;

    if (!endpoint.startsWith('http')) {
        // validate endpoint
        endpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;

        // calc url
        fullURL = endpoint.indexOf(config.apiUrl) === -1 ? config.apiUrl + endpoint : endpoint;
    }

    let res;
    // Nếu có mất mạng thì vẫn trả về mã lỗi như bình thường
    if(!navigator.onLine) {
        return {
            statusCode: "000",
            name: "Error",
            message: "No network connection"
        }
    }

    try {
        res = await fetch(fullURL, {...payload, timeout: 15000});
    } catch (err) {
        console.log('err', err, err.statusCode, err.code, err.status);
        let error  = new Error('Có lỗi xảy ra, vui lòng thử lại!');
        error.statusCode = 'timeout';
        throw error;
    }

    // check status HTTP_NO_CONTENT
    if (res.status === HTTP_NO_CONTENT) {
        return true;
    }

    const json = await res.json();
    if (!res.ok) {
        throw typeof json.error === 'object' ? json.error : res;
    }

    return json;
};

