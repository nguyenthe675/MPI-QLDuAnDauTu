/**
 * Created by Taobao dev team - 27/1/2018
 */

const dic = require('./vi-VN.json');
module.exports = {
    t: function (message) {
        if (dic[message]) {
            return dic[message];
        }
        return message;
    }
};