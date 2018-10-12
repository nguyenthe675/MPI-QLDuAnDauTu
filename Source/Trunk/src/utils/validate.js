/**
 * validate function for validate form data,
 * if value not match then return error message, otherwise return undefined
 * created by Taobao dev team - 18/1/2018
 */

const validateRequired = value => (value ? undefined : 'Không được để trống');
const maxLength = (name, max) => value =>
    value && value.length > max ? `${name ? name : ''} phải chứa ít hơn hoặc bằng ${max} ký tự` : undefined;
const maxLength15 = maxLength(null, 15);
const minLength = (name, min) => value =>
    value && value.length < min ? `${name ? name : ''} phải chứa ít nhất ${min} ký tự` : undefined;

const validateMinLength = (value, name, min) => value && value.length < min ? `${name ? name : ''} phải chứa ít nhất ${min} ký tự` : undefined;
const validateMaxLength = (value, name, max) => value && value.length > max ? `${name ? name : ''} phải chứa ít hơn hoặc bằng ${max} ký tự` : undefined;

const minLength2 = minLength(null, 2);
const number = name => value =>
    value && isNaN(Number(value)) ? `${name} phải là các ký tự số` : undefined;
const minValue = (name, min) => value =>
    value && value < min ? `${name} phải lớn hơn hoặc bằng ${min}` : undefined;
const validateEmail = value =>
    value && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value)
        ? 'Địa chỉ email không hợp lệ'
        : undefined;
const orEmail = value =>
    value.indexOf("@") === -1 ? undefined : validateEmail(value);

const alphaNumeric = value =>
    value && /[^a-zA-Z0-9 ]/i.test(value)
        ? 'Chỉ chứa ký tự chữ cái hoặc số'
        : undefined;
const phoneNumber = value =>
    value && !/^(0|[1-9][0-9]{9})$/i.test(value)
        ? 'Số điện thoại không hợp lệ, ít nhất 10 ký tự'
        : undefined;
const validatePhoneNumber = value => {
    // value = value.replace(/"[ .-]"/g ,"");
    // var re = /((^(([+](0-9)?[)]{2,5})|01[2689]|09|08)[0-9]{8})|^(02)[0-9]{9})$/;
    let re = /((^((0|([(]{0,1}[+][0-9]{2,6}[)]{0,1}))1[2689]|(0|([(]{0,1}[+][0-9]{2,6}[)]{0,1}))9|(0|([(]{0,1}[+][0-9]{2,6}[)]{0,1}))8)[0-9]{8})|^((0|([(]{0,1}[+][0-9]{2,6}[)]{0,1}))2)[0-9]{9})$/;//^[0-9]*$
    // let re = /^[+]?[0-9]{3}|^[(]?[+][0-9]{3,5}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/im;
    return !re.test(value) ? 'Số điện thoại không hợp lệ' : undefined;
};

const validateUserName = value => {
    if (/[^a-zA-Z0-9_-]/i.test(value)) return 'Tên tài khoản không chứa ký tự đặc biệt';
    let includeSpecialWord = false;
    let keyName = ['admin', 'administrator', 'god', 'mod', 'moderator', 'quantri', 'seudo', 'baogam', 'gobiz', 'fuck', 'hochiminh', 'hochutich', 'bacho'];

    let i;
    for (i = 0; i < keyName.length; i++) {
        if (value.toLowerCase().indexOf(keyName[i]) !== -1) {
            includeSpecialWord = true;
        }
    }

    if (includeSpecialWord)
        return 'Tên tài khoản không hợp lệ';
    else
        return undefined;

};

const validatePropName = value => {
    if (/^@?[a-zA-Z_]\w*(\.@?[a-zA-Z_]\w*)*$/i.test(value)) return 'Key không thể chứa ký';
    let includeSpecialWord = false;
    let keyName = ['admin', 'administrator', 'god', 'mod', 'moderator', 'quantri', 'seudo', 'baogam', 'gobiz', 'fuck', 'hochiminh', 'hochutich', 'bacho'];

    let i;
    for (i = 0; i < keyName.length; i++) {
        if (value.toLowerCase().indexOf(keyName[i]) !== -1) {
            includeSpecialWord = true;
        }
    }

    if (includeSpecialWord)
        return 'Tên tài khoản không hợp lệ';
    else
        return undefined;

};

const validateFullName = value =>
    value && /[0-9\-@_.,!@#$%^&*()+=`~\\/{}[\]'":;?]/i.test(value)
        ? 'Họ và tên không được chứa ký tự đặc biệt hoặc số'
        : undefined;

const validateRole = value =>
    value && /[@,!@#$%^&*()+=`~\\/{}[\]'":;?]/i.test(value)
        ? 'Không được chứa ký tự đặc biệt'
        : undefined;

const validateCode = value =>
    value && !/^([a-z]{1,})(_[a-z0-9]{1,})*$/.test(value)
        ? 'Code không đúng định dạng'
        : undefined;

export {
    validateRequired,
    maxLength,
    maxLength15,
    number,
    minLength,
    minLength2,
    validateEmail,
    orEmail,
    phoneNumber,
    alphaNumeric,
    minValue,
    validatePhoneNumber,
    validateUserName,
    validateFullName,
    validatePropName,
    validateMinLength,
    validateMaxLength,
    validateRole,
    validateCode
}